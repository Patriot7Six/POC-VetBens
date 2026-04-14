// types/database.ts  –  extend with your existing DB type as needed

export type SubscriptionTier = 'free' | 'pro' | 'elite'
export type SubscriptionStatus =
  | 'active' | 'canceled' | 'incomplete' | 'incomplete_expired'
  | 'past_due' | 'paused' | 'trialing' | 'unpaid'

export type MilitaryBranch =
  | 'army' | 'navy' | 'air_force' | 'marine_corps'
  | 'coast_guard' | 'space_force' | 'national_guard' | 'reserves'

export interface Profile {
  id: string
  created_at: string
  updated_at: string

  // Personal info
  full_name: string | null
  email: string | null
  avatar_url: string | null
  phone: string | null

  // Military service
  branch: MilitaryBranch | null
  mos_code: string | null
  mos_title: string | null
  rank: string | null
  years_of_service: number | null
  separation_date: string | null
  ets_date: string | null
  deployment_count: number
  combat_vet: boolean
  security_clearance: string | null

  // Transition state
  transition_started_at: string | null
  is_transitioning: boolean

  // Subscription
  tier: SubscriptionTier
  stripe_customer_id: string | null
  subscription_id: string | null

  // Preferences
  location_city: string | null
  location_state: string | null
  target_industry: string[] | null
  target_roles: string[] | null

  // Meta
  onboarding_complete: boolean
  terms_accepted_at: string | null
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
