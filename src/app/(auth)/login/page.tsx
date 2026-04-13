'use client'
// app/(auth)/login/page.tsx
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Mode = 'password' | 'magic'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const redirectTo = params.get('redirectTo') ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const supabase = createClient()

  const handlePasswordLogin = () => {
    setError('')
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); return }
      router.push(redirectTo)
      router.refresh()
    })
  }

  const handleMagicLink = () => {
    setError('')
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${redirectTo}`,
        },
      })
      if (error) { setError(error.message); return }
      setMagicSent(true)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'password') handlePasswordLogin()
    else handleMagicLink()
  }

  if (magicSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Check your email</h2>
        <p className="text-slate-400">
          We sent a sign-in link to <span className="text-white">{email}</span>.
          <br />It expires in 1 hour.
        </p>
        <button
          onClick={() => { setMagicSent(false); setEmail('') }}
          className="text-gold-500 hover:text-gold-400 text-sm underline underline-offset-2"
        >
          Try a different email
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back</h1>
        <p className="text-slate-400 text-sm">Sign in to access your benefits dashboard</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-lg mb-6">
        {(['password', 'magic'] as const).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              mode === m
                ? 'bg-gold-500 text-navy-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {m === 'password' ? 'Password' : 'Magic Link'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {mode === 'password' && (
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-gold-500/80 hover:text-gold-400">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white
                         placeholder:text-slate-600 focus:outline-none focus:border-gold-500/60
                         focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
            />
          </div>
        )}

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
                     text-navy-950 font-bold py-3 rounded-lg transition-colors text-sm tracking-wide"
        >
          {isPending
            ? 'Please wait…'
            : mode === 'password'
            ? 'Sign In'
            : 'Send Magic Link'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to Patriot Ops?{' '}
        <Link href="/signup" className="text-gold-500 hover:text-gold-400 font-medium">
          Create your account →
        </Link>
      </p>
    </div>
  )
}
