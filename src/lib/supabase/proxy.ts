// lib/supabase/proxy.ts
// Next.js 16+ uses proxy.ts instead of middleware.ts.
// This helper is called by the root proxy.ts on every request.
// It refreshes the Supabase session token and passes updated cookies to
// both Server Components (via request) and the browser (via response).

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_ROUTES  = ['/', '/login', '/signup', '/pricing']
const ONBOARDING_ROUTE = '/onboarding'
const DASHBOARD_ROUTE  = '/dashboard'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    // Next.js 16 uses the new publishable key; falls back to anon key during transition
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write updated tokens back into the request so Server Components
          // see the refreshed session without making another network call.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          // Create a fresh response so we can set the cookies on the reply
          // that goes back to the browser.
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // ── IMPORTANT ────────────────────────────────────────────────────────────
  // Do NOT add any logic between createServerClient and getClaims/getUser.
  // A simple mistake can break session refreshing and sign users out randomly.
  // ─────────────────────────────────────────────────────────────────────────

  // getClaims() validates the JWT locally (signature + expiry) — no network
  // call, so the proxy stays fast. For hard logout detection, Server Components
  // still call supabase.auth.getUser() themselves.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims   // null when not signed in

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r)
    || pathname.startsWith('/api/stripe')
    || pathname.startsWith('/api/auth')

  // ── Route guards ──────────────────────────────────────────────────────────

  // 1. Unauthenticated → protected route
  if (!claims && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // 2. Authenticated → auth pages (redirect to dashboard)
  if (claims && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url))
  }

  // 3. Dashboard access — check onboarding completion.
  //    We use getClaims() here for speed; the dashboard layout will do a
  //    full getUser() + profile fetch anyway.
  if (claims && pathname.startsWith('/dashboard')) {
    // Read the onboarding flag from the JWT's app_metadata if you embed it there,
    // OR let the dashboard layout handle the redirect (it reads the DB).
    // Keeping this lightweight in the proxy is intentional — see note above.
  }

  // IMPORTANT: always return supabaseResponse (not a new NextResponse).
  // It carries the refreshed Set-Cookie headers the browser needs.
  return supabaseResponse
}
