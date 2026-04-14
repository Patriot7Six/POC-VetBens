'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Metadata } from 'next'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState(false)
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) { setError(error.message); return }
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    })
  }

  return (
    <div
      className="min-h-screen bg-navy-950 flex items-center justify-center px-4"
      style={{
        backgroundImage: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.08), transparent)`,
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500 flex items-center justify-center">
              <span className="text-navy-950 font-black text-sm">P</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight">
              Patriot Ops
            </span>
          </Link>
        </div>

        <div className="bg-white/3 border border-white/8 rounded-2xl p-8">
          {done ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Password updated</h2>
              <p className="text-slate-400 text-sm">
                Your new password has been saved. Redirecting you to your dashboard…
              </p>
            </div>
          ) : (
            <>
              <div className="mb-7 text-center">
                <h1 className="text-2xl font-extrabold text-white mb-2">Set new password</h1>
                <p className="text-slate-400 text-sm">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                               placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                               focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                               placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                               focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed
                             text-navy-950 font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
                >
                  {isPending ? 'Saving…' : 'Update password'}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-slate-500">
                Remembered it?{' '}
                <Link href="/login" className="text-gold-500 hover:text-gold-400 font-medium">
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
