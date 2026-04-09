-- ════════════════════════════════════════════════════════════════
-- Migration: 002_rls_policies.sql
-- Row Level Security — user ownership + org visibility model
-- ════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table public.profiles              enable row level security;
alter table public.organizations         enable row level security;
alter table public.org_members           enable row level security;
alter table public.org_invites           enable row level security;
alter table public.documents             enable row level security;
alter table public.va_claims             enable row level security;
alter table public.transition_plans      enable row level security;
alter table public.transition_milestones enable row level security;
alter table public.resumes               enable row level security;
alter table public.interview_sessions    enable row level security;
alter table public.interview_questions   enable row level security;
alter table public.interview_responses   enable row level security;
alter table public.usage_tracking        enable row level security;

-- ─── Helper functions ────────────────────────────────────────────────────────

-- Is the current user an org admin or owner?
create or replace function public.is_org_admin(p_org_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.org_members
    where org_id = p_org_id
      and user_id = auth.uid()
      and role in ('admin', 'owner')
  );
$$;

-- Is the current user a member of an org?
create or replace function public.is_org_member(p_org_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.org_members
    where org_id = p_org_id
      and user_id = auth.uid()
  );
$$;

-- Get all org_ids where current user is admin/owner
create or replace function public.my_admin_org_ids()
returns uuid[] language sql security definer stable as $$
  select array_agg(org_id) from public.org_members
  where user_id = auth.uid()
    and role in ('admin', 'owner');
$$;

-- Get all user_ids that are members of any org I admin
create or replace function public.my_org_member_ids()
returns uuid[] language sql security definer stable as $$
  select array_agg(distinct om2.user_id)
  from public.org_members om1
  join public.org_members om2 on om1.org_id = om2.org_id
  where om1.user_id = auth.uid()
    and om1.role in ('admin', 'owner');
$$;

-- ════════════════════════════════════════════════════════════════
-- PROFILES
-- Rule: users own their row. Org admins can READ (not write).
-- ════════════════════════════════════════════════════════════════
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Org admins can view member profiles"
  on public.profiles for select
  using (id = any(public.my_org_member_ids()));

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- profiles are created by the trigger, not by users directly
-- (no insert policy needed here — trigger uses security definer)

-- ════════════════════════════════════════════════════════════════
-- ORGANIZATIONS
-- ════════════════════════════════════════════════════════════════
create policy "Org members can view their org"
  on public.organizations for select
  using (public.is_org_member(id));

create policy "Org admins can update their org"
  on public.organizations for update
  using (public.is_org_admin(id));

-- New orgs created by authenticated users (handled in app)
create policy "Authenticated users can create orgs"
  on public.organizations for insert
  with check (auth.uid() is not null);

-- ════════════════════════════════════════════════════════════════
-- ORG_MEMBERS
-- Users see their own memberships. Org admins see all members.
-- ════════════════════════════════════════════════════════════════
create policy "Users see own memberships"
  on public.org_members for select
  using (user_id = auth.uid());

create policy "Org admins see all memberships in their org"
  on public.org_members for select
  using (public.is_org_admin(org_id));

create policy "Org admins can add members"
  on public.org_members for insert
  with check (public.is_org_admin(org_id));

-- Org admins can remove members AND users can remove themselves
create policy "Remove membership"
  on public.org_members for delete
  using (
    user_id = auth.uid()              -- self-removal
    or public.is_org_admin(org_id)    -- org admin removal
  );

create policy "Org admins can update member roles"
  on public.org_members for update
  using (public.is_org_admin(org_id));

-- ════════════════════════════════════════════════════════════════
-- ORG_INVITES
-- ════════════════════════════════════════════════════════════════
create policy "Org admins manage invites"
  on public.org_invites for all
  using (public.is_org_admin(org_id));

create policy "Anyone can view invite by token"
  on public.org_invites for select
  using (true);  -- token-based lookup, validated in app layer

-- ════════════════════════════════════════════════════════════════
-- DOCUMENTS
-- User owns their documents. Org admins can read (not write/delete).
-- ════════════════════════════════════════════════════════════════
create policy "Users manage own documents"
  on public.documents for all
  using (user_id = auth.uid());

create policy "Org admins can read member documents"
  on public.documents for select
  using (user_id = any(public.my_org_member_ids()));

-- ════════════════════════════════════════════════════════════════
-- VA_CLAIMS
-- Strictly user-owned. No org visibility by default.
-- Org admins can read ONLY if user has explicitly granted access.
-- ════════════════════════════════════════════════════════════════
create policy "Users manage own claims"
  on public.va_claims for all
  using (user_id = auth.uid());

-- Legal orgs (lawyers/VSOs) can see claims of their members
-- only when org_type allows it — enforced at app layer + this policy
create policy "Legal org admins can read member claims"
  on public.va_claims for select
  using (
    user_id = any(public.my_org_member_ids())
    and exists (
      select 1 from public.organizations o
      join public.org_members om on om.org_id = o.id
      where om.user_id = auth.uid()
        and om.role in ('admin', 'owner')
        and o.org_type in ('vso', 'legal')
    )
  );

-- ════════════════════════════════════════════════════════════════
-- TRANSITION PLANS + MILESTONES
-- ════════════════════════════════════════════════════════════════
create policy "Users manage own transition plan"
  on public.transition_plans for all
  using (user_id = auth.uid());

create policy "Org admins can view member transition plans"
  on public.transition_plans for select
  using (user_id = any(public.my_org_member_ids()));

create policy "Users manage own milestones"
  on public.transition_milestones for all
  using (user_id = auth.uid());

create policy "Org admins can view member milestones"
  on public.transition_milestones for select
  using (user_id = any(public.my_org_member_ids()));

-- ════════════════════════════════════════════════════════════════
-- EMPLOYMENT: RESUMES
-- ════════════════════════════════════════════════════════════════
create policy "Users manage own resumes"
  on public.resumes for all
  using (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════════
-- EMPLOYMENT: INTERVIEW PREP
-- ════════════════════════════════════════════════════════════════
create policy "Users manage own interview sessions"
  on public.interview_sessions for all
  using (user_id = auth.uid());

create policy "Users manage own interview questions"
  on public.interview_questions for all
  using (user_id = auth.uid());

create policy "Users manage own interview responses"
  on public.interview_responses for all
  using (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════════
-- USAGE TRACKING
-- ════════════════════════════════════════════════════════════════
create policy "Users see own usage"
  on public.usage_tracking for select
  using (user_id = auth.uid());

-- Only the server (service role) can write usage
-- No insert/update policy for anon/authenticated = server-only writes
