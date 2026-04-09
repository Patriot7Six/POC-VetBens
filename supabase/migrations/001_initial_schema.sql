-- ════════════════════════════════════════════════════════════════
-- Migration: 001_initial_schema.sql
-- Patriot Ops Center — Core Database Schema
-- ════════════════════════════════════════════════════════════════

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- full-text search

-- ──────────────────────────────────────────────────────────────
-- ENUMS
-- ──────────────────────────────────────────────────────────────
create type military_branch as enum (
  'army', 'navy', 'marine_corps', 'air_force',
  'space_force', 'coast_guard', 'national_guard', 'reserves'
);

create type subscription_tier as enum ('free', 'pro', 'elite');

create type org_type as enum (
  'vso', 'legal', 'tap_program', 'employer', 'nonprofit', 'government'
);

create type org_member_role as enum ('member', 'case_manager', 'admin', 'owner');

create type claim_status as enum (
  'not_started', 'gathering_evidence', 'submitted',
  'in_review', 'decision_received', 'appealing', 'closed'
);

create type milestone_status as enum ('pending', 'in_progress', 'complete', 'skipped');

create type document_type as enum (
  'dd214', 'medical_record', 'service_record',
  'va_letter', 'noa', 'other'
);

-- ──────────────────────────────────────────────────────────────
-- CORE: PROFILES
-- Extends auth.users. One row per user. User always owns this.
-- ──────────────────────────────────────────────────────────────
create table public.profiles (
  id                uuid        primary key references auth.users(id) on delete cascade,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- Personal info
  full_name         text,
  email             text,
  avatar_url        text,
  phone             text,

  -- Military service
  branch            military_branch,
  mos_code          text,                    -- e.g. "11B", "25U", "0311"
  mos_title         text,                    -- e.g. "Infantryman"
  rank              text,                    -- e.g. "E-5", "O-3"
  years_of_service  smallint,
  separation_date   date,
  ets_date          date,                    -- ETS / EAS / retirement date
  deployment_count  smallint default 0,
  combat_vet        boolean default false,
  security_clearance text,                   -- "none", "secret", "ts", "ts_sci"

  -- Transition state
  transition_started_at timestamptz,
  is_transitioning  boolean default false,

  -- Subscription
  tier              subscription_tier not null default 'free',
  stripe_customer_id text unique,
  subscription_id   text,

  -- Preferences
  location_city     text,
  location_state    text,
  target_industry   text[],
  target_roles      text[],

  -- Meta
  onboarding_complete boolean default false,
  terms_accepted_at   timestamptz
);

comment on table public.profiles is
  'User-owned profile. Extends auth.users. Never deleted by orgs.';

-- ──────────────────────────────────────────────────────────────
-- CORE: ORGANIZATIONS (TENANTS)
-- ──────────────────────────────────────────────────────────────
create table public.organizations (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  name          text        not null,
  slug          text        not null unique,   -- subdomain / URL key
  org_type      org_type    not null,
  website       text,
  description   text,

  -- Branding (white-label)
  logo_url      text,
  primary_color text default '#f59e0b',
  custom_domain text unique,

  -- Billing
  stripe_customer_id   text unique,
  subscription_id      text,
  plan                 text default 'trial',   -- trial | vso | legal | enterprise | tap
  seat_count           smallint default 0,
  max_seats            smallint default 10,

  -- Contact
  contact_name  text,
  contact_email text,

  -- Status
  is_active     boolean default true,
  verified_at   timestamptz
);

comment on table public.organizations is
  'Tenant organizations. VSOs, law firms, TAP programs, employers.';

-- ──────────────────────────────────────────────────────────────
-- CORE: ORG MEMBERS (JUNCTION)
-- Organizations have members. Veterans retain their profiles.
-- ──────────────────────────────────────────────────────────────
create table public.org_members (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  org_id        uuid        not null references public.organizations(id) on delete cascade,
  user_id       uuid        not null references public.profiles(id) on delete cascade,
  role          org_member_role not null default 'member',
  invited_by    uuid        references public.profiles(id),
  joined_at     timestamptz default now(),
  notes         text,                           -- case manager notes (org-visible only)

  unique (org_id, user_id)
);

comment on table public.org_members is
  'Junction: org ↔ user. Orgs control this row. User data stays untouched when row is deleted.';

-- ──────────────────────────────────────────────────────────────
-- CORE: ORG INVITES
-- ──────────────────────────────────────────────────────────────
create table public.org_invites (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),

  org_id        uuid        not null references public.organizations(id) on delete cascade,
  invited_by    uuid        not null references public.profiles(id),
  email         text        not null,
  role          org_member_role not null default 'member',
  token         text        not null unique default encode(gen_random_bytes(32), 'hex'),
  expires_at    timestamptz not null default (now() + interval '7 days'),
  accepted_at   timestamptz,

  unique (org_id, email)
);

-- ──────────────────────────────────────────────────────────────
-- BENEFITS MODULE: DOCUMENTS
-- ──────────────────────────────────────────────────────────────
create table public.documents (
  id            uuid        primary key default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  user_id       uuid        not null references public.profiles(id) on delete cascade,
  doc_type      document_type not null,
  file_name     text        not null,
  storage_path  text        not null,          -- Supabase Storage path
  file_size     int,
  mime_type     text,

  -- Parsed data (from DD214 AI extraction)
  parsed_data   jsonb,
  parsed_at     timestamptz
);

