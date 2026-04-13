// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendSubscriptionConfirmation } from "@/lib/resend";
import type { SubscriptionTier, SubscriptionStatus } from "@/types/database";
import { PLANS } from "@/lib/stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Price ID → tier lookup
function tierFromPriceId(priceId: string | null): SubscriptionTier {
  if (!priceId) return "free";
  const plan = PLANS.find((p) => p.priceId === priceId);
  return plan?.tier ?? "free";
}

async function upsertSubscription(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  subscription: Stripe.Subscription,
) {
  const userId: string = subscription.metadata.supabase_user_id;

  if (!userId) {
    console.error(
      "[webhook] No supabase_user_id in subscription metadata",
      subscription.id,
    );
    return;
  }

  const priceId = subscription.items.data[0]?.price.id ?? null;
  const tier = tierFromPriceId(priceId);

  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      tier,
      status: subscription.status as SubscriptionStatus,
      current_period_start: new Date(
        subscription.current_period_start * 1000,
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await upsertSubscription(supabase, sub);

        // Send confirmation email on new active subscription
        if (
          event.type === "customer.subscription.created" &&
          sub.status === "active"
        ) {
          const userId = sub.metadata.supabase_user_id;
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", userId)
            .single();

          if (profile?.email) {
            const tier = tierFromPriceId(sub.items.data[0]?.price.id ?? null);
            const plan = PLANS.find((p) => p.tier === tier);
            const nextBilling = new Date(
              sub.current_period_end * 1000,
            ).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });

            await sendSubscriptionConfirmation(
              profile.email,
              profile.full_name?.split(" ")[0] ?? "Veteran",
              plan?.name ?? tier,
              nextBilling,
            ).catch(console.error);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata.supabase_user_id;

        await supabase
          .from("subscriptions")
          .update({
            tier: "free",
            status: "canceled",
            stripe_subscription_id: null,
            stripe_price_id: null,
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | null;
        if (!subId) break;

        const sub = await stripe.subscriptions.retrieve(subId);
        await supabase
          .from("subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      default:
      // Unhandled — return 200 so Stripe doesn't retry
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
