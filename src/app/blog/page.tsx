import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Patriot Ops Center',
  description: 'Guides, news, and resources for veterans navigating benefits, claims, and career transition.',
}

// In production these would be fetched from a CMS (Sanity, Contentful, etc.)
const POSTS = [
  {
    category: 'Benefits',
    title:    '2026 VA Disability Rates: What Changed and What It Means for You',
    excerpt:  'The 2.8% COLA increase is now in effect. Here is a complete breakdown of updated monthly payments by rating from 10% to 100%, with and without dependents.',
    date:     'Dec 1, 2025',
    readTime: '5 min read',
    slug:     '2026-va-disability-rates',
  },
  {
    category: 'Claims',
    title:    'PACT Act 2024 Expansion: 50 New Presumptive Conditions Added',
    excerpt:  'The PACT Act continues to expand. We cover the newest additions for toxic exposure veterans, Camp Lejeune survivors, and post-9/11 service members.',
    date:     'Nov 15, 2025',
    readTime: '7 min read',
    slug:     'pact-act-2024-expansion',
  },
  {
    category: 'Career',
    title:    'How to Translate Your MOS Into a Six-Figure Civilian Career',
    excerpt:  "Military skills are in demand — but you need to speak the language employers understand. Here's how to map your experience to high-value civilian roles.",
    date:     'Oct 28, 2025',
    readTime: '8 min read',
    slug:     'mos-translation-guide',
  },
  {
    category: 'Claims',
    title:    'C&P Exam Prep: The Complete Guide for Veterans',
    excerpt:  'Your Compensation and Pension exam can make or break your rating. What to say, what not to say, and how to document your conditions accurately.',
    date:     'Oct 10, 2025',
    readTime: '10 min read',
    slug:     'cp-exam-prep-guide',
  },
  {
    category: 'Benefits',
    title:    'VA Healthcare Enrollment: Priority Groups Explained',
    excerpt:  'Not all veterans have the same healthcare eligibility. Learn which priority group you belong to, what copays you owe, and how to maximize your VA healthcare.',
    date:     'Sep 22, 2025',
    readTime: '6 min read',
    slug:     'va-healthcare-priority-groups',
  },
  {
    category: 'Career',
    title:    'Veteran Resume Writing: ATS Optimization for 2025',
    excerpt:  'Over 90% of employers use applicant tracking systems. Here is how to write a veteran resume that passes the ATS filter and lands in human hands.',
    date:     'Sep 5, 2025',
    readTime: '9 min read',
    slug:     'veteran-resume-ats-guide',
  },
]

const CATEGORY_VARIANT: Record<string, 'free' | 'gold' | 'pro'> = {
  Benefits: 'free',
  Claims:   'gold',
  Career:   'pro',
}

export default function BlogPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <section className="relative py-16 overflow-hidden border-b border-navy-800">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="container-wide relative z-10">
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-black tracking-tight text-navy-50 mb-3">
              Resources & Guides
            </h1>
            <p className="text-navy-400 max-w-lg">
              Actionable information on VA benefits, claims strategy, and career transition for veterans.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-12">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {POSTS.map((post) => (
                <article
                  key={post.slug}
                  className="bg-navy-900 rounded-2xl border border-navy-700 hover:border-navy-600
                             transition-all overflow-hidden group flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={CATEGORY_VARIANT[post.category] ?? 'navy'}>
                        {post.category}
                      </Badge>
                    </div>
                    <h2 className="font-bold text-navy-50 text-base mb-3 group-hover:text-gold-400 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-navy-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="px-6 pb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-navy-600">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    {/* Posts are not individually published yet — link to signup */}
                    <Link
                      href="/signup"
                      className="text-xs font-medium text-gold-500 hover:text-gold-400 transition-colors
                                 flex items-center gap-1"
                    >
                      Read <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-navy-500 text-sm mb-4">
                Create a free account to read all guides and get weekly benefit updates.
              </p>
              <Button variant="gold" size="md" asChild>
                <Link href="/signup">Get weekly veteran resources →</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
