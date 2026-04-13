'use client'
// app/onboarding/page.tsx
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { MilitaryBranch } from '@/types/database'

// ── Step definitions ─────────────────────────────────────────────────────────
const BRANCHES: MilitaryBranch[] = [
  'Army', 'Navy', 'Air Force', 'Marine Corps',
  'Coast Guard', 'Space Force', 'National Guard', 'Reserves',
]

interface FormData {
  branch: MilitaryBranch | ''
  rank: string
  mos: string
  ets_date: string
}

const TOTAL_STEPS = 3

// ── Main component ───────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({ branch: '', rank: '', mos: '', ets_date: '' })
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const canProceed = () => {
    if (step === 1) return form.branch !== ''
    if (step === 2) return form.mos.trim() !== ''
    if (step === 3) return form.ets_date !== ''
    return true
  }

  const handleComplete = () => {
    startTransition(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('profiles')
        .update({
          branch: form.branch || null,
          rank: form.rank || null,
          mos: form.mos || null,
          ets_date: form.ets_date || null,
          onboarding_complete: true,
          onboarding_step: TOTAL_STEPS,
        })
        .eq('id', user.id)

      router.push('/dashboard')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.07) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-8 h-8 rounded bg-gold-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-navy-950">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.18L19 8v8l-7 3.88L5 16V8l7-3.82z"/>
            </svg>
          </div>
          <span className="text-white font-bold tracking-wide">
            Patriot <span className="text-gold-500">Ops</span>
          </span>
        </div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-slate-600">{Math.round((step / TOTAL_STEPS) * 100)}% complete</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8">
          {step === 1 && <StepBranch value={form.branch} onChange={v => update('branch', v)} />}
          {step === 2 && (
            <StepMOS
              branch={form.branch as MilitaryBranch}
              rank={form.rank}
              mos={form.mos}
              onRank={v => update('rank', v)}
              onMOS={v => update('mos', v)}
            />
          )}
          {step === 3 && <StepETS value={form.ets_date} onChange={v => update('ets_date', v)} />}
        </div>

        {/* Nav buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400
                         hover:border-white/20 hover:text-white transition-all text-sm font-medium"
            >
              ← Back
            </button>
          )}
          <button
            onClick={() => step < TOTAL_STEPS ? setStep(s => s + 1) : handleComplete()}
            disabled={!canProceed() || isPending}
            className="flex-1 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950
                       font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isPending
              ? 'Saving…'
              : step < TOTAL_STEPS
              ? 'Continue →'
              : 'Complete Setup →'}
          </button>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="w-full mt-4 text-center text-xs text-slate-600 hover:text-slate-500 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}

// ── Step sub-components ───────────────────────────────────────────────────────

function StepBranch({
  value,
  onChange,
}: {
  value: MilitaryBranch | ''
  onChange: (v: MilitaryBranch) => void
}) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1">What branch did you serve?</h2>
      <p className="text-slate-500 text-sm mb-6">We'll tailor benefit recommendations to your service.</p>
      <div className="grid grid-cols-2 gap-2">
        {BRANCHES.map(b => (
          <button
            key={b}
            onClick={() => onChange(b)}
            className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
              value === b
                ? 'bg-gold-500/10 border-gold-500 text-gold-400'
                : 'bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.06]'
            }`}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  )
}

function StepMOS({
  branch, rank, mos, onRank, onMOS,
}: {
  branch: MilitaryBranch
  rank: string
  mos: string
  onRank: (v: string) => void
  onMOS: (v: string) => void
}) {
  const mosLabel = branch === 'Navy' || branch === 'Coast Guard' ? 'Rate'
    : branch === 'Air Force' || branch === 'Space Force' ? 'AFSC'
    : 'MOS'

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1">Your role</h2>
      <p className="text-slate-500 text-sm mb-6">
        Your {mosLabel} and rank help us find disability ratings and career equivalents.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Rank / Pay Grade
          </label>
          <input
            type="text"
            value={rank}
            onChange={e => onRank(e.target.value)}
            placeholder="e.g. E-5 / SSG"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                       placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                       focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            {mosLabel}
          </label>
          <input
            type="text"
            value={mos}
            onChange={e => onMOS(e.target.value)}
            placeholder={branch === 'Army' ? 'e.g. 11B — Infantry' : `Your ${mosLabel}`}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                       placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                       focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
          />
        </div>
      </div>
    </div>
  )
}

function StepETS({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white mb-1">When did you separate?</h2>
      <p className="text-slate-500 text-sm mb-6">
        Your ETS / separation date determines your filing deadlines and eligibility windows.
      </p>
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          ETS / Separation Date
        </label>
        <input
          type="date"
          value={value}
          max={today}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                     focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30
                     transition-all text-sm [color-scheme:dark]"
        />
      </div>
      {value && (
        <div className="mt-4 p-3 bg-gold-500/5 border border-gold-500/20 rounded-lg">
          <p className="text-xs text-gold-400/80">
            ⏱ {Math.round((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24 * 365.25) * 10) / 10} years since separation
          </p>
        </div>
      )}
    </div>
  )
}
