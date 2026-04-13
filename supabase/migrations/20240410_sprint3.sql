-- ============================================================
-- Sprint 3: Profiles, Subscriptions, Onboarding
-- ============================================================

-- Extend auth.users with public profile data
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text,
  full_name      text,
  avatar_url     text,
  -- Military profile
  branch         text check (branch in (
    'Army','Navy','Air Force','Marine Corps',
    'Coast Guard','Space Force','National Guard','Reserves'
  )),
  mos            text,          -- MOS / Rate / AFSC
  rank           text,
  ets_date       date,          -- End of Term of Service
  -- Onboarding state
  onboarding_complete boolean not null default false,
  onboarding_step     int     not null default 0,
  -- Stripe
  stripe_customer_id  text unique,
  -- Timestamps
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Subscription tiers
-- (PostgreSQL has no CREATE TYPE IF NOT EXISTS; guard with a DO block instead)
do $$ begin
  create type subscription_tier as enum ('free', 'pro', 'elite');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_status as enum (
    'active', 'canceled', 'incomplete', 'incomplete_expired',
    'past_due', 'paused', 'trialing', 'unpaid'
  );
exception when duplicate_object then null;
end $$;

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

-- One subscription per user index
create unique index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- ── RLS ────────────────────────────────────────────────────
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;

-- Profiles: users can only read/write their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Subscriptions: users can only read their own row
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- Service role can do everything (needed for webhook handler)
create policy "subscriptions_service_all" on public.subscriptions
  using (auth.role() = 'service_role');

create policy "profiles_service_all" on public.profiles
  using (auth.role() = 'service_role');

-- ── Triggers ───────────────────────────────────────────────
-- Auto-create profile on signup
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
  -- Also seed a free subscription record
  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();