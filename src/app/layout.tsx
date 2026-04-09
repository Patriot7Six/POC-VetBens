import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Patriot Ops Center — Your Mission Continues',
    template: '%s | Patriot Ops Center',
  },
  description:
    'AI-powered VA benefits navigator, claims copilot, and career transition tools for veterans. Free benefits support forever.',
  keywords: [
    'veteran benefits',
    'VA claims',
    'military transition',
    'veteran jobs',
    'DD214',
    'MOS translator',
    'TAP program',
  ],
  authors: [{ name: 'Patriot Ops Center' }],
  creator: 'Patriot Ops Center',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://patriot7six.com',
    siteName: 'Patriot Ops Center',
    title: 'Patriot Ops Center — Your Mission Continues',
    description:
      'AI-powered VA benefits navigator and career transition platform for veterans. Free forever.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Patriot Ops Center',
    description: 'Your Mission Continues',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://patriot7six.com'),
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)',  color: '#0a1929' },
    { media: '(prefers-color-scheme: light)', color: '#f0f4f8' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#102a43',
                border: '1px solid #334e68',
                color: '#f0f4f8',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
