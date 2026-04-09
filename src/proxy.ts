import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Next.js 16: proxy.ts replaces middleware.ts
// Runs on Node.js runtime, makes network boundary explicit

const PUBLIC_PATHS = [
  '/',
  '/benefits',
  '/benefits/(.*)',
  '/login',
  '/signup',
  '/auth/(.*)',
  '/about',
  '/pricing',
  '/organizations',
  '/api/benefits/(.*)',   // Public AI endpoints
]

const ORG_ADMIN_PATHS = ['/org/(.*)']
const AUTH_PATHS       = ['/login', '/signup']

function matchesPath(pathname: string, patterns: string[]): boolean {
  return patterns.some((pattern) => {
    const regex = new RegExp(`^${pattern}$`)
    return regex.test(pathname)
  })
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Create Supabase server client for auth checking
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Redirect authenticated users away from auth pages
  if (user && matchesPath(pathname, AUTH_PATHS)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect dashboard routes
  if (!user && pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Protect career tool routes (require authentication)
  if (!user && pathname.startsWith('/career')) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Org admin routes — require org membership
  if (pathname.startsWith('/org') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
