import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merging utility — use everywhere instead of template strings
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format date
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return d.toLocaleDateString('en-US',
    format === 'long'
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

// Days until a date
export function daysUntil(date: string | Date): number {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = d.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Subscription tier helpers
export type Tier = 'free' | 'pro' | 'elite'

export const TIER_LIMITS = {
  free: {
    resumes:           1,
    interviewSessions: 3,
    jobListings:       20,
    questionsPerSession: 10,
  },
  pro: {
    resumes:           Infinity,
    interviewSessions: Infinity,
    jobListings:       Infinity,
    questionsPerSession: 20,
  },
  elite: {
    resumes:           Infinity,
    interviewSessions: Infinity,
    jobListings:       Infinity,
    questionsPerSession: 20,
  },
} as const

export function canAccess(tier: Tier, feature: keyof typeof TIER_LIMITS.pro): boolean {
  const limit = TIER_LIMITS[tier][feature]
  return limit === Infinity || limit > 0
}

export function isProOrElite(tier: Tier): boolean {
  return tier === 'pro' || tier === 'elite'
}

// MOS branch lookup helper
export const BRANCH_LABELS: Record<string, string> = {
  army:          'U.S. Army',
  navy:          'U.S. Navy',
  marine_corps:  'U.S. Marine Corps',
  air_force:     'U.S. Air Force',
  space_force:   'U.S. Space Force',
  coast_guard:   'U.S. Coast Guard',
  national_guard:'National Guard',
  reserves:      'Reserves',
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
