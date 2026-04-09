import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Exact tokens from existing codebase ──
        navy: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        tactical: {
          50:  '#f4f7f4',
          100: '#e4ebe4',
          200: '#c8d6c8',
          300: '#a3b8a3',
          400: '#7a967a',
          500: '#5c7a5c',
          600: '#476147',
          700: '#3a4f3a',
          800: '#314031',
          900: '#2a362a',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
        sm:  'calc(0.625rem - 4px)',
        md:  'calc(0.625rem - 2px)',
        lg:  '0.625rem',
        xl:  'calc(0.625rem + 4px)',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern':    "url('/images/hero-pattern.svg')",
        'camo-pattern':    "url('/images/camo-pattern.svg')",
        'grid-pattern': `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':       'scan 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0' },
          '10%, 90%': { opacity: '1' },
          '100%':     { transform: 'translateY(500px)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': {
            textShadow:
              '0 0 2px rgba(251,191,36,1), 0 0 8px rgba(251,191,36,0.9), 0 0 16px rgba(251,191,36,0.4)',
          },
          '50%': {
            textShadow:
              '0 0 4px rgba(251,191,36,1), 0 0 12px rgba(251,191,36,0.95), 0 0 24px rgba(251,191,36,0.5)',
          },
        },
      },
      boxShadow: {
        'gold-sm': '0 0 0 1px rgba(245,158,11,0.2)',
        'gold-md': '0 0 0 1px rgba(245,158,11,0.3), 0 0 20px rgba(245,158,11,0.1)',
        'navy-lg': '0 20px 60px rgba(10,25,41,0.6)',
      },
    },
  },
  plugins: [typography],
}

export default config
