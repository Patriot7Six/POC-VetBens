// lib/stripe.ts
import Stripe from 'stripe'
import type { SubscriptionTier } from '@/types/database'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

// ── Plan definitions ─────────────────────────────────────────────────────────
export interface PlanFeature {
  text: string
  included: boolean
}

export interface Plan {
  tier: SubscriptionTier
  name: string
  price: number                 // monthly USD cents
  priceId: string               // Stripe Price ID
  description: string
  badge?: string
  features: PlanFeature[]
  cta: string
}

export const PLANS: Plan[] = [
  {
    tier: 'free',
    name: 'Patriot',
    price: 0,
    priceId: '',                // no Stripe price needed for free
    description: 'Get started with basic benefits navigation.',
    features: [
      { text: 'Benefits Navigator hub',         included: true  },
      { text: 'VA Eligibility Checker (5/mo)',  included: true  },
      { text: 'Claims Copilot (3/mo)',           included: true  },
      { text: 'Community access',               included: true  },
      { text: 'Unlimited AI assistant calls',   included: false },
      { text: 'Priority claim reviews',         included: false },
      { text: 'Dedicated success advisor',      included: false },
    ],
    cta: 'Get Started Free',
  },
  {
    tier: 'pro',
    name: 'Ranger',
    price: 3400,                // $34.00
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    description: 'Everything you need to maximize your benefits.',
    badge: 'Most Popular',
    features: [
      { text: 'Everything in Patriot',          included: true  },
      { text: 'Unlimited VA Eligibility checks', included: true  },
      { text: 'Unlimited Claims Copilot',        included: true  },
      { text: 'Document upload & analysis',      included: true  },
      { text: 'Career transition toolkit',       included: true  },
      { text: 'Priority claim reviews',          included: false },
      { text: 'Dedicated success advisor',       included: false },
    ],
    cta: 'Start Ranger',
  },
  {
    tier: 'elite',
    name: 'Special Ops',
    price: 12400,               // $124.00
    priceId: process.env.STRIPE_ELITE_PRICE_ID!,
    description: 'White-glove service for complex benefit situations.',
    badge: 'Best Value',
    features: [
      { text: 'Everything in Ranger',           included: true  },
      { text: 'Dedicated success advisor',       included: true  },
      { text: 'Monthly 1-on-1 strategy call',   included: true  },
      { text: 'Priority claim reviews (48hr)',   included: true  },
      { text: 'Legal document review',           included: true  },
      { text: 'Family benefits coverage',        included: true  },
      { text: 'Appeals representation support',  included: true  },
    ],
    cta: 'Go Special Ops',
  },
]

export const getPlanByTier = (tier: SubscriptionTier): Plan =>
  PLANS.find(p => p.tier === tier) ?? PLANS[0]

export const formatPrice = (cents: number): string =>
  cents === 0 ? 'Free' : `$${(cents / 100).toFixed(0)}/mo`

// ── Feature gate map ─────────────────────────────────────────────────────────
export type FeatureKey =
  | 'va_eligibility_unlimited'
  | 'claims_copilot_unlimited'
  | 'document_upload'
  | 'career_toolkit'
  | 'priority_reviews'
  | 'success_advisor'
  | 'strategy_call'
  | 'legal_review'
  | 'family_benefits'
  | 'appeals_support'

const FEATURE_TIERS: Record<FeatureKey, SubscriptionTier[]> = {
  va_eligibility_unlimited: ['pro', 'elite'],
  claims_copilot_unlimited: ['pro', 'elite'],
  document_upload:          ['pro', 'elite'],
  career_toolkit:           ['pro', 'elite'],
  priority_reviews:         ['elite'],
  success_advisor:          ['elite'],
  strategy_call:            ['elite'],
  legal_review:             ['elite'],
  family_benefits:          ['elite'],
  appeals_support:          ['elite'],
}

export function hasFeature(tier: SubscriptionTier, feature: FeatureKey): boolean {
  return FEATURE_TIERS[feature].includes(tier)
}
