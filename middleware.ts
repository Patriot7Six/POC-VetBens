// middleware.ts  (project root)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/auth/callback', '/pricing']
const ONBOARDING_ROUTE = '/onboarding'
const DASHBOARD_ROUTE = '/dashboard'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh session — IMPORTANT: do not run query logic between createServerClient
  // and supabase.auth.getUser(). See @supabase/ssr docs.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Not logged in + protected route → send to login
  if (!user && !PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith('/api/stripe'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Logged in + auth page → redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url))
  }

  // Logged in but onboarding not complete → gate all dashboard routes
  if (user && pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .single()

    if (profile && !profile.onboarding_complete) {
      return NextResponse.redirect(new URL(ONBOARDING_ROUTE, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
