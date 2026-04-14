import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { CheckCircle2, Users, BookOpen, ShieldCheck, Building2, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Organizations — VSOs, Legal, TAP & Employers',
  description:
    'White-label Patriot Ops Center for VSOs, law firms, TAP programs, and veteran-hiring employers. Branded portal, member management, and outcome reporting.',
}

const ORG_TYPES = [
  {
    id:      'vso',
    icon:    Users,
    type:    'VSOs & Nonprofits',
    title:   'VFW, American Legion, Wounded Warrior & more',
    desc:    'Give your members access to AI-powered benefits navigation under your brand. Revenue share model available for large VSOs.',
    bullets: [
      'Co-branded member portal on your subdomain',
      'Bulk seat licensing with volume discounts',
      'Member progress tracking & reporting',
      'Revenue share for referred subscriptions',
      'Dedicated account manager',
    ],
  },
  {
    id:      'legal',
    icon:    BookOpen,
    type:    'Legal & Claims Agents',
    title:   'VA-accredited attorneys and claims agents',
    desc:    'Case management dashboard with client document sharing, progress tracking, and secure AI-assisted case preparation.',
    bullets: [
      'Client case dashboard & timeline view',
      'Secure document sharing & DD-214 parsing',
      'AI-assisted claims strategy tools',
      'C&P exam preparation resources',
      'HIPAA-aligned data handling',
    ],
  },
  {
    id:      'tap',
    icon:    ShieldCheck,
    type:    'TAP & Government',
    title:   'Transition Assistance Programs on military installations',
    desc:    'White-label deployment with DoD integration path. Cohort tracking and outcome reporting for base commanders.',
    bullets: [
      'White-label branded experience',
      'Cohort creation and tracking',
      'Outcome reporting & analytics',
      'DoD integration path (CAC-compatible)',
      'TAP curriculum alignment',
    ],
  },
  {
    id:      'employers',
    icon:    Building2,
    type:    'Veteran-Hiring Employers',
    title:   'Fortune 500 and mid-market veteran hiring programs',
    desc:    'Access an anonymized candidate pool with MOS-to-role match scoring, featured job listings, and retention analytics.',
    bullets: [
      'Anonymized veteran candidate pool',
      'MOS-to-role compatibility scoring',
      'Featured job listings (unlimited)',
      '90-day retention analytics',
      'Veteran ERG support resources',
    ],
  },
]

const PRICING_TIERS = [
  {
    name:  'VSO',
    price: 'Contact us',
    desc:  'Up to 500 members. Co-branded portal.',
    cta:   'Request demo',
  },
  {
    name:  'Legal',
    price: '$199/mo',
    desc:  'Up to 10 staff. Case management.',
    cta:   'Start trial',
    badge: 'Most Popular',
  },
  {
    name:  'Enterprise',
    price: 'Custom',
    desc:  'Unlimited seats. SLA + dedicated support.',
    cta:   'Talk to sales',
  },
]

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 grid-pattern" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04)_0%,transparent_60%)]" />
          <div className="container-wide relative z-10 text-center">
            <Badge variant="navy" className="mb-5">For Organizations</Badge>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-5">
              Bring the mission<br />to your members
            </h1>
            <p className="text-lg text-navy-300 max-w-xl mx-auto leading-relaxed mb-8">
              VSOs, law firms, TAP programs, and employers get their own fully white-labeled tenant —
              with admin dashboard, member management, and reporting tools.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link href="/organizations/demo">Request a Demo</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key benefits */}
        <div className="bg-navy-900 border-y border-navy-700 py-4">
          <div className="container-wide flex flex-wrap items-center justify-center gap-8">
            {[
              'Isolated tenant data with Supabase RLS',
              'Custom subdomain & branding',
              'Members keep their accounts if they leave',
              'TAP-ready DoD integration path',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-navy-300">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Org type cards */}
        <section className="section-muted" id="solutions">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-navy-50 mb-3">Solutions by Organization Type</h2>
              <p className="text-navy-400">Tailored for the unique workflows of each veteran-serving organization.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {ORG_TYPES.map((org) => (
                <div key={org.id} id={org.id} className="bg-navy-900 rounded-2xl border border-navy-700 p-7">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 flex items-center justify-center shrink-0">
                      <org.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-gold-600">
                      {org.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-50 mb-2 mt-3">{org.title}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed mb-5">{org.desc}</p>
                  <ul className="space-y-2">
                    {org.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2.5 text-sm text-navy-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="section bg-navy-950" id="pricing">
          <div className="container-wide">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-navy-50 mb-3">Organization Pricing</h2>
              <p className="text-navy-400">Transparent pricing with no per-member fees on higher tiers.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {PRICING_TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-7 text-center ${
                    tier.badge
                      ? 'border-gold-600/50 bg-navy-800'
                      : 'border-navy-700 bg-navy-900'
                  }`}
                >
                  {tier.badge && (
                    <span className="text-[10px] font-bold text-navy-950 bg-gold-500 px-2.5 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  )}
                  <h3 className="text-lg font-black text-navy-50 mt-3 mb-1">{tier.name}</h3>
                  <div className="text-2xl font-black text-gold-400 mb-1">{tier.price}</div>
                  <p className="text-xs text-navy-500 mb-5">{tier.desc}</p>
                  <Button variant={tier.badge ? 'gold' : 'outline'} size="sm" className="w-full" asChild>
                    <Link href="/organizations/demo">
                      {tier.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
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
