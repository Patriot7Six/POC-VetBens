'use client'

import { useState, useTransition } from 'react'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/primitives'
import { CheckCircle2 } from 'lucide-react'
import type { Metadata } from 'next'

const TOPICS = [
  { value: '',             label: 'Select a topic...' },
  { value: 'general',      label: 'General inquiry' },
  { value: 'benefits',     label: 'Benefits Navigator question' },
  { value: 'billing',      label: 'Billing or subscription' },
  { value: 'bug',          label: 'Bug report' },
  { value: 'organization', label: 'Organization / enterprise' },
  { value: 'press',        label: 'Press or media' },
  { value: 'other',        label: 'Other' },
]

export default function ContactPage() {
  const [sent, setSent]         = useState(false)
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [topic, setTopic]       = useState('')
  const [message, setMessage]   = useState('')
  const [isPending, start]      = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    start(async () => {
      // TODO: wire to server action / Resend email
      await new Promise((r) => setTimeout(r, 800))
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
            <h2 className="text-2xl font-bold text-white mb-3">Message received</h2>
            <p className="text-slate-400 text-sm">
              Thanks, {name}. We typically respond within 1–2 business days.
            </p>
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
        <section className="relative py-16 border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="container-wide relative z-10">
            <h1 className="text-3xl font-black text-navy-50 mb-2">Contact Us</h1>
            <p className="text-navy-400">We typically respond within 1–2 business days.</p>
          </div>
        </section>

        <div className="container-wide py-12">
          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">

            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Select
                label="Topic"
                options={TOPICS}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
              <Textarea
                label="Message"
                required
                rows={5}
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" variant="gold" size="md" loading={isPending}>
                Send message
              </Button>
            </form>

            <div className="space-y-5">
              {[
                { label: 'Veterans & Benefits',  body: 'For claims, eligibility, and benefits questions, try the free Benefits Navigator first — it may answer faster.' },
                { label: 'Organizations',        body: 'VSOs, legal offices, and employers can request a dedicated demo at patriot-ops.com/organizations/demo.' },
                { label: 'Press & Media',        body: 'Media inquiries: press@patriot-ops.com' },
              ].map((item) => (
                <div key={item.label} className="bg-navy-900 rounded-xl border border-navy-700 p-5">
                  <h3 className="font-bold text-navy-100 text-sm mb-2">{item.label}</h3>
                  <p className="text-xs text-navy-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
