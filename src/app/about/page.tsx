import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — Patriot Ops Center',
  description: 'Our mission: ensure every veteran gets the benefits they earned and the career they deserve.',
}

const VALUES = [
  {
    title: 'Mission First',
    body:  'Benefits Navigator is free forever. Every veteran deserves access to AI-powered guidance for the benefits they earned through their service — no credit card, no catch.',
  },
  {
    title: 'Data You Own',
    body:  'Your service record, medical data, and claims information belong to you. We use encryption and row-level security. We never sell your data.',
  },
  {
    title: 'Built by Veterans',
    body:  'Our team includes veterans, military spouses, and VSO advocates who lived the transition experience. We build what we wished existed when we separated.',
  },
  {
    title: 'AI in Service',
    body:  "AI accelerates guidance but doesn't replace professional advice. We route you to VSOs, attorneys, and advisors when the situation calls for it.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Hero */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="container-wide relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-gold-600" />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold-500">Our Mission</span>
            </div>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black tracking-tight text-navy-50 mb-6 leading-[1.08]">
              Every veteran gets the benefits they earned — and the career they deserve.
            </h1>
            <p className="text-lg text-navy-300 leading-relaxed mb-8">
              Patriot Ops Center was built to close the gap between military service and civilian success.
              Too many veterans leave money on the table, file incorrect claims, or accept the first job offer
              when they could do so much better with the right guidance.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link href="/benefits">Access Benefits Navigator — Free</Link>
            </Button>
          </div>
        </section>

        {/* Values */}
        <section className="section-muted">
          <div className="container-wide">
            <h2 className="text-3xl font-black text-navy-50 mb-10">What we stand for</h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-navy-900 rounded-2xl border border-navy-700 p-7">
                  <div className="w-8 h-0.5 bg-gold-500 mb-4" />
                  <h3 className="font-black text-navy-50 text-lg mb-3">{v.title}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section bg-navy-950">
          <div className="container-wide text-center max-w-xl mx-auto">
            <ShieldCheck className="w-10 h-10 text-gold-500 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-navy-50 mb-4">
              The mission doesn&apos;t end at separation.
            </h2>
            <p className="text-navy-400 mb-8">
              Join thousands of veterans navigating their benefits and building civilian careers with Patriot Ops Center.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="gold" size="lg" asChild>
                <Link href="/signup">Create free account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
