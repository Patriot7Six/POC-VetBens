// app/api/stripe/checkout/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tier } = await request.json()
  const plan = PLANS.find(p => p.tier === tier)

  if (!plan || plan.tier === 'free' || !plan.priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const origin = request.headers.get('origin') ?? 'https://beta.patriot-ops.com'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    subscription_data: {
      metadata: { supabase_user_id: user.id, tier },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
  })

  return NextResponse.json({ url: session.url })
}
