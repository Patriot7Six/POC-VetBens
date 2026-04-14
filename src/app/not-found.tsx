import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)',
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 mb-12 group">
          <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center group-hover:bg-gold-400 transition-colors">
            <ShieldCheck className="w-5 h-5 text-navy-900" strokeWidth={2.5} />
          </div>
          <span className="font-black text-[15px] tracking-tight uppercase text-navy-50">
            Patriot <span className="text-gold-500">Ops</span> Center
          </span>
        </Link>

        {/* 404 callout */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-16 h-px bg-gold-600" />
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-gold-500">
            404 — Page Not Found
          </span>
          <div className="w-16 h-px bg-gold-600" />
        </div>

        <h1 className="text-5xl font-black text-navy-50 mb-4 tracking-tight">
          Mission <span className="text-gold-500">Not Found</span>
        </h1>

        <p className="text-navy-400 leading-relaxed mb-10">
          The page you were looking for doesn&apos;t exist or may have moved.
          Let&apos;s get you back on mission.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400
                       text-navy-950 font-bold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Return to Base
          </Link>
          <Link
            href="/benefits"
            className="inline-flex items-center gap-2 border border-navy-700 hover:border-navy-600
                       text-navy-200 hover:text-navy-50 font-medium px-6 py-3 rounded-xl
                       transition-colors text-sm"
          >
            Benefits Navigator
          </Link>
        </div>
      </div>
    </div>
  )
}
