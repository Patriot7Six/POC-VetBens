'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  {
    label: 'Benefits Navigator',
    href:  '/benefits',
    description: 'Free VA benefits & claims support',
    badge: 'Free',
  },
  {
    label: 'Career Tools',
    href:  '/career',
    description: 'Resume, interviews & job board',
  },
  {
    label: 'For Organizations',
    href:  '/organizations',
    description: 'VSOs, law firms, TAP programs',
  },
  {
    label: 'Pricing',
    href:  '/pricing',
  },
]

export function Nav() {
  const pathname   = usePathname()
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy-950/95 backdrop-blur-xl border-b border-navy-800 shadow-navy-lg'
          : 'bg-navy-950/80 backdrop-blur-lg border-b border-navy-800/50'
      )}
    >
      <nav className="container-wide h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center
                          group-hover:bg-gold-400 transition-colors duration-200">
            <ShieldCheck className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <span className="font-black text-[15px] tracking-tight uppercase text-navy-50">
            Patriot <span className="text-gold-500">Ops</span> Center
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-gold-400 bg-gold-500/8'
                    : 'text-navy-300 hover:text-gold-400 hover:bg-navy-800'
                )}
              >
                {link.label}
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                   bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 leading-none">
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Status indicator */}
          <div className="flex items-center gap-1.5 text-[11px] text-navy-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400
                             shadow-[0_0_6px_rgba(52,211,153,0.6)]
                             animate-pulse" />
            Operational
          </div>

          <Link
            href="/login"
            className="text-sm font-medium text-navy-300 hover:text-navy-100 transition-colors"
          >
            Sign in
          </Link>
          <Button variant="gold" size="sm" asChild>
            <Link href="/signup">Get started free</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-navy-300 hover:text-navy-50 hover:bg-navy-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-navy-800 bg-navy-950/98 backdrop-blur-xl">
          <div className="container-wide py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg',
                  'transition-colors duration-150',
                  pathname.startsWith(link.href)
                    ? 'bg-gold-500/10 text-gold-400'
                    : 'text-navy-200 hover:bg-navy-800'
                )}
              >
                <div>
                  <div className="font-medium text-sm flex items-center gap-2">
                    {link.label}
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full
                                       bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  {link.description && (
                    <div className="text-xs text-navy-400 mt-0.5">{link.description}</div>
                  )}
                </div>
              </Link>
            ))}

            <div className="pt-3 mt-2 border-t border-navy-800 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" size="md" className="w-full">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="gold" size="md" className="w-full">Get started free</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
