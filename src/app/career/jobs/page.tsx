import Link from 'next/link'
import { Nav }    from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge }  from '@/components/ui/primitives'
import { Briefcase, MapPin, Building2, Clock, ArrowRight, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veteran Job Board — Career Tools',
  description: 'Curated veteran-friendly job listings from companies with active military hiring programs.',
}

// Sample listings — in production these would come from a jobs API / database
const SAMPLE_JOBS = [
  { title: 'Operations Manager',       company: 'Amazon',          location: 'Arlington, VA',   type: 'Full-time', clearance: false, mosMatch: ['92A', '88M', '25U'] },
  { title: 'Cybersecurity Analyst',    company: 'Booz Allen',       location: 'Remote',          type: 'Full-time', clearance: true,  mosMatch: ['25B', '17C', '35N'] },
  { title: 'Project Manager',          company: 'Lockheed Martin',  location: 'Fort Worth, TX',  type: 'Full-time', clearance: true,  mosMatch: ['51C', '90A', 'FA50'] },
  { title: 'Law Enforcement Officer',  company: 'Federal Marshal',  location: 'Multiple Cities', type: 'Full-time', clearance: false, mosMatch: ['31B', '31E', '0411'] },
  { title: 'Logistics Coordinator',    company: 'FedEx',            location: 'Memphis, TN',     type: 'Full-time', clearance: false, mosMatch: ['88H', '92A', '3043'] },
  { title: 'Intelligence Analyst',     company: 'SAIC',             location: 'Washington, DC',  type: 'Full-time', clearance: true,  mosMatch: ['35F', '35G', '0231'] },
  { title: 'Healthcare Administrator', company: 'VA Medical Center',location: 'Nationwide',      type: 'Full-time', clearance: false, mosMatch: ['68A', '68W', '0000'] },
  { title: 'Software Engineer',        company: 'Microsoft',        location: 'Remote',          type: 'Full-time', clearance: false, mosMatch: ['25B', '17A', '0010'] },
]

export default function JobBoardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-950">
      <Nav />
      <main>

        {/* Header */}
        <div className="relative py-14 border-b border-navy-800 overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-50" />
          <div className="container-wide relative z-10">
            <div className="flex items-center gap-2 text-sm text-navy-500 mb-4">
              <Link href="/career" className="hover:text-navy-300 transition-colors">Career Tools</Link>
              <span className="text-navy-700">/</span>
              <span className="text-navy-300">Job Board</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-navy-50">Veteran Job Board</h1>
                  <Badge variant="free">Free</Badge>
                </div>
                <p className="text-navy-400 text-sm">
                  Curated roles from companies with active veteran hiring programs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container-wide py-10">
          {/* Search bar (static UI — full search requires backend) */}
          <div className="max-w-2xl mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-500" />
                <input
                  type="text"
                  placeholder="Search by MOS, job title, or keyword..."
                  disabled
                  className="w-full bg-navy-900 border border-navy-700 rounded-xl pl-10 pr-4 py-3
                             text-navy-50 placeholder:text-navy-600 text-sm cursor-not-allowed opacity-60"
                />
              </div>
              <Button variant="gold" size="md" asChild>
                <Link href="/signup">Sign in to search</Link>
              </Button>
            </div>
            <p className="text-xs text-navy-600 mt-2">
              Create a free account to search by MOS, filter by clearance, and save jobs.
            </p>
          </div>

          {/* Job listings */}
          <div className="grid gap-4 max-w-4xl">
            {SAMPLE_JOBS.map((job, i) => (
              <div
                key={i}
                className="bg-navy-900 rounded-xl border border-navy-700 hover:border-navy-600
                           p-6 transition-all group"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-bold text-navy-50 text-base">{job.title}</h2>
                      {job.clearance && (
                        <Badge variant="elite">Clearance Required</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-navy-400 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {job.type}
                      </span>
                    </div>
                    {job.mosMatch.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-xs text-navy-600">MOS match:</span>
                        {job.mosMatch.map((m) => (
                          <span key={m} className="text-xs font-mono px-1.5 py-0.5 rounded bg-navy-800 text-navy-400">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link
                    href="/signup"
                    className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-gold-500
                               hover:text-gold-400 transition-colors group-hover:gap-2"
                  >
                    Apply <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Load more CTA */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-navy-900 border border-navy-700 rounded-xl p-6 max-w-md">
              <p className="text-navy-300 text-sm mb-4">
                Sign in to unlock full search, MOS-matched recommendations, and save jobs to your profile.
              </p>
              <Button variant="gold" size="md" asChild>
                <Link href="/signup">Create free account →</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
