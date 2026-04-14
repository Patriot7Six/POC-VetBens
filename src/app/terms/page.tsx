import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Patriot Ops Center',
  description: 'Terms of Service for Patriot Ops Center.',
}

const LAST_UPDATED = 'January 1, 2026'

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>
        <section className="relative py-14 border-b border-navy-800">
          <div className="container-wide">
            <h1 className="text-3xl font-black text-navy-50 mb-2">Terms of Service</h1>
            <p className="text-navy-500 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <div className="container-wide py-12">
          <article className="prose prose-invert prose-sm max-w-3xl
                              prose-headings:text-navy-100 prose-headings:font-bold
                              prose-p:text-navy-400 prose-p:leading-relaxed
                              prose-li:text-navy-400 prose-a:text-gold-400">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Patriot Ops Center (&ldquo;Service&rdquo;), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Patriot Ops Center provides AI-powered tools to help veterans navigate VA benefits, file
              disability claims, and pursue civilian career opportunities. The Service includes a free tier
              (Benefits Navigator) and paid subscription tiers (Ranger, Special Ops).
            </p>

            <h2>3. Not Legal or Medical Advice</h2>
            <p>
              The information and AI-generated content provided by Patriot Ops Center is for informational
              purposes only and does not constitute legal, medical, or financial advice. Always consult a
              qualified VA-accredited attorney, VSO representative, or medical professional for specific
              guidance about your situation.
            </p>

            <h2>4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for
              all activity that occurs under your account. You must provide accurate information when
              creating an account and keep it up to date.
            </p>

            <h2>5. Subscriptions and Billing</h2>
            <p>
              Paid subscriptions are billed monthly or annually through Stripe. You may cancel at any time
              through your billing dashboard. Cancellations take effect at the end of the current billing
              period. We do not offer prorated refunds for partial months.
            </p>

            <h2>6. Privacy and Data</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. We take the security of
              your military and medical information seriously. Please review our Privacy Policy for
              details on how we collect, use, and protect your data.
            </p>

            <h2>7. Prohibited Uses</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Submit false or misleading information</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Reverse engineer, copy, or redistribute any part of the Service</li>
              <li>Use the Service to spam or harass other users</li>
            </ul>

            <h2>8. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by Patriot Ops
              Center and are protected by applicable intellectual property laws. Your data remains yours.
            </p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Patriot Ops Center shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of
              the Service.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant
              changes by updating the date at the top of this page and, where appropriate, notifying you
              by email.
            </p>

            <h2>11. Contact</h2>
            <p>
              Questions about these Terms? Contact us at{' '}
              <a href="mailto:legal@patriot-ops.com">legal@patriot-ops.com</a>.
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
