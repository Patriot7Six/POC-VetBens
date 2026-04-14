-- ============================================================
-- Sprint 3: Subscriptions table + updated signup trigger
-- ============================================================
-- NOTE: The profiles table is created by 001_initial_schema.sql.
-- This migration adds the subscriptions table and updates the
-- signup trigger to also seed a free subscription row.

-- ── Enums ─────────────────────────────────────────────────────
-- subscription_tier already exists from 001_initial_schema.sql.
-- subscription_status is new — guard against reruns.

do $$ begin
  create type subscription_status as enum (
    'active', 'canceled', 'incomplete', 'incomplete_expired',
    'past_due', 'paused', 'trialing', 'unpaid'
  );
exception when duplicate_object then null;
end $$;

-- ── Subscriptions table ───────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  tier                    subscription_tier not null default 'free',
  status                  subscription_status not null default 'active',
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  canceled_at             timestamptz,
  trial_end               timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- One subscription per user
create unique index if not exists subscriptions_user_id_idx
  on public.subscriptions(user_id);

-- ── RLS for subscriptions ─────────────────────────────────────
alter table public.subscriptions enable row level security;

-- Users can only read their own subscription
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Service role can do everything (needed for Stripe webhook handler)
create policy "subscriptions_service_all" on public.subscriptions
  using (auth.role() = 'service_role');

-- ── Updated signup trigger ────────────────────────────────────
-- Replaces the version from 001 to also seed a free subscription.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  -- Seed a free subscription record
  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

-- ── Updated_at trigger for subscriptions ──────────────────────
-- Reuses the handle_updated_at() function from 001_initial_schema.
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();
