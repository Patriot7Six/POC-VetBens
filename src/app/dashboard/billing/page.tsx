'use client'
// app/dashboard/billing/page.tsx
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSubscription } from '@/hooks/useSubscription'
import { PLANS, formatPrice, type Plan } from '@/lib/stripe'

export default function BillingPage() {
  const { subscription, tier, isLoading } = useSubscription()
  const params = useSearchParams()
  const success = params.get('success')
  const canceled = params.get('canceled')

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="h-16 border-b border-white/[0.06] px-8 flex items-center">
        <h1 className="text-white font-semibold">Billing & Plans</h1>
      </header>

      <div className="p-8 max-w-5xl space-y-8">
        {/* Status toasts */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-emerald-300 font-medium">
              Subscription activated! Your plan is now live.
            </p>
          </div>
        )}
        {canceled && (
          <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <p className="text-sm text-amber-300">Checkout was canceled. Your plan hasn't changed.</p>
          </div>
        )}

        {/* Current plan */}
        {!isLoading && subscription && (
          <CurrentPlanCard subscription={subscription} tier={tier} />
        )}

        {/* Plan grid */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <PlanCard
                key={plan.tier}
                plan={plan}
                currentTier={tier}
                isLoading={isLoading}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function CurrentPlanCard({
  subscription,
  tier,
}: {
  subscription: NonNullable<ReturnType<typeof useSubscription>['subscription']>
  tier: string
}) {
  const [isPending, startTransition] = useTransition()

  const openPortal = () => {
    startTransition(async () => {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url } = await res.json()
      if (url) window.location.href = url
    })
  }

  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Current Plan</p>
          <p className="text-xl font-bold text-white capitalize">{tier}</p>
          {periodEnd && (
            <p className="text-xs text-slate-500 mt-1">
              {subscription.cancel_at_period_end
                ? `Cancels on ${periodEnd}`
                : `Renews ${periodEnd}`}
            </p>
          )}
        </div>
        {tier !== 'free' && (
          <button
            onClick={openPortal}
            disabled={isPending}
            className="text-xs font-medium text-slate-400 hover:text-white border border-white/10
                       hover:border-white/20 px-4 py-2 rounded-lg transition-all disabled:opacity-50"
          >
            {isPending ? 'Loading…' : 'Manage Subscription →'}
          </button>
        )}
      </div>
    </div>
  )
}

function PlanCard({
  plan,
  currentTier,
  isLoading,
}: {
  plan: Plan
  currentTier: string
  isLoading: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const isCurrent = plan.tier === currentTier
  const isDowngrade = (
    (currentTier === 'elite' && plan.tier !== 'elite') ||
    (currentTier === 'pro' && plan.tier === 'free')
  )

  const handleCheckout = () => {
    if (isCurrent || plan.tier === 'free' || isLoading) return
    startTransition(async () => {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: plan.tier }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    })
  }

  return (
    <div className={`relative rounded-2xl border flex flex-col overflow-hidden transition-all ${
      isCurrent
        ? 'border-gold-500/40 bg-gold-500/5'
        : plan.badge
        ? 'border-gold-500/20 bg-white/[0.03]'
        : 'border-white/[0.07] bg-white/[0.02]'
    }`}>
      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute top-4 right-4">
          <span className="text-xs font-bold text-navy-950 bg-gold-500 px-2.5 py-1 rounded-full">
            {plan.badge}
          </span>
        </div>
      )}

      {/* Current indicator */}
      {isCurrent && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-gold-500 to-transparent" />
      )}

      <div className="p-6 flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">{plan.name}</p>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-extrabold text-white">{formatPrice(plan.price)}</span>
        </div>
        <p className="text-xs text-slate-500 mb-5">{plan.description}</p>

        <ul className="space-y-2.5">
          {plan.features.map(f => (
            <li key={f.text} className="flex items-start gap-2.5">
              <svg
                className={`w-4 h-4 mt-0.5 shrink-0 ${f.included ? 'text-gold-400' : 'text-slate-700'}`}
                fill="currentColor" viewBox="0 0 20 20"
              >
                {f.included
                  ? <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  : <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                }
              </svg>
              <span className={`text-xs leading-relaxed ${f.included ? 'text-slate-300' : 'text-slate-600'}`}>
                {f.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={handleCheckout}
          disabled={isCurrent || plan.tier === 'free' || isPending || isLoading || isDowngrade}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
            isCurrent
              ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20 cursor-default'
              : plan.tier === 'free' || isDowngrade
              ? 'bg-white/5 text-slate-500 cursor-default'
              : 'bg-gold-500 hover:bg-gold-400 text-navy-950 disabled:opacity-50 disabled:cursor-wait'
          }`}
        >
          {isPending
            ? 'Redirecting…'
            : isCurrent
            ? '✓ Current Plan'
            : isDowngrade
            ? 'Manage in Portal'
            : plan.cta}
        </button>
      </div>
    </div>
  )
}
