// hooks/useSubscription.ts
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { hasFeature } from '@/lib/stripe'
import type { FeatureKey } from '@/lib/stripe'
import type { Subscription, SubscriptionTier } from '@/types/database'

interface UseSubscriptionReturn {
  subscription: Subscription | null
  tier: SubscriptionTier
  isLoading: boolean
  isPro: boolean
  isElite: boolean
  can: (feature: FeatureKey) => boolean
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setIsLoading(false); return }

      const { data } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (mounted) {
        setSubscription(data ?? null)
        setIsLoading(false)
      }
    }

    load()

    // Real-time updates when subscription changes (e.g. after checkout)
    const channel = supabase
      .channel('subscription-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
      }, payload => {
        if (mounted) setSubscription(payload.new as Subscription)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  const tier: SubscriptionTier = subscription?.tier ?? 'free'
  const isActive = !subscription || ['active', 'trialing'].includes(subscription.status)

  return {
    subscription,
    tier: isActive ? tier : 'free',
    isLoading,
    isPro: isActive && (tier === 'pro' || tier === 'elite'),
    isElite: isActive && tier === 'elite',
    can: (feature: FeatureKey) => isActive && hasFeature(tier, feature),
  }
}
