// app/(auth)/layout.tsx
import type { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      {/* Background star field effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(245,158,11,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 120%, rgba(30,64,120,0.4) 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245,158,11,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6 py-12">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded bg-gold-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-navy-950">
              <path d="M12 2L3 7v10l9 5 9-5V7L12 2zm0 2.18L19 8v8l-7 3.88L5 16V8l7-3.82z"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            Patriot <span className="text-gold-500">Ops</span>
          </span>
        </div>

        {children}
      </div>
    </div>
  )
}
