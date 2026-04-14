'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Badge }  from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'
import { Clock, ChevronRight, CheckCircle2, Circle, Lock } from 'lucide-react'
import type { Metadata } from 'next'

// ── Static milestone data ─────────────────────────────────────────────────────
const MILESTONES: {
  month: string
  category: string
  title: string
  description: string
  requiresAccount?: boolean
}[] = [
  { month: 'M-12', category: 'TAP',      title: 'Attend TAP workshop',           description: 'Register for and complete the mandatory Transition Assistance Program on your installation.' },
  { month: 'M-12', category: 'Benefits', title: 'Request VA pre-discharge exam',  description: 'Apply for disability benefits 180 days before separation through the Benefits Delivery at Discharge (BDD) program.' },
  { month: 'M-12', category: 'Finance',  title: 'Review retirement pay options',  description: 'If eligible, consult a financial advisor about retirement pay elections (BRS, High-3, CSB).' },
  { month: 'M-9',  category: 'Career',   title: 'Translate your MOS',            description: 'Map your military specialty, skills, and leadership to civilian job titles and industries.' },
  { month: 'M-9',  category: 'Career',   title: 'Build your civilian resume',     description: 'Create an ATS-optimized resume that translates military accomplishments into civilian impact statements.' },
  { month: 'M-9',  category: 'Benefits', title: 'File VA disability claim',       description: 'If not using BDD, file your VA claim through VA.gov or a VSO as early as possible.' },
  { month: 'M-6',  category: 'Housing',  title: 'Research VA home loan',          description: 'Get your VA Certificate of Eligibility and compare VA loan vs conventional mortgage options.' },
  { month: 'M-6',  category: 'Health',   title: 'Transfer medical records',       description: 'Request complete separation physical and obtain copies of all service treatment records (STRs).' },
  { month: 'M-6',  category: 'Career',   title: 'Start networking',              description: 'Connect with veteran networks, LinkedIn alumni, and industry contacts in your target field.', requiresAccount: true },
  { month: 'M-3',  category: 'Benefits', title: 'Schedule C&P exam prep',        description: 'If your C&P exam is scheduled, review how to present your conditions accurately and thoroughly.' },
  { month: 'M-3',  category: 'Finance',  title: 'Set up civilian banking',        description: 'Open a civilian checking account and update your direct deposit away from DFAS.' },
  { month: 'M-3',  category: 'Career',   title: 'Apply to target companies',      description: 'Submit applications, leverage your network, and prepare for veteran hiring events.', requiresAccount: true },
  { month: 'M-1',  category: 'Admin',    title: 'Obtain DD-214',                 description: 'Confirm your separation date and ensure your DD-214 accurately reflects all service, awards, and characterization.' },
  { month: 'M-1',  category: 'Health',   title: 'Enroll in VA healthcare',        description: 'Apply for VA healthcare at VA.gov or your local VAMC — priority enrollment for combat veterans.' },
  { month: 'M-1',  category: 'Benefits', title: 'Register for eBenefits',         description: 'Create accounts on VA.gov, eBenefits, and MilConnect to track all claims and benefits.' },
  { month: 'D+0',  category: 'Admin',    title: 'Separation Day',                description: 'Sign all separation documents. Keep physical copies of ALL paperwork — DD-214 is your most important document.' },
  { month: 'D+30', category: 'Career',   title: 'Begin job search full-time',     description: 'Treat the job search like a mission — daily applications, networking, and interview prep.', requiresAccount: true },
  { month: 'D+60', category: 'Benefits', title: 'Follow up on VA claim',          description: 'Check claim status on VA.gov. If more than 60 days, contact your VSO or call 1-800-827-1000.' },
  { month: 'D+90', category: 'Finance',  title: 'Review first civilian paycheck', description: 'Verify tax withholdings, benefits deductions, and ensure your emergency fund covers 3–6 months of expenses.' },
  { month: 'D+180',category: 'Career',   title: 'Performance review check-in',   description: 'Schedule a 90-day review conversation with your manager to align expectations and chart your growth path.', requiresAccount: true },
]

const CATEGORY_COLORS: Record<string, string> = {
  TAP:      'text-blue-400 bg-blue-500/15',
  Benefits: 'text-emerald-400 bg-emerald-500/15',
  Finance:  'text-gold-400 bg-gold-500/15',
  Career:   'text-purple-400 bg-purple-500/15',
  Housing:  'text-cyan-400 bg-cyan-500/15',
  Health:   'text-pink-400 bg-pink-500/15',
  Admin:    'text-slate-400 bg-slate-500/15',
}

export default function TimelinePage() {
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const pct = Math.round((completed.size / MILESTONES.length) * 100)

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
              <span className="text-navy-300">1-Year Transition Timeline</span>
            </div>
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-700 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-navy-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-navy-50">1-Year Transition Timeline</h1>
                    <Badge variant="free">Free</Badge>
                  </div>
                  <p className="text-navy-400 text-sm">
                    {MILESTONES.length} milestones from separation to civilian success.
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-black text-gold-400">{pct}%</div>
                  <div className="text-xs text-navy-500">{completed.size}/{MILESTONES.length} complete</div>
                </div>
                <div className="w-32 h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save progress prompt */}
        <div className="bg-navy-900 border-b border-navy-800 py-3">
          <div className="container-wide flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-navy-400">
              <span className="text-gold-400 font-medium">Progress is saved in this browser session.</span>
              {' '}Create a free account to save permanently and get deadline reminders.
            </p>
            <Button variant="gold" size="sm" asChild>
              <Link href="/signup">Save my progress →</Link>
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="container-wide py-12">
          <div className="max-w-3xl mx-auto space-y-3">
            {MILESTONES.map((m, i) => {
              const isDone = completed.has(i)
              const colorClass = CATEGORY_COLORS[m.category] ?? 'text-slate-400 bg-slate-500/15'

              return (
                <div
                  key={i}
                  className={`relative rounded-xl border p-5 transition-all duration-200 ${
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-500/5 opacity-60'
                      : m.requiresAccount
                      ? 'border-navy-800 bg-navy-900/50'
                      : 'border-navy-700 bg-navy-900 hover:border-navy-600'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => !m.requiresAccount && toggle(i)}
                      disabled={m.requiresAccount}
                      className="mt-0.5 shrink-0 transition-colors"
                      aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : m.requiresAccount ? (
                        <Lock className="w-5 h-5 text-navy-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-navy-600 hover:text-navy-400" />
                      )}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold text-navy-600 font-mono">{m.month}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorClass}`}>
                          {m.category}
                        </span>
                        {m.requiresAccount && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-500 border border-gold-500/20">
                            Account required
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${isDone ? 'line-through text-navy-500' : 'text-navy-100'}`}>
                        {m.title}
                      </h3>
                      <p className="text-xs text-navy-400 leading-relaxed">{m.description}</p>
                    </div>
                  </div>

                  {m.requiresAccount && (
                    <div className="mt-3 ml-9">
                      <Link
                        href="/signup"
                        className="text-xs text-gold-500 hover:text-gold-400 font-medium"
                      >
                        Create free account to track this milestone →
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="max-w-3xl mx-auto mt-10 text-center">
            <div className="bg-navy-900 rounded-2xl border border-gold-500/20 p-8">
              <h2 className="text-xl font-black text-navy-50 mb-2">Save your progress permanently</h2>
              <p className="text-navy-400 text-sm mb-6 max-w-sm mx-auto">
                Create a free account to save this timeline, get automated deadline reminders,
                and access the full Claims Copilot.
              </p>
              <Button variant="gold" size="md" asChild>
                <Link href="/signup">Create free account →</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
