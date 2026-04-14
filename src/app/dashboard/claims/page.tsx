'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea, Spinner } from '@/components/ui/primitives'
import { Badge } from '@/components/ui/primitives'
import { FileSearch, RotateCcw, AlertCircle, MessageSquare } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'not_filed', label: "I haven't filed yet" },
  { value: 'pending',   label: 'My claim is pending / in review' },
  { value: 'denied',    label: 'My claim was denied' },
  { value: 'appealing', label: "I'm in the appeals process" },
  { value: 'rated',     label: "I'm already rated — seeking increase or secondary" },
]

const COMMON_CONDITIONS = [
  'Tinnitus', 'Hearing Loss', 'PTSD', 'TBI', 'Lower Back',
  'Knee', 'Shoulder', 'Sleep Apnea', 'Anxiety/Depression', 'Scars',
]

interface FormData {
  condition:         string
  serviceConnection: string
  currentStatus:     string
  currentRating:     string
  hasEvidence:       boolean | null
  seenVSO:           boolean | null
  question:          string
}

const INITIAL: FormData = {
  condition:         '',
  serviceConnection: '',
  currentStatus:     'not_filed',
  currentRating:     '',
  hasEvidence:       null,
  seenVSO:           null,
  question:          '',
}

export default function DashboardClaimsPage() {
  const [form,    setForm]    = useState<FormData>(INITIAL)
  const [result,  setResult]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [done,    setDone]    = useState(false)

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.condition.trim()) { setError('Please enter a condition or disability.'); return }

    setLoading(true)
    setError('')
    setResult('')
    setDone(false)

    try {
      const res = await fetch('/api/benefits/claims', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition:         form.condition,
          serviceConnection: form.serviceConnection || undefined,
          currentStatus:     form.currentStatus,
          currentRating:     form.currentRating ? parseInt(form.currentRating) : undefined,
          hasEvidence:       form.hasEvidence ?? false,
          seenVSO:           form.seenVSO ?? false,
          question:          form.question || undefined,
        }),
      })

      if (!res.ok) throw new Error('Guidance unavailable. Please try again.')

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   text    = ''

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        text += decoder.decode(value, { stream: true })
        setResult(text)
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setForm(INITIAL)
    setResult('')
    setError('')
    setDone(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 border-b border-white/6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileSearch className="w-5 h-5 text-gold-400" />
          <h1 className="text-white font-semibold">Claims Copilot</h1>
          <Badge variant="free">Free</Badge>
        </div>
        {(result || done) && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </Button>
        )}
      </header>

      <div className="p-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Form */}
          <div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              AI-guided step-by-step support for filing, tracking, or appealing a VA disability claim.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white/3 rounded-xl border border-white/7 p-6 space-y-5">
                <h2 className="font-bold text-slate-300 text-xs uppercase tracking-widest">
                  Your Condition
                </h2>

                <div>
                  <label className="block text-sm font-medium text-navy-200 mb-2">
                    Condition / Disability <span className="text-gold-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {COMMON_CONDITIONS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => update('condition', c)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                          form.condition === c
                            ? 'bg-gold-500/15 border-gold-500/40 text-gold-400'
                            : 'border-navy-700 text-navy-400 hover:border-navy-600 hover:text-navy-300'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <Input
                    placeholder="Or type your condition..."
                    value={form.condition}
                    onChange={(e) => update('condition', e.target.value)}
                    required
                  />
                </div>

                <Textarea
                  label="How is it connected to your service?"
                  placeholder="e.g. Developed tinnitus from rifle range / IED blast / heavy machinery..."
                  rows={2}
                  value={form.serviceConnection}
                  onChange={(e) => update('serviceConnection', e.target.value)}
                  hint="Your 'nexus' — the link between your service and the condition."
                />
              </div>

              <div className="bg-white/3 rounded-xl border border-white/7 p-6 space-y-5">
                <h2 className="font-bold text-slate-300 text-xs uppercase tracking-widest">
                  Claim Status
                </h2>

                <Select
                  label="Where are you in the process?"
                  options={STATUS_OPTIONS}
                  value={form.currentStatus}
                  onChange={(e) => update('currentStatus', e.target.value)}
                />

                {form.currentStatus === 'rated' && (
                  <Input
                    label="Current Rating %"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 10"
                    value={form.currentRating}
                    onChange={(e) => update('currentRating', e.target.value)}
                  />
                )}

                {[
                  { field: 'hasEvidence' as const, label: 'Do you have supporting medical evidence?' },
                  { field: 'seenVSO'     as const, label: 'Have you spoken with a VSO?' },
                ].map(({ field, label }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-navy-200 mb-2">{label}</label>
                    <div className="flex gap-3">
                      {(['Yes', 'No', 'Not sure'] as const).map((opt) => {
                        const val = opt === 'Yes' ? true : opt === 'No' ? false : null
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update(field, val)}
                            className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                              form[field] === val
                                ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                                : 'border-navy-700 text-navy-500 hover:border-navy-600'
                            }`}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/3 rounded-xl border border-white/7 p-6">
                <Textarea
                  label="Specific question (optional)"
                  placeholder="e.g. What evidence do I need? How do I prep for my C&P exam? What are my appeal options?"
                  rows={3}
                  value={form.question}
                  onChange={(e) => update('question', e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2.5 text-sm text-red-400
                                bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full">
                <MessageSquare className="w-5 h-5" />
                Get Claims Guidance
              </Button>
            </form>
          </div>

          {/* Results */}
          <div>
            {!result && !loading && (
              <div className="bg-white/3 rounded-xl border border-white/7 p-10 text-center
                              min-h-[400px] flex flex-col items-center justify-center">
                <FileSearch className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="font-bold text-slate-500 mb-2">Your guidance will appear here</h3>
                <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                  Tell us about your condition and claim status to receive personalized, step-by-step guidance.
                </p>
              </div>
            )}

            {(loading || result) && (
              <div className="bg-white/3 rounded-xl border border-white/7 overflow-hidden sticky top-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                  <div className="flex items-center gap-2.5">
                    <FileSearch className="w-4 h-4 text-gold-400" />
                    <span className="font-semibold text-slate-200 text-sm">Claims Guidance</span>
                    {loading && <Spinner size="sm" />}
                  </div>
                  {done && (
                    <Button variant="ghost" size="icon" onClick={reset}>
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="p-6 max-h-[580px] overflow-y-auto scrollbar-thin">
                  {result ? (
                    <div className="space-y-2">
                      {result.split('\n').map((line, i) => {
                        if (line.startsWith('## '))  return <h2 key={i} className="text-gold-400 font-bold text-base mt-4 mb-2">{line.slice(3)}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="text-slate-200 font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h3>
                        if (line.startsWith('- '))   return <li key={i} className="ml-4 text-sm text-slate-300 list-disc">{line.slice(2)}</li>
                        if (line.match(/^\d+\. /))   return <li key={i} className="ml-4 text-sm text-slate-300 list-decimal">{line.replace(/^\d+\. /, '')}</li>
                        if (line.trim() === '')      return <div key={i} className="h-2" />
                        return <p key={i} className="text-sm text-slate-300 leading-relaxed">{line}</p>
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`h-3 bg-white/5 rounded animate-pulse ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
