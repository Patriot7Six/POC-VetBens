'use client'
// app/(auth)/signup/page.tsx
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')

    startTransition(async () => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
        },
      })
      if (error) { setError(error.message); return }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Check your email</h2>
        <p className="text-slate-400">
          We sent a confirmation link to{' '}
          <span className="text-white font-medium">{email}</span>.
          <br />Click it to activate your account.
        </p>
        <Link href="/login" className="text-gold-500 hover:text-gold-400 text-sm underline underline-offset-2">
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Join Patriot Ops Center
        </h1>
        <p className="text-slate-400 text-sm">
          Free to start. Upgrade when you're ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="John Smith"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                       placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                       focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                       placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                       focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                       placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                       focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed
                     text-navy-950 font-bold py-3 rounded-lg transition-colors text-sm tracking-wide mt-2"
        >
          {isPending ? 'Creating account…' : 'Create Free Account'}
        </button>

        <p className="text-center text-xs text-slate-600 pt-1">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="text-slate-500 hover:text-slate-400">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-500 hover:text-gold-400 font-medium">
          Sign in →
        </Link>
      </p>
    </div>
  )
}
