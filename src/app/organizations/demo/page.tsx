'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/primitives'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

const ORG_TYPES = [
  { value: '',           label: 'Select organization type...' },
  { value: 'vso',        label: 'Veterans Service Organization (VSO)' },
  { value: 'legal',      label: 'VA-accredited attorney / claims agent' },
  { value: 'tap',        label: 'TAP / Transition Assistance Program' },
  { value: 'employer',   label: 'Veteran-hiring employer' },
  { value: 'nonprofit',  label: 'Other nonprofit' },
  { value: 'government', label: 'Government agency' },
]

const SEAT_RANGES = [
  { value: '',        label: 'Expected number of members...' },
  { value: '1-50',    label: '1–50 members' },
  { value: '51-200',  label: '51–200 members' },
  { value: '201-500', label: '201–500 members' },
  { value: '500+',    label: '500+ members' },
]

interface FormData {
  orgName:   string
  orgType:   string
  seatRange: string
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  message:   string
}

const INITIAL: FormData = {
  orgName: '', orgType: '', seatRange: '',
  firstName: '', lastName: '', email: '', phone: '', message: '',
}

export default function DemoRequestPage() {
  const [form,    setForm]    = useState<FormData>(INITIAL)
  const [sent,    setSent]    = useState(false)
  const [isPending, start]    = useTransition()

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    start(async () => {
      // TODO: wire to a server action / API route that emails the sales team
      await new Promise((r) => setTimeout(r, 800)) // simulated network call
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-950">
        <Nav />
        <main className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Request received</h2>
            <p className="text-slate-400 mb-6">
              Thank you, {form.firstName}. Our team will reach out within one business day to schedule
              your demo at a time that works for you.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="gold" size="md" asChild>
                <Link href="/organizations">Back to Organizations</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <div className="relative py-14 border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="container-wide relative z-10">
            <div className="flex items-center gap-2 text-sm text-navy-500 mb-4">
              <Link href="/organizations" className="hover:text-navy-300 transition-colors">Organizations</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-navy-300">Request a Demo</span>
            </div>
            <h1 className="text-3xl font-black text-navy-50 mb-2">Request a Demo</h1>
            <p className="text-navy-400">
              See how Patriot Ops Center can serve your members. We&apos;ll tailor the demo to your organization type.
            </p>
          </div>
        </div>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="bg-navy-900 rounded-xl border border-navy-700 p-6 space-y-4">
                  <h2 className="font-bold text-navy-100 text-sm uppercase tracking-wide">
                    Organization
                  </h2>
                  <Input
                    label="Organization name"
                    placeholder="e.g. VFW Post 1234"
                    required
                    value={form.orgName}
                    onChange={(e) => update('orgName', e.target.value)}
                  />
                  <Select
                    label="Organization type"
                    options={ORG_TYPES}
                    value={form.orgType}
                    onChange={(e) => update('orgType', e.target.value)}
                    required
                  />
                  <Select
                    label="Expected number of members"
                    options={SEAT_RANGES}
                    value={form.seatRange}
                    onChange={(e) => update('seatRange', e.target.value)}
                  />
                </div>

                <div className="bg-navy-900 rounded-xl border border-navy-700 p-6 space-y-4">
                  <h2 className="font-bold text-navy-100 text-sm uppercase tracking-wide">
                    Your Contact Info
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First name"
                      required
                      value={form.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                    />
                    <Input
                      label="Last name"
                      required
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                    />
                  </div>
                  <Input
                    label="Work email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                  <Textarea
                    label="Anything specific you'd like to cover?"
                    placeholder="e.g. Integration with our CRM, DoD CAC requirements, white-label branding..."
                    rows={3}
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </div>

                <Button type="submit" variant="gold" size="lg" loading={isPending} className="w-full">
                  Request Demo
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-navy-900 rounded-xl border border-navy-700 p-6">
                <h3 className="font-bold text-navy-100 mb-4">What to expect</h3>
                <ul className="space-y-3">
                  {[
                    'Response within 1 business day',
                    '30-minute live product walkthrough',
                    'Custom pricing for your org size',
                    'White-label branding preview',
                    'No obligation or credit card needed',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-navy-300">
                      <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gold-500/5 rounded-xl border border-gold-500/20 p-5">
                <p className="text-xs text-navy-400 leading-relaxed">
                  <span className="font-bold text-gold-400">Veterans retain their accounts.</span>{' '}
                  If a member leaves your organization, they keep their full profile, benefits data,
                  and transition progress — it&apos;s always theirs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
