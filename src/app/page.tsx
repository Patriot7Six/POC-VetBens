import Link from 'next/link'
import { ShieldCheck, ArrowRight, CheckCircle2, Target, BookOpen, Users, Building2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { Card }   from '@/components/ui/card'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patriot Ops Center — Your Mission Continues',
  description:
    'Free VA benefits navigator, claims copilot, and AI-powered career transition tools for veterans.',
}

// ── Static data ───────────────────────────────────────────────────────────────

const STATS = [
  { value: '22M+',  label: 'Veterans Served'       },
  { value: '200K',  label: 'Annual Transitions'     },
  { value: '$10K+', label: 'Avg. Salary Boost'      },
  { value: '72%',   label: 'Claims Success Rate'    },
]

const FREE_FEATURES = [
  'VA Eligibility Checker — every benefit you've earned',
  'Claims Copilot — AI-guided filing and tracking',
  '1-Year Transition Timeline — interactive checklist',
  'DD214 Upload & Parsing — instant record analysis',
  'Document Vault — secure storage for all VA docs',
  'VSO & Legal Referrals — vetted advocates near you',
]

const PRO_FEATURES = [
  'MOS Translator — military skills to civilian titles',
  'Unlimited AI Resume Versions (ATS-optimized)',
  'Interview Prep Coach — STAR method + AI feedback',
  'Salary Insights & Negotiation Scripts',
  'Unlimited Job Board Access',
  'Cover Letter Generator',
  'Veteran Mentor Network',
  'LinkedIn Profile Auto-Optimizer',
]

const STEPS = [
  {
    number: '01',
    icon:   BookOpen,
    title:  'Upload your record',
    body:   'Submit your DD214 or answer a few quick questions. Our AI parses your MOS, rank, deployments, and qualifications instantly.',
  },
  {
    number: '02',
    icon:   ShieldCheck,
    title:  'Navigate your benefits',
    body:   'Discover every VA benefit you've earned, get guided help filing claims, and follow your personalized 1-year transition checklist.',
  },
  {
    number: '03',
    icon:   Target,
    title:  'Launch your career',
    body:   'Generate AI-optimized resumes, practice interviews with our STAR coach, and land roles that match your clearance and ambitions.',
  },
]

const PRICING = [
  {
    name:     'Free',
    badge:    'free' as const,
    price:    '$0',
    sub:      'No credit card needed',
    annual:   null,
    cta:      'Get started free',
    href:     '/signup',
    variant:  'outline' as const,
    features: [
      'Full Benefits Navigator',
      'Claims Copilot',
      '1-Year Transition Timeline',
      'DD214 Upload & Parse',
      '1 AI Resume Generation',
      '20 Job Listings',
      '3 Interview Prep Sessions',
    ],
    locked: ['Salary Negotiation Scripts', 'Clearance Marketplace'],
  },
  {
    name:     'Pro',
    badge:    'pro' as const,
    price:    '$34',
    sub:      '/month',
    annual:   'or $299/year — save 2 months',
    cta:      'Start Pro — 7 days free',
    href:     '/signup?plan=pro',
    variant:  'gold' as const,
    featured: true,
    features: [
      'Everything in Free',
      'Unlimited AI Resume Versions',
      'Unlimited Interview Prep',
      'Salary Insights + Negotiation Scripts',
      'Unlimited Job Listings',
      'Cover Letter Generator',
      'Veteran Mentor Network',
      'LinkedIn Auto-Optimizer',
    ],
    locked: ['1-on-1 Coaching Sessions'],
  },
  {
    name:     'Elite',
    badge:    'navy' as const,
    price:    '$124',
    sub:      '/month',
    annual:   'or $999/year — best value',
    cta:      'Go Elite',
    href:     '/signup?plan=elite',
    variant:  'outline' as const,
    features: [
      'Everything in Pro',
      'Monthly 1-on-1 Coaching',
      'Resume + LinkedIn Pro Review',
      'Mock Interview Sessions',
      'Direct Employer Introductions',
      'Clearance Marketplace Access',
      'Exclusive Unlisted Positions',
      'AI Career Coach (Persistent)',
    ],
    locked: [],
  },
]

