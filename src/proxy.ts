// proxy.ts  (project root — replaces middleware.ts in Next.js 16)
//
// Next.js 16 renamed middleware.ts → proxy.ts and the exported function
// from `middleware` → `proxy`.  Drop this file at the project root
// alongside app/, public/, etc.  Delete the old middleware.ts.
//
// The proxy runs on every matched request before the page renders.
// Its job: refresh the Supabase session token and redirect unauthenticated
// users.  Heavy business logic lives in lib/supabase/proxy.ts.

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     *   - _next/static  (static assets)
     *   - _next/image   (image optimization)
     *   - favicon.ico
     *   - any file with an image/font extension
     *
     * The Stripe webhook route bypasses auth inside updateSession,
     * so it's safe to include here.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
}
