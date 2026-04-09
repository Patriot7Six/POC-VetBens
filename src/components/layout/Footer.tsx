'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

const LINKS = {
  Platform: [
    { label: 'Benefits Navigator', href: '/benefits' },
    { label: 'Claims Copilot',     href: '/benefits/claims' },
    { label: 'Transition Timeline',href: '/benefits/timeline' },
    { label: 'Career Tools',       href: '/career' },
    { label: 'Job Board',          href: '/career/jobs' },
    { label: 'Clearance Market',   href: '/career/clearance' },
  ],
  Organizations: [
    { label: 'VSO Partners',       href: '/organizations#vso' },
    { label: 'Legal & Claims',     href: '/organizations#legal' },
    { label: 'TAP Programs',       href: '/organizations#tap' },
    { label: 'Employers',          href: '/organizations#employers' },
    { label: 'Request Demo',       href: '/organizations/demo' },
  ],
  Company: [
    { label: 'About',              href: '/about' },
    { label: 'Pricing',            href: '/pricing' },
    { label: 'Blog',               href: '/blog' },
    { label: 'Privacy Policy',     href: '/privacy' },
    { label: 'Terms of Service',   href: '/terms' },
    { label: 'Contact',            href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800">
      <div className="container-wide py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center
                              group-hover:bg-gold-400 transition-colors">
                <ShieldCheck className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
              </div>
              <span className="font-black text-[14px] tracking-tight uppercase text-navy-50">
                Patriot <span className="text-gold-500">Ops</span> Center
              </span>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed max-w-[260px]">
              AI-powered transition support for every veteran — from first conversation
              about separation to a thriving civilian career.
            </p>
            <div className="mt-5 flex items-center gap-2 text-[11px] text-navy-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              All systems operational
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[11px] font-bold tracking-[0.12em] uppercase text-navy-500 mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-400 hover:text-gold-400 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-navy-800/60 flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <p className="text-[12px] text-navy-600">
            © {new Date().getFullYear()} Patriot Ops Center. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-[12px] text-navy-600">
            <span>🇺🇸</span>
            <span>Built with pride for those who served</span>
          </div>
        </div>
      </div>
    </footer>
  )
}