-- ──────────────────────────────────────────────────────────────
-- BENEFITS MODULE: VA CLAIMS
-- ──────────────────────────────────────────────────────────────
create table public.va_claims (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  user_id         uuid        not null references public.profiles(id) on delete cascade,
  condition_name  text        not null,         -- e.g. "Tinnitus", "PTSD", "TBI"
  status          claim_status not null default 'not_started',
  claim_number    text,                          -- VA tracking number
  filed_date      date,
  decision_date   date,
  rating_percent  smallint,                      -- 0–100
  notes           text,
  ai_guidance     jsonb,                         -- stored AI copilot context
  evidence_list   text[]
);

-- ──────────────────────────────────────────────────────────────
-- TRANSITION MODULE: PLANS + MILESTONES
-- ──────────────────────────────────────────────────────────────
create table public.transition_plans (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  user_id         uuid        not null unique references public.profiles(id) on delete cascade,
  ets_date        date,
  started_at      timestamptz default now(),
  completed_at    timestamptz,
  progress_pct    smallint    not null default 0
);

create table public.transition_milestones (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  plan_id         uuid        not null references public.transition_plans(id) on delete cascade,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  title           text        not null,
  description     text,
  category        text        not null,  -- 'benefits' | 'career' | 'housing' | 'education' | 'legal'
  status          milestone_status not null default 'pending',
  due_date        date,
  completed_at    timestamptz,
  sort_order      smallint    not null default 0,
  is_required     boolean     default false,
  resources       jsonb                  -- links, tools, AI guidance
);

-- ──────────────────────────────────────────────────────────────
-- EMPLOYMENT MODULE: RESUMES
-- ──────────────────────────────────────────────────────────────
create table public.resumes (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  user_id         uuid        not null references public.profiles(id) on delete cascade,
  title           text        not null,          -- "Software Engineer Resume v3"
  target_role     text,
  target_company  text,
  content         text        not null,           -- Final resume text
  ai_version      boolean     default true,
  ats_score       smallint,                       -- 0–100
  is_primary      boolean     default false,
  storage_path    text                            -- PDF export path
);

-- ──────────────────────────────────────────────────────────────
-- EMPLOYMENT MODULE: INTERVIEW PREP
-- ──────────────────────────────────────────────────────────────
create table public.interview_sessions (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  user_id         uuid        not null references public.profiles(id) on delete cascade,
  target_role     text        not null,
  target_company  text,
  difficulty      text        not null default 'medium',  -- easy | medium | hard
  completed_at    timestamptz,
  avg_score       numeric(3,1),
  question_count  smallint    default 0
);

create table public.interview_questions (
  id              uuid        primary key default uuid_generate_v4(),
  session_id      uuid        not null references public.interview_sessions(id) on delete cascade,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  question_text   text        not null,
  category        text        not null,  -- behavioral | situational | technical | culture_fit
  difficulty      text        not null default 'medium',
  sort_order      smallint    not null default 0
);

create table public.interview_responses (
  id              uuid        primary key default uuid_generate_v4(),
  created_at      timestamptz not null default now(),

  question_id     uuid        not null references public.interview_questions(id) on delete cascade,
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  response_text   text        not null,
  ai_score        smallint,              -- 1–5
  ai_feedback     text,
  star_analysis   jsonb,                 -- { situation, task, action, result, jargon_flags }
  is_best         boolean     default false
);

-- ──────────────────────────────────────────────────────────────
-- USAGE TRACKING (freemium limits)
-- ──────────────────────────────────────────────────────────────
create table public.usage_tracking (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  month           date        not null,         -- first day of month
  resumes_generated    smallint default 0,
  interview_sessions   smallint default 0,
  ai_requests          int      default 0,
  unique (user_id, month)
);

-- ──────────────────────────────────────────────────────────────
-- INDEXES
-- ──────────────────────────────────────────────────────────────
create index idx_profiles_tier           on public.profiles(tier);
create index idx_profiles_mos            on public.profiles(mos_code);
create index idx_org_members_org         on public.org_members(org_id);
create index idx_org_members_user        on public.org_members(user_id);
create index idx_documents_user          on public.documents(user_id);
create index idx_va_claims_user          on public.va_claims(user_id);
create index idx_va_claims_status        on public.va_claims(status);
create index idx_milestones_plan         on public.transition_milestones(plan_id);
create index idx_milestones_user_status  on public.transition_milestones(user_id, status);
create index idx_resumes_user            on public.resumes(user_id);
create index idx_interview_sessions_user on public.interview_sessions(user_id);
create index idx_usage_user_month        on public.usage_tracking(user_id, month);

-- ──────────────────────────────────────────────────────────────
-- TRIGGERS: updated_at
-- ──────────────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.organizations
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.documents
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.va_claims
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.transition_plans
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.transition_milestones
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.resumes
  for each row execute function public.handle_updated_at();
create trigger set_updated_at before update on public.interview_sessions
  for each row execute function public.handle_updated_at();

-- ──────────────────────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- ──────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
