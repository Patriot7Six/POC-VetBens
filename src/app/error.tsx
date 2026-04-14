'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error reporting service (Sentry etc.) when available
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-px bg-red-800" />
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-red-500">
            System Error
          </span>
          <div className="w-10 h-px bg-red-800" />
        </div>

        <h1 className="text-3xl font-black text-navy-50 mb-3">Something went wrong</h1>

        <p className="text-navy-400 text-sm leading-relaxed mb-8">
          An unexpected error occurred. Our team has been notified. Please try again,
          or return to the home page.
          {error.digest && (
            <span className="block mt-2 text-navy-600 font-mono text-xs">
              Ref: {error.digest}
            </span>
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold
                       px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-navy-700 hover:border-navy-600 text-navy-300
                       hover:text-navy-100 font-medium px-6 py-3 rounded-xl
                       transition-colors text-sm"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
