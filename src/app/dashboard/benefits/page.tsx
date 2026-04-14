import Link from 'next/link'
import { ShieldCheck, FileSearch, Clock, CheckCircle2, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/primitives'
import { Button } from '@/components/ui/button'

const TOOLS = [
  {
    icon:    ShieldCheck,
    title:   'VA Eligibility Checker',
    desc:    'Answer a few questions about your service and our AI maps every benefit you may be entitled to — disability, healthcare, education, home loan, and more.',
    href:    '/dashboard/eligibility',
    cta:     'Check eligibility',
    badge:   'Free — unlimited',
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
    desc:    'AI-guided step-by-step support for filing, tracking, or appealing a VA disability claim. Know exactly what evidence you need.',
    href:    '/dashboard/claims',
    cta:     'Start claims guidance',
    badge:   'Free — unlimited',
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
    desc:    'A month-by-month checklist from first conversation about separation to Day 1 of your civilian career. Never miss a deadline.',
    href:    '/benefits/timeline',
    cta:     'View timeline',
    badge:   'Free — progress saved',
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

export default function DashboardBenefitsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <header className="h-16 border-b border-white/6 px-8 flex items-center">
        <h1 className="text-white font-semibold">Benefits Navigator</h1>
      </header>

      <div className="p-8 max-w-5xl space-y-6">
        <div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every benefit you&apos;ve earned from your service — found, explained, and filed.
            All tools below are free, forever.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <div
              key={tool.title}
              className="bg-white/3 rounded-2xl border border-white/7 overflow-hidden
                         hover:border-white/12 transition-all duration-200 group flex flex-col"
            >
              <div className="p-6 border-b border-white/6 flex-1">
                <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${
                  tool.accent === 'emerald' ? 'bg-emerald-500/15' :
                  tool.accent === 'gold'    ? 'bg-gold-500/15'    : 'bg-white/5'
                }`}>
                  <tool.icon className={`w-5 h-5 ${
                    tool.accent === 'emerald' ? 'text-emerald-400' :
                    tool.accent === 'gold'    ? 'text-gold-400'    : 'text-slate-400'
                  }`} />
                </div>

                <h2 className="text-base font-bold text-white mb-2">{tool.title}</h2>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{tool.desc}</p>

                <ul className="flex flex-col gap-2">
                  {tool.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                        tool.accent === 'emerald' ? 'text-emerald-400' :
                        tool.accent === 'gold'    ? 'text-gold-400'    : 'text-slate-500'
                      }`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5">
                <p className="text-[11px] text-slate-600 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  {tool.badge}
                </p>
                <Button
                  variant={tool.accent === 'gold' ? 'gold' : 'outline'}
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href={tool.href}>
                    {tool.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* External resources */}
        <div className="pt-4 border-t border-white/6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            External Resources
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'VA.gov — File a Claim',   href: 'https://www.va.gov/disability/file-disability-claim-form-21-526ez/' },
              { label: 'eBenefits Portal',         href: 'https://www.ebenefits.va.gov/' },
              { label: 'Find a VSO',               href: 'https://www.va.gov/vso/' },
              { label: 'TAP Program',              href: 'https://www.tapevents.mil/' },
              { label: 'VA GI Bill Comparison',   href: 'https://www.va.gov/education/gi-bill-comparison-tool/' },
              { label: 'My HealtheVet',            href: 'https://www.myhealth.va.gov/' },
            ].map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 bg-white/2 hover:bg-white/5
                           border border-white/6 hover:border-white/12 rounded-xl transition-all group"
              >
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {r.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-gold-400 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
