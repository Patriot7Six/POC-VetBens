'use client'

import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type Variant = 'gold' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type Size    = 'sm' | 'md' | 'lg' | 'xl' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  /** Render as child element (e.g. <Link>) instead of <button> */
  asChild?:  boolean
  children:  React.ReactNode
}

const variants: Record<Variant, string> = {
  gold:        'bg-gold-500 text-navy-900 hover:bg-gold-400 focus-visible:ring-gold-500 font-bold',
  primary:     'bg-navy-900 text-white hover:bg-navy-800 focus-visible:ring-navy-500 dark:bg-navy-700 dark:hover:bg-navy-600',
  secondary:   'bg-navy-700 text-white hover:bg-navy-600 focus-visible:ring-navy-400',
  outline:     'border-2 border-navy-700 text-navy-100 hover:border-gold-500 hover:text-gold-400 focus-visible:ring-navy-500 bg-transparent',
  ghost:       'text-navy-300 hover:bg-navy-800 hover:text-navy-100 focus-visible:ring-navy-500',
  destructive: 'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500',
}

const sizes: Record<Size, string> = {
  sm:   'h-8 px-3 text-xs gap-1.5',
  md:   'h-10 px-5 text-sm gap-2',
  lg:   'h-12 px-7 text-base gap-2',
  xl:   'h-14 px-9 text-lg gap-2.5',
  icon: 'h-10 w-10 p-0',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, asChild, className, children, ...props }, ref) => {
    // When asChild is true, render children's element (e.g. <Link>) with button styling
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={!asChild && (disabled || loading)}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
