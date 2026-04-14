import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { CheckCircle2, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Patriot Ops Center',
  description:
    'Benefits Navigator is permanently free. Career tools start free and grow with your ambitions.',
}

const PLANS = [
  {
    name:     'Patriot',
    badge:    'free' as const,
    price:    '$0',
    sub:      '',
    annual:   null,
    cta:      'Get started free',
    href:     '/signup',
    variant:  'outline' as const,
    features: [
      { text: 'Full Benefits Navigator', included: true },
      { text: 'VA Eligibility Checker (5/mo)', included: true },
      { text: 'Claims Copilot (3/mo)', included: true },
      { text: '1-Year Transition Timeline', included: true },
      { text: 'DD-214 Upload & Parse (1)', included: true },
      { text: '1 AI Resume Generation', included: true },
      { text: '20 Job Listings', included: true },
      { text: '3 Interview Prep Sessions', included: true },
      { text: 'Salary Negotiation Scripts', included: false },
      { text: 'Clearance Marketplace', included: false },
      { text: 'Coaching Sessions', included: false },
    ],
  },
  {
    name:     'Ranger',
    badge:    'pro' as const,
    price:    '$34',
    sub:      '/month',
    annual:   'or $299/year — save 2 months',
    cta:      'Start Ranger — 7 days free',
    href:     '/signup?plan=pro',
    variant:  'gold' as const,
    featured: true,
    features: [
      { text: 'Everything in Patriot', included: true },
      { text: 'Unlimited VA Eligibility checks', included: true },
      { text: 'Unlimited Claims Copilot', included: true },
      { text: 'Unlimited AI Resume Versions', included: true },
      { text: 'Unlimited Interview Prep', included: true },
      { text: 'Salary Insights + Scripts', included: true },
      { text: 'Unlimited Job Listings', included: true },
      { text: 'Cover Letter Generator', included: true },
      { text: 'LinkedIn Auto-Optimizer', included: true },
      { text: 'Veteran Mentor Network', included: true },
      { text: '1-on-1 Coaching Sessions', included: false },
    ],
  },
  {
    name:     'Special Ops',
    badge:    'elite' as const,
    price:    '$124',
    sub:      '/month',
    annual:   'or $999/year — best value',
    cta:      'Go Special Ops',
    href:     '/signup?plan=elite',
    variant:  'outline' as const,
    features: [
      { text: 'Everything in Ranger', included: true },
      { text: 'Monthly 1-on-1 Coaching', included: true },
      { text: 'Resume + LinkedIn Pro Review', included: true },
      { text: 'Mock Interview Sessions', included: true },
      { text: 'Direct Employer Introductions', included: true },
      { text: 'Clearance Marketplace Access', included: true },
      { text: 'Exclusive Unlisted Positions', included: true },
      { text: 'AI Career Coach (Persistent)', included: true },
      { text: 'Legal Benefits Review', included: true },
      { text: 'Priority 48hr Support', included: true },
      { text: 'Family Benefits Coverage', included: true },
    ],
  },
]

const FAQS = [
  {
    q: 'Is the Benefits Navigator really free forever?',
    a: 'Yes. VA Eligibility Checker, Claims Copilot, and the 1-Year Transition Timeline will always be free with no credit card required. We believe every veteran deserves access to these tools.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Absolutely. Cancel anytime from your billing dashboard — no cancellation fees, no questions asked. Your free tier access is always restored.',
  },
  {
    q: "What is the '100 for 100' program?",
    a: '100 free Ranger (Pro) subscriptions are permanently reserved for veterans with a 100% VA disability rating. Verify your rating and we cover the rest — no application needed.',
  },
  {
    q: 'Do my benefits data and claims stay private?',
    a: 'Yes. Your data is encrypted, stored in isolated Supabase databases with row-level security, and never sold or shared. You own your data.',
  },
  {
    q: 'Can my organization get a group license?',
    a: 'Yes — VSOs, legal offices, TAP programs, and employers can license Patriot Ops Center for their members with custom branding. See our Organizations page.',
  },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="container-wide relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-px bg-gold-600" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold-500">Pricing</span>
              <div className="w-10 h-px bg-gold-600" />
            </div>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-5">
              Serve first. Scale when ready.
            </h1>
            <p className="text-lg text-navy-300 max-w-lg mx-auto">
              Benefits Navigator is permanently free. Career tools start free and grow with your ambitions.
            </p>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-24">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl border p-8 flex flex-col transition-all duration-200 ${
                    plan.featured
                      ? 'border-gold-600/50 bg-linear-to-b from-navy-800 to-navy-900 scale-[1.03] shadow-gold-md'
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
                      <li key={f.text} className="flex items-start gap-2 text-sm">
                        {f.included ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-3.5 h-3.5 shrink-0 mt-0.5 flex items-center justify-center text-navy-700 font-bold text-xs">✗</span>
                        )}
                        <span className={f.included ? 'text-navy-200' : 'text-navy-600'}>{f.text}</span>
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
                100 free Ranger subscriptions reserved for 100% disabled veterans.
                No application — verify your rating and we take care of the rest.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-muted" id="faq">
          <div className="container-wide max-w-3xl mx-auto">
            <h2 className="text-3xl font-black text-navy-50 text-center mb-10">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-navy-900 rounded-xl border border-navy-700 p-6">
                  <h3 className="font-bold text-navy-100 mb-2">{faq.q}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">{faq.a}</p>
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
