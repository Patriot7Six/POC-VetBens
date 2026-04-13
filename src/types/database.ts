// types/database.ts  –  extend with your existing DB type as needed

export type SubscriptionTier = 'free' | 'pro' | 'elite'
export type SubscriptionStatus =
  | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired'
  | 'past_due' | 'paused' | 'trialing' | 'unpaid'

export type MilitaryBranch =
  | 'Army' | 'Navy' | 'Air Force' | 'Marine Corps'
  | 'Coast Guard' | 'Space Force' | 'National Guard' | 'Reserves'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  branch: MilitaryBranch | null
  mos: string | null
  rank: string | null
  ets_date: string | null        // ISO date string
  onboarding_complete: boolean
  onboarding_step: number
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  trial_end: string | null
  created_at: string
  updated_at: string
}

export interface UserWithSubscription {
  profile: Profile
  subscription: Subscription
}
