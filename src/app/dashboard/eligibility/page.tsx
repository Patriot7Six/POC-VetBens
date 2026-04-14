'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea, Spinner } from '@/components/ui/primitives'
import { Badge } from '@/components/ui/primitives'
import { ShieldCheck, RotateCcw, AlertCircle } from 'lucide-react'
import type { Metadata } from 'next'

const BRANCHES = [
  { value: '',               label: 'Select branch...' },
  { value: 'army',           label: 'U.S. Army' },
  { value: 'navy',           label: 'U.S. Navy' },
  { value: 'marine_corps',   label: 'U.S. Marine Corps' },
  { value: 'air_force',      label: 'U.S. Air Force' },
  { value: 'space_force',    label: 'U.S. Space Force' },
  { value: 'coast_guard',    label: 'U.S. Coast Guard' },
  { value: 'national_guard', label: 'National Guard' },
  { value: 'reserves',       label: 'Reserves' },
]

const STATES = [
  { value: '', label: 'Select state (optional)...' },
  ...['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
      'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
      'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
      'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
      'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
      'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
      'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
      'Wisconsin','Wyoming'].map((s) => ({ value: s, label: s })),
]

const YEARS = Array.from({ length: 41 }, (_, i) => ({
  value: String(i),
  label: i === 0 ? 'Less than 1 year' : `${i} year${i !== 1 ? 's' : ''}`,
}))

interface FormData {
  branch:            string
  mosCode:           string
  yearsOfService:    string
  combatVet:         boolean
  deploymentCount:   string
  disabilities:      string
  locationState:     string
  additionalContext: string
}

const INITIAL: FormData = {
  branch:            '',
  mosCode:           '',
  yearsOfService:    '4',
  combatVet:         false,
  deploymentCount:   '0',
  disabilities:      '',
  locationState:     '',
  additionalContext: '',
}

export default function DashboardEligibilityPage() {
  const [form,      setForm]      = useState<FormData>(INITIAL)
  const [result,    setResult]    = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [submitted, setSubmitted] = useState(false)

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.branch) { setError('Please select your branch of service.'); return }

    setLoading(true)
    setError('')
    setResult('')
    setSubmitted(true)

    try {
      const res = await fetch('/api/benefits/eligibility', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch:            form.branch,
          mosCode:           form.mosCode || undefined,
          yearsOfService:    parseInt(form.yearsOfService),
          combatVet:         form.combatVet,
          deploymentCount:   parseInt(form.deploymentCount),
          disabilities:      form.disabilities
            ? form.disabilities.split(',').map((s) => s.trim()).filter(Boolean)
            : [],
          locationState:     form.locationState || undefined,
          additionalContext: form.additionalContext || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Analysis failed')
      }

      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      let   text    = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        setResult(text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setForm(INITIAL)
    setResult('')
    setError('')
    setSubmitted(false)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 border-b border-white/6 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h1 className="text-white font-semibold">VA Eligibility Checker</h1>
          <Badge variant="free">Free</Badge>
        </div>
        {(submitted || result) && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </Button>
        )}
      </header>

      <div className="p-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* Form */}
          <div className={submitted && result ? 'hidden lg:block' : ''}>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Tell us about your service and our AI identifies every VA benefit you may be entitled to.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-white/3 rounded-xl border border-white/7 p-6 space-y-5">
                <h2 className="font-bold text-slate-300 text-xs uppercase tracking-widest">
                  Service Information
                </h2>

                <Select
                  label="Branch of Service"
                  options={BRANCHES}
                  value={form.branch}
                  onChange={(e) => update('branch', e.target.value)}
                  required
                />

                <Input
                  label="MOS / AFSC / Rating / NEC"
                  placeholder="e.g. 11B, 25U, 0311, IT"
                  value={form.mosCode}
                  onChange={(e) => update('mosCode', e.target.value)}
                  hint="Your military occupational specialty code"
                />

                <Select
                  label="Total Years of Service"
                  options={YEARS}
                  value={form.yearsOfService}
                  onChange={(e) => update('yearsOfService', e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-200 mb-1.5">
                      Combat Veteran?
                    </label>
                    <div className="flex gap-3">
                      {['Yes', 'No'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => update('combatVet', opt === 'Yes')}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                            form.combatVet === (opt === 'Yes')
                              ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                              : 'border-navy-700 text-navy-400 hover:border-navy-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="# Deployments"
                    type="number"
                    min={0}
                    max={20}
                    value={form.deploymentCount}
                    onChange={(e) => update('deploymentCount', e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-white/3 rounded-xl border border-white/7 p-6 space-y-5">
                <h2 className="font-bold text-slate-300 text-xs uppercase tracking-widest">
                  Health & Details
                </h2>

                <Textarea
                  label="Known Conditions or Disabilities"
                  placeholder="e.g. tinnitus, lower back pain, PTSD, knee injury..."
                  rows={3}
                  value={form.disabilities}
                  onChange={(e) => update('disabilities', e.target.value)}
                  hint="Separate multiple conditions with commas."
                />

                <Select
                  label="State of Residence"
                  options={STATES}
                  value={form.locationState}
                  onChange={(e) => update('locationState', e.target.value)}
                />

                <Textarea
                  label="Anything else we should know?"
                  placeholder="e.g. Camp Lejeune, Gulf War, Agent Orange exposure..."
                  rows={2}
                  value={form.additionalContext}
                  onChange={(e) => update('additionalContext', e.target.value)}
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
                <ShieldCheck className="w-5 h-5" />
                Analyze My Benefits
              </Button>
            </form>
          </div>

          {/* Results */}
          <div>
            {!submitted && !result && (
              <div className="bg-white/3 rounded-xl border border-white/7 p-10 text-center
                              flex flex-col items-center justify-center min-h-[400px]">
                <ShieldCheck className="w-12 h-12 text-white/10 mb-4" />
                <h3 className="font-bold text-slate-500 mb-2">Your analysis will appear here</h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Fill in your service details and click Analyze to receive a personalized benefits assessment.
                </p>
              </div>
            )}

            {(loading || result) && (
              <div className="bg-white/3 rounded-xl border border-white/7 overflow-hidden sticky top-4">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200 text-sm">Benefits Assessment</span>
                    {loading && <Spinner size="sm" />}
                  </div>
                  {result && !loading && (
                    <Button variant="ghost" size="icon" onClick={reset} title="Start over">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="p-6 max-h-[600px] overflow-y-auto scrollbar-thin">
                  {result ? (
                    <div className="prose prose-sm prose-invert max-w-none
                                    prose-headings:text-gold-400 prose-headings:font-bold
                                    prose-strong:text-slate-200 prose-p:text-slate-300
                                    prose-li:text-slate-300">
                      {result.split('\n').map((line, i) => {
                        if (line.startsWith('# '))   return <h1 key={i}>{line.slice(2)}</h1>
                        if (line.startsWith('## '))  return <h2 key={i}>{line.slice(3)}</h2>
                        if (line.startsWith('### ')) return <h3 key={i}>{line.slice(4)}</h3>
                        if (line.startsWith('- '))   return <li key={i} className="ml-4">{line.slice(2)}</li>
                        if (line.match(/^\*\*(.+)\*\*$/)) return <p key={i}><strong>{line.slice(2, -2)}</strong></p>
                        if (line.trim() === '')      return <br key={i} />
                        return <p key={i} className="text-slate-300 text-sm leading-relaxed">{line}</p>
                      })}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`h-3 bg-white/5 rounded animate-pulse
                                                  ${i % 3 === 0 ? 'w-3/4' : i % 2 === 0 ? 'w-full' : 'w-5/6'}`} />
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
