import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { CheckCircle2, ArrowRight, FileText, Mic, DollarSign, Briefcase, Globe, Lock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Career Tools — Veteran Employment Platform',
  description:
    'AI-powered resume builder, interview coach, salary insights, and job board for transitioning veterans.',
}

const TOOLS = [
  {
    icon:       FileText,
    title:      'MOS Translator',
    desc:       'Convert your military occupational specialty into civilian job titles, skills, and industries that employers understand.',
    href:       '/signup',
    cta:        'Translate my MOS',
    tier:       'pro',
    available:  true,
  },
  {
    icon:       FileText,
    title:      'AI Resume Builder',
    desc:       'Generate ATS-optimized resumes from your military background. Unlimited versions targeting specific roles and companies.',
    href:       '/signup?plan=pro',
    cta:        'Build my resume',
    tier:       'pro',
    available:  true,
  },
  {
    icon:       Mic,
    title:      'Interview Prep Coach',
    desc:       'Practice with role-specific questions, receive real-time STAR method feedback, and build interview confidence.',
    href:       '/signup?plan=pro',
    cta:        'Start practicing',
    tier:       'pro',
    available:  true,
  },
  {
    icon:       DollarSign,
    title:      'Salary Insights',
    desc:       'Market-based compensation data and negotiation scripts tailored to your MOS, clearance level, and target industry.',
    href:       '/signup?plan=pro',
    cta:        'View salary data',
    tier:       'pro',
    available:  true,
  },
  {
    icon:       Briefcase,
    title:      'Job Board',
    desc:       'Curated veteran-friendly job listings from companies with active hiring programs and veteran affinity groups.',
    href:       '/career/jobs',
    cta:        'Browse jobs',
    tier:       'free',
    available:  true,
  },
  {
    icon:       Lock,
    title:      'Clearance Marketplace',
    desc:       'Exclusive roles requiring active security clearances — TS/SCI, Secret, and above — matched to your background.',
    href:       '/career/clearance',
    cta:        'View clearance roles',
    tier:       'elite',
    available:  true,
  },
  {
    icon:       Globe,
    title:      'LinkedIn Optimizer',
    desc:       'AI rewrites your LinkedIn profile with keyword-rich military-to-civilian language that recruiters search for.',
    href:       '/signup?plan=pro',
    cta:        'Optimize my profile',
    tier:       'pro',
    available:  true,
  },
  {
    icon:       FileText,
    title:      'Cover Letter Generator',
    desc:       'Craft tailored cover letters for any role in seconds, highlighting your mission-ready leadership and results.',
    href:       '/signup?plan=pro',
    cta:        'Generate cover letter',
    tier:       'pro',
    available:  true,
  },
]

const TIER_BADGE: Record<string, React.ReactNode> = {
  free:  <Badge variant="free">Free</Badge>,
  pro:   <Badge variant="pro">Ranger — $34/mo</Badge>,
  elite: <Badge variant="elite">Special Ops — $124/mo</Badge>,
}

export default function CareerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
          <div className="container-wide relative z-10 text-center">
            <Badge variant="gold" className="mb-5">Employment Tools</Badge>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-5">
              Career Transition Tools
            </h1>
            <p className="text-lg text-navy-300 max-w-xl mx-auto leading-relaxed mb-8">
              Translate military experience into civilian success. AI resume builder,
              interview coach, salary data, and a job board built for veterans.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link href="/signup">Start free — upgrade when ready</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">View plans</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Tools grid */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
              {TOOLS.map((tool) => (
                <div
                  key={tool.title}
                  className="bg-navy-900 rounded-2xl border border-navy-700 overflow-hidden
                             hover:border-navy-600 transition-all duration-200 flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center">
                        <tool.icon className="w-5 h-5 text-gold-400" />
                      </div>
                      {TIER_BADGE[tool.tier]}
                    </div>
                    <h2 className="text-base font-bold text-navy-50 mb-2">{tool.title}</h2>
                    <p className="text-sm text-navy-400 leading-relaxed">{tool.desc}</p>
                  </div>
                  <div className="p-5 pt-0">
                    <Button variant={tool.tier === 'free' ? 'outline' : 'gold'} size="sm" className="w-full" asChild>
                      <Link href={tool.href}>
                        {tool.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof / stats */}
        <section className="section-dark">
          <div className="container-wide text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {[
                { value: '$10K+',  label: 'Average salary increase' },
                { value: '94%',    label: 'Resume ATS pass rate' },
                { value: '3.2×',   label: 'Interview rate increase' },
                { value: '45 days',label: 'Average time to first offer' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black text-gold-400 mb-1">{s.value}</div>
                  <div className="text-xs text-navy-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