const ORGS = [
  {
    type: 'VSOs & Nonprofits',
    title: 'VFW, American Legion, Wounded Warrior & more',
    body: 'Member portal, benefits tracking, bulk licensing, and co-branded experience. Revenue share model available.',
    icon: Users,
  },
  {
    type: 'Legal & Claims',
    title: 'VA-accredited attorneys & claims agents',
    body: 'Case management dashboard, client progress tracking, document sharing, and secure communication.',
    icon: BookOpen,
  },
  {
    type: 'TAP & Government',
    title: 'Transition Assistance Programs on military bases',
    body: 'White-label deployment, DoD integration path, cohort tracking, and outcome reporting.',
    icon: ShieldCheck,
  },
  {
    type: 'Employers',
    title: 'Fortune 500 veteran hiring programs',
    body: 'Anonymized candidate pool, MOS-to-role match scoring, featured listings, and retention analytics.',
    icon: Building2,
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 grid-pattern" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a1929_80%)]" />
          {/* Gold glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
          </div>

          <div className="container-wide relative z-10 py-20 text-center mx-auto w-full">
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-7 animate-in">
              <div className="w-10 h-px bg-gold-600" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold-500">
                AI-Powered Veteran Platform
              </span>
              <div className="w-10 h-px bg-gold-600" />
            </div>

            {/* Headline */}
            <h1 className="text-[clamp(2.8rem,6vw,5rem)] font-black leading-[1.06] tracking-tight
                           text-navy-50 mb-6 animate-in" style={{ animationDelay: '0.1s' }}>
              Your Mission<br />
              <span className="text-gold-500 glow-gold">Continues</span>
            </h1>

            <p className="text-lg text-navy-300 leading-relaxed max-w-[600px] mx-auto mb-10
                          animate-in" style={{ animationDelay: '0.2s' }}>
              VA benefits guidance, claims support, and career transition tools — built for those who served.
              Navigate your next mission with AI-powered intelligence at your side.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-16
                            animate-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="gold" size="lg" asChild>
                <Link href="/benefits">
                  <ShieldCheck className="w-4 h-4" />
                  Access Benefits Navigator — Free
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/career">
                  Explore Career Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-stretch justify-center border-t border-navy-800 pt-10
                            animate-in" style={{ animationDelay: '0.4s' }}>
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-8 py-2 text-center ${i < STATS.length - 1 ? 'border-r border-navy-800' : ''}`}
                >
                  <div className="text-3xl font-black text-gold-400 leading-none mb-1">{stat.value}</div>
                  <div className="text-[11px] text-navy-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FREE TOOLS BANNER ────────────────────────────── */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900
                        border-y border-navy-700 py-3.5">
          <div className="container-wide flex flex-wrap items-center justify-center gap-3 text-sm">
            <Badge variant="free">Always Free</Badge>
            <span className="font-semibold text-gold-400">Benefits Navigator & Claims Copilot</span>
            <span className="text-navy-500">—</span>
            <span className="text-navy-300">No account required. No credit card. Built to serve those who served.</span>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/benefits">Explore the tools →</Link>
            </Button>
          </div>
        </div>

        {/* ── TWO WINGS ────────────────────────────────────── */}
        <section className="section-muted" id="platform">
          <div className="container-wide">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-7 h-px bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">The Platform</span>
                <div className="w-7 h-px bg-gold-500" />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-navy-50 mb-4">
                Two missions. One platform.
              </h2>
              <p className="text-navy-300 leading-relaxed">
                Veterans get free benefits support forever. Employment tools start free and grow with your ambitions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">

              {/* Benefits wing */}
              <div className="bg-navy-900 rounded-2xl border border-navy-700 overflow-hidden corner-brackets scanning-line">
                <div className="p-8 pb-6 border-b border-navy-800">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center text-2xl">
                      🛡️
                    </div>
                    <Badge variant="free">Always Free</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-navy-50 mb-2">Benefits Navigator</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">
                    AI-guided VA benefits, claims copilot, and a 1-year transition timeline — for every veteran, always free.
                  </p>
                </div>
                <div className="p-8">
                  <ul className="flex flex-col gap-3">
                    {FREE_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-navy-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Button variant="outline" size="md" className="w-full" asChild>
                      <Link href="/benefits">Access Benefits Navigator →</Link>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Employment wing */}
              <div className="bg-navy-900 rounded-2xl border border-navy-700 overflow-hidden">
                <div className="p-8 pb-6 border-b border-navy-800">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center text-2xl">
                      🎯
                    </div>
                    <Badge variant="gold">Freemium → Pro</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-navy-50 mb-2">Employment Tools</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">
                    Translate military experience into civilian success. AI resume builder, interview coach, salary insights, and more.
                  </p>
                </div>
                <div className="p-8">
                  <ul className="flex flex-col gap-3">
                    {PRO_FEATURES.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-navy-200">
                        <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Button variant="gold" size="md" className="w-full" asChild>
                      <Link href="/signup">Start for Free →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────── */}
        <section className="section bg-navy-950" id="how-it-works">
          <div className="container-wide">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-7 h-px bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">How It Works</span>
                <div className="w-7 h-px bg-gold-500" />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-navy-50">
                From service record<br className="hidden sm:block" /> to civilian success
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {STEPS.map((step, i) => (
                <div key={step.number} className="relative bg-navy-900 rounded-xl border border-navy-800 p-8">
                  <div className="text-[4.5rem] font-black text-gold-500/10 leading-none mb-4 select-none">
                    {step.number}
                  </div>
                  <step.icon className="w-6 h-6 text-gold-500 mb-4" />
                  <h3 className="font-bold text-navy-50 mb-3">{step.title}</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">{step.body}</p>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10
                                    text-navy-600 text-xl font-bold">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────── */}
        <section className="section section-dark" id="pricing">
          <div className="container-wide">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-2.5 mb-4">
                <div className="w-7 h-px bg-gold-500" />
                <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">Pricing</span>
                <div className="w-7 h-px bg-gold-500" />
              </div>
              <h2 className="text-4xl font-black tracking-tight text-navy-50 mb-3">
                Serve first. Scale when ready.
              </h2>
              <p className="text-navy-300 max-w-md mx-auto">
                Benefits Navigator is permanently free. Career tools start free and grow with your ambitions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {PRICING.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-8 flex flex-col transition-all duration-200 ${
                    plan.featured
                      ? 'border-gold-600/50 bg-gradient-to-b from-navy-800 to-navy-900 scale-[1.03] shadow-gold-md'
                      : 'border-navy-700 bg-navy-900 hover:border-navy-600'
                  }`}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={plan.badge}>{plan.name}</Badge>
                      {plan.featured && (
                        <span className="flex items-center gap-1 text-[10px] text-gold-400 font-bold">
                          <Star className="w-3 h-3" /> Most Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-4xl font-black text-navy-50">{plan.price}</span>
                      <span className="text-navy-400 text-sm">{plan.sub}</span>
                    </div>
                    {plan.annual && (
                      <p className="text-xs text-gold-600 mt-1">{plan.annual}</p>
                    )}
                  </div>

                  <ul className="flex flex-col gap-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-navy-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {plan.locked.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-navy-600">
                        <span className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center text-navy-700 font-bold text-xs">✗</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button variant={plan.variant} size="md" className="w-full" asChild>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* 100 for 100 */}
            <div className="max-w-2xl mx-auto mt-8 rounded-xl border border-gold-500/20
                            bg-gold-500/4 p-5 text-center">
              <p className="text-sm text-navy-200 leading-relaxed">
                <span className="font-bold text-gold-400">100 for 100 Program:</span>{' '}
                100 free Pro subscriptions reserved for 100% disabled veterans.
                No application — verify your rating and we take care of the rest.
              </p>
            </div>
          </div>
        </section>

        {/* ── FOR ORGANIZATIONS ────────────────────────────── */}
        <section className="section bg-navy-950" id="organizations">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-px bg-gold-500" />
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">
                    For Organizations
                  </span>
                </div>
                <h2 className="text-4xl font-black tracking-tight text-navy-50 mb-4">
                  Bring the mission<br />to your members
                </h2>
                <div className="w-10 h-0.5 bg-gradient-to-r from-gold-500 to-gold-700 mb-6" />
                <p className="text-navy-300 leading-relaxed mb-8">
                  VSOs, law firms, TAP programs, and employers get their own fully white-labeled
                  tenant — with a dedicated admin dashboard, member management, and reporting tools.
                  Your members retain full ownership of their accounts.
                </p>
                <ul className="flex flex-col gap-3 mb-8">
                  {[
                    'Isolated tenant data with Supabase RLS',
                    'Branded portal on your subdomain',
                    'Member invite, role assignment, progress tracking',
                    'Veterans retain their accounts if they leave your org',
                    'TAP-ready bulk licensing & DoD integration path',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-navy-200">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="gold" size="md" asChild>
                    <Link href="/organizations/demo">Request a Demo</Link>
                  </Button>
                  <Button variant="outline" size="md" asChild>
                    <Link href="/organizations">View Org Pricing</Link>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {ORGS.map((org) => (
                  <div
                    key={org.type}
                    className="bg-navy-800 rounded-xl border-l-[3px] border-l-gold-600
                               border border-navy-700 p-5 hover:border-l-gold-400 transition-colors"
                  >
                    <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-gold-600 mb-1.5">
                      {org.type}
                    </div>
                    <h4 className="font-bold text-navy-100 text-sm mb-1.5">{org.title}</h4>
                    <p className="text-xs text-navy-400 leading-relaxed">{org.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <section className="section bg-navy-900 border-t border-navy-800 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
          </div>
          <div className="container-wide text-center relative z-10">
            <div className="flex items-center justify-center gap-2.5 mb-5">
              <div className="w-7 h-px bg-gold-500" />
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-gold-500">Start Today</span>
              <div className="w-7 h-px bg-gold-500" />
            </div>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight text-navy-50 mb-4">
              You've earned these benefits.<br />
              <span className="text-gold-500">Let's make sure you get them.</span>
            </h2>
            <p className="text-navy-300 max-w-lg mx-auto mb-10 leading-relaxed">
              No account needed to start. Access the Benefits Navigator and Claims Copilot right now —
              completely free, forever.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="gold" size="xl" asChild>
                <Link href="/benefits">
                  <ShieldCheck className="w-5 h-5" />
                  Access Benefits Navigator — Free
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/signup">Create your free account</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
