'use client'

import { useState } from 'react'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea, Spinner } from '@/components/ui/primitives'
import { Badge }  from '@/components/ui/primitives'
import { FileSearch, ChevronRight, RotateCcw, AlertCircle, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const STATUS_OPTIONS = [
  { value: 'not_filed', label: "I haven't filed yet" },
  { value: 'pending',   label: 'My claim is pending / in review' },
  { value: 'denied',    label: 'My claim was denied' },
  { value: 'appealing', label: "I'm in the appeals process" },
  { value: 'rated',     label: "I'm already rated — seeking increase or secondary" },
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

const COMMON_CONDITIONS = [
  'Tinnitus', 'Hearing Loss', 'PTSD', 'TBI', 'Lower Back',
  'Knee', 'Shoulder', 'Sleep Apnea', 'Anxiety/Depression', 'Scars',
]

export default function ClaimsCopilotPage() {
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

  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main className="flex-1">

        {/* Header */}
        <div className="relative py-14 border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="container-wide relative z-10">
            <div className="flex items-center gap-2 text-sm text-navy-500 mb-4">
              <Link href="/benefits" className="hover:text-navy-300 transition-colors">Benefits Navigator</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-navy-300">Claims Copilot</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0">
                <FileSearch className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-navy-50">Claims Copilot</h1>
                  <Badge variant="free">Free</Badge>
                </div>
                <p className="text-navy-400 text-sm">
                  AI-guided step-by-step support for filing, tracking, or appealing a VA disability claim.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-navy-900 rounded-xl border border-navy-700 p-6 space-y-5">
                  <h2 className="font-bold text-navy-100 text-sm uppercase tracking-wide">
                    Your Condition
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-2">
                      Condition / Disability <span className="text-gold-500">*</span>
                    </label>
                    {/* Quick select chips */}
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
                    placeholder="e.g. Developed tinnitus from rifle range training / IED blast / heavy machinery..."
                    rows={2}
                    value={form.serviceConnection}
                    onChange={(e) => update('serviceConnection', e.target.value)}
                    hint="This is your 'nexus' — the connection between your service and the condition."
                  />
                </div>

                <div className="bg-navy-900 rounded-xl border border-navy-700 p-6 space-y-5">
                  <h2 className="font-bold text-navy-100 text-sm uppercase tracking-wide">
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

                  {/* Yes/No toggles */}
                  {[
                    { field: 'hasEvidence' as const, label: 'Do you have supporting medical evidence?' },
                    { field: 'seenVSO'     as const, label: 'Have you spoken with a VSO?' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-navy-200 mb-2">{label}</label>
                      <div className="flex gap-3">
                        {(['Yes', 'No', "Not sure"] as const).map((opt) => {
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

                <div className="bg-navy-900 rounded-xl border border-navy-700 p-6">
                  <Textarea
                    label="Specific question (optional)"
                    placeholder="e.g. What evidence do I need? How do I prepare for my C&P exam? What are my appeal options?"
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
                <div className="bg-navy-900 rounded-xl border border-navy-800 p-10 text-center
                                min-h-[400px] flex flex-col items-center justify-center">
                  <FileSearch className="w-12 h-12 text-navy-700 mb-4" />
                  <h3 className="font-bold text-navy-400 mb-2">Your guidance will appear here</h3>
                  <p className="text-sm text-navy-600 max-w-xs leading-relaxed">
                    Tell us about your condition and claim status to receive personalized, step-by-step guidance.
                  </p>
                </div>
              )}

              {(loading || result) && (
                <div className="bg-navy-900 rounded-xl border border-navy-700 overflow-hidden sticky top-20">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-navy-800">
                    <div className="flex items-center gap-2.5">
                      <FileSearch className="w-4 h-4 text-gold-400" />
                      <span className="font-semibold text-navy-100 text-sm">Claims Guidance</span>
                      {loading && <Spinner size="sm" />}
                    </div>
                    {done && (
                      <Button variant="ghost" size="icon" onClick={() => { setResult(''); setDone(false) }}>
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="p-6 max-h-[580px] overflow-y-auto scrollbar-thin">
                    {result ? (
                      <div className="space-y-2">
                        {result.split('\n').map((line, i) => {
                          if (line.startsWith('## '))   return <h2 key={i} className="text-gold-400 font-bold text-base mt-4 mb-2">{line.slice(3)}</h2>
                          if (line.startsWith('### '))  return <h3 key={i} className="text-navy-100 font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h3>
                          if (line.startsWith('- '))    return <li key={i} className="ml-4 text-sm text-navy-300 list-disc">{line.slice(2)}</li>
                          if (line.match(/^\d+\. /))    return <li key={i} className="ml-4 text-sm text-navy-300 list-decimal">{line.replace(/^\d+\. /, '')}</li>
                          if (line.trim() === '')       return <div key={i} className="h-2" />
                          return <p key={i} className="text-sm text-navy-300 leading-relaxed">{line}</p>
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className={`h-3 bg-navy-800 rounded animate-pulse ${i % 3 === 0 ? 'w-3/4' : 'w-full'}`} />
                        ))}
                      </div>
                    )}
                  </div>

                  {done && (
                    <div className="px-6 py-4 border-t border-navy-800 bg-navy-950/40">
                      <p className="text-xs text-navy-500 text-center">
                        <Link href="/signup" className="text-gold-500 hover:text-gold-400 font-medium">
                          Create a free account
                        </Link>
                        {' '}to save this guidance, track your claim status, and get automated reminders
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
