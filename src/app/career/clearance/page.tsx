import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { Lock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clearance Marketplace — Elite Career Tools',
  description: 'Exclusive security-cleared job opportunities for veterans with TS/SCI, Secret, and above clearances.',
}

const CLEARANCE_LEVELS = [
  { level: 'Secret',  count: '2,400+', color: 'text-blue-400 bg-blue-500/15'  },
  { level: 'Top Secret', count: '800+', color: 'text-purple-400 bg-purple-500/15' },
  { level: 'TS/SCI',  count: '350+',  color: 'text-gold-400 bg-gold-500/15'   },
  { level: 'TS/SCI + Poly', count: '120+', color: 'text-red-400 bg-red-500/15' },
]

const BENEFITS = [
  'Roles matched to your clearance level and MOS',
  'Only verified defense contractors and agencies',
  'Salary benchmarks for cleared positions',
  'Clearance transfer and maintenance guidance',
  'Direct recruiter introductions (Elite plan)',
  'Access to unlisted / referral-only positions',
]

export default function ClearanceMarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.05)_0%,transparent_60%)]" />
          <div className="container-wide relative z-10 text-center">
            <Badge variant="elite" className="mb-5">Special Ops — Clearance Marketplace</Badge>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-5">
              Cleared Veteran Jobs
            </h1>
            <p className="text-lg text-navy-300 max-w-xl mx-auto leading-relaxed mb-8">
              Your clearance is a career asset. Access exclusive roles from defense contractors,
              federal agencies, and intelligence community employers — matched to your background.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link href="/signup?plan=elite">
                <Lock className="w-5 h-5" />
                Unlock Clearance Marketplace — Elite
              </Link>
            </Button>
          </div>
        </section>

        {/* Clearance level breakdown */}
        <section className="section-muted">
          <div className="container-wide">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-navy-50 mb-3">Current Openings by Clearance Level</h2>
              <p className="text-navy-400">Updated daily from verified defense and intelligence employers.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {CLEARANCE_LEVELS.map((c) => (
                <div key={c.level} className="bg-navy-900 rounded-2xl border border-navy-700 p-6 text-center">
                  <div className={`text-3xl font-black mb-1 ${c.color.split(' ')[0]}`}>{c.count}</div>
                  <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${c.color}`}>
                    {c.level}
                  </div>
                  <p className="text-xs text-navy-500">open positions</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="section bg-navy-950">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <h2 className="text-3xl font-black text-navy-50 mb-5">
                  Your clearance is worth more than you think
                </h2>
                <p className="text-navy-400 leading-relaxed mb-6">
                  Cleared professionals earn 20–35% more than their non-cleared counterparts.
                  The Clearance Marketplace connects you directly with employers who value your
                  investment and your discretion.
                </p>
                <ul className="space-y-3 mb-8">
                  {BENEFITS.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm text-navy-200">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="gold" size="md" asChild>
                    <Link href="/signup?plan=elite">
                      Get Elite Access <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="md" asChild>
                    <Link href="/pricing">Compare plans</Link>
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Teaser locked cards */}
                {[
                  { title: 'Senior Intelligence Analyst', company: 'DIA', salary: '$95K–$140K', clearance: 'TS/SCI' },
                  { title: 'Cybersecurity Engineer',       company: 'NSA Contractor', salary: '$120K–$165K', clearance: 'TS/SCI + Poly' },
                  { title: 'Special Operations Advisor',   company: 'DoD Contractor', salary: '$110K–$145K', clearance: 'TS/SCI' },
                ].map((job) => (
                  <div key={job.title} className="relative bg-navy-900 rounded-xl border border-navy-700 p-5 overflow-hidden">
                    {/* Blur overlay */}
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-navy-950/60 flex items-center justify-center z-10 rounded-xl">
                      <div className="flex items-center gap-2 text-sm text-navy-400">
                        <Lock className="w-4 h-4 text-gold-500" />
                        <span>Unlock with <span className="text-gold-400 font-medium">Elite</span></span>
                      </div>
                    </div>
                    <div className="opacity-30">
                      <div className="font-bold text-navy-50">{job.title}</div>
                      <div className="text-sm text-navy-400 mt-1">{job.company}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gold-400">{job.salary}</span>
                        <Badge variant="elite">{job.clearance}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
