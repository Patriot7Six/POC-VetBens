import Link from 'next/link'
import { ShieldCheck, FileSearch, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Benefits Navigator — Free VA Benefits & Claims Support',
  description:
    'Free AI-powered VA benefits eligibility checker, claims copilot, and 1-year military transition timeline. No account required.',
}

const TOOLS = [
  {
    icon:    ShieldCheck,
    title:   'VA Eligibility Checker',
    desc:    'Answer a few questions about your service and our AI maps every benefit you may be entitled to — disability, healthcare, education, home loan, and more.',
    href:    '/benefits/eligibility',
    cta:     'Check my eligibility',
    badge:   'Free — no account needed',
    accent:  'emerald',
    bullets: [
      'Full disability compensation analysis',
      'Healthcare enrollment priority group',
      'GI Bill & education benefits',
      'VA home loan entitlement',
      'State-specific benefits',
    ],
  },
  {
    icon:    FileSearch,
    title:   'Claims Copilot',
    desc:    'Get AI-guided step-by-step support for filing, tracking, or appealing a VA disability claim. Know exactly what evidence you need and common pitfalls to avoid.',
    href:    '/benefits/claims',
    cta:     'Start claims guidance',
    badge:   'Free — no account needed',
    accent:  'gold',
    bullets: [
      'Condition-specific filing strategy',
      'Evidence checklist & nexus letters',
      'C&P exam preparation guide',
      'Appeals pathway analysis',
      'VSO referral if needed',
    ],
  },
  {
    icon:    Clock,
    title:   '1-Year Transition Timeline',
    desc:    'An interactive month-by-month checklist from your first conversation about separation to Day 1 of your civilian career. Never miss a deadline.',
    href:    '/benefits/timeline',
    cta:     'View my timeline',
    badge:   'Free — save progress with account',
    accent:  'navy',
    bullets: [
      '25+ milestone checklist',
      'TAP, VA, housing & career tasks',
      'Automated deadline reminders',
      'Progress tracking & notes',
      'Exportable PDF plan',
    ],
  },
]

export default function BenefitsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
          <div className="container-wide relative z-10 text-center">
            <Badge variant="free" className="mb-5">Always Free — No Account Required</Badge>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-5">
              Benefits Navigator
            </h1>
            <p className="text-lg text-navy-300 max-w-xl mx-auto leading-relaxed">
              Every benefit you've earned from your service — found, explained, and filed.
              Powered by AI. Free forever.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TOOLS.map((tool) => (
                <div
                  key={tool.title}
                  className="bg-navy-900 rounded-2xl border border-navy-700 overflow-hidden
                             hover:border-navy-600 transition-all duration-200 group flex flex-col"
                >
                  <div className="p-7 border-b border-navy-800 flex-1">
                    <div className={`w-11 h-11 rounded-xl mb-5 flex items-center justify-center
                      ${tool.accent === 'emerald' ? 'bg-emerald-500/15' :
                        tool.accent === 'gold'    ? 'bg-gold-500/15'    : 'bg-navy-700'}`}>
                      <tool.icon className={`w-5 h-5
                        ${tool.accent === 'emerald' ? 'text-emerald-400' :
                          tool.accent === 'gold'    ? 'text-gold-400'    : 'text-navy-400'}`} />
                    </div>

                    <h2 className="text-lg font-bold text-navy-50 mb-2">{tool.title}</h2>
                    <p className="text-sm text-navy-400 leading-relaxed mb-5">{tool.desc}</p>

                    <ul className="flex flex-col gap-2">
                      {tool.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-navy-200">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0
                            ${tool.accent === 'emerald' ? 'text-emerald-400' :
                              tool.accent === 'gold'    ? 'text-gold-400'    : 'text-navy-500'}`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6">
                    <p className="text-[11px] text-navy-500 mb-3 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {tool.badge}
                    </p>
                    <Button
                      variant={tool.accent === 'gold' ? 'gold' : 'outline'}
                      size="md"
                      className="w-full group-hover:border-gold-500/60 transition-colors"
                      asChild
                    >
                      <Link href={tool.href}>
                        {tool.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save progress prompt */}
            <div className="mt-10 max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 text-sm text-navy-400 bg-navy-900
                              border border-navy-800 rounded-full px-5 py-2.5">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                <span>
                  <Link href="/signup" className="text-gold-400 hover:text-gold-300 font-medium">
                    Create a free account
                  </Link>
                  {' '}to save your results, track claims, and access your transition timeline
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
