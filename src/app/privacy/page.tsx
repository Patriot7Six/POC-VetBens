import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Patriot Ops Center',
  description: 'Privacy Policy for Patriot Ops Center.',
}

const LAST_UPDATED = 'January 1, 2026'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>
        <section className="relative py-14 border-b border-navy-800">
          <div className="container-wide">
            <h1 className="text-3xl font-black text-navy-50 mb-2">Privacy Policy</h1>
            <p className="text-navy-500 text-sm">Last updated: {LAST_UPDATED}</p>
          </div>
        </section>

        <div className="container-wide py-12">
          <article className="prose prose-invert prose-sm max-w-3xl
                              prose-headings:text-navy-100 prose-headings:font-bold
                              prose-p:text-navy-400 prose-p:leading-relaxed
                              prose-li:text-navy-400 prose-a:text-gold-400">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul>
              <li><strong>Account information:</strong> name, email address, and password</li>
              <li><strong>Military service data:</strong> branch, MOS/rate, rank, separation date, and deployment history</li>
              <li><strong>Health information:</strong> self-reported disabilities and conditions (used solely to generate benefits guidance)</li>
              <li><strong>Documents:</strong> DD-214 and other uploaded files you choose to share</li>
              <li><strong>Payment information:</strong> processed securely by Stripe; we never store raw card numbers</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Generate personalized VA benefits eligibility assessments</li>
              <li>Provide claims filing guidance and transition support</li>
              <li>Process subscription payments and send billing receipts</li>
              <li>Send product updates and resource emails (you may opt out at any time)</li>
              <li>Improve our AI models using anonymized, aggregated data only</li>
            </ul>

            <h2>3. Data Storage and Security</h2>
            <p>
              Your data is stored in Supabase (PostgreSQL) with row-level security policies that ensure
              you can only access your own data. All data is encrypted in transit (TLS 1.3) and at rest.
              We follow industry-standard security practices and conduct regular security reviews.
            </p>

            <h2>4. Data Sharing</h2>
            <p>We do not sell your personal information. We share data only with:</p>
            <ul>
              <li><strong>Stripe:</strong> for payment processing</li>
              <li><strong>Supabase:</strong> for database and authentication services</li>
              <li><strong>Anthropic:</strong> for AI inference (data sent is governed by Anthropic&apos;s API terms)</li>
              <li><strong>Resend:</strong> for transactional email delivery</li>
              <li><strong>Sentry:</strong> for error monitoring (no PII in error logs)</li>
            </ul>

            <h2>5. Organization Data</h2>
            <p>
              If you access Patriot Ops Center through an organization (VSO, employer, etc.), your
              organization administrators may view your progress and profile data as permitted by
              your role. However, your data remains yours — you retain full access even if you
              leave the organization.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access all personal data we hold about you</li>
              <li>Correct inaccurate information in your profile</li>
              <li>Request deletion of your account and associated data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use essential cookies for authentication session management. We do not use
              third-party advertising cookies. Analytics, if enabled, use privacy-respecting,
              cookieless measurement.
            </p>

            <h2>8. Children&apos;s Privacy</h2>
            <p>
              The Service is not directed to individuals under the age of 18. We do not knowingly
              collect personal information from minors.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material
              changes by email or prominent notice within the Service.
            </p>

            <h2>10. Contact</h2>
            <p>
              Privacy questions or data requests:{' '}
              <a href="mailto:privacy@patriot-ops.com">privacy@patriot-ops.com</a>
            </p>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
