-- supabase/migrations/0001_init.sql
-- AppleApe Studios — initial schema, RLS, helper functions, and indexes.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Helper functions
-- ============================================================================

-- Returns true when the current JWT carries an admin role claim.
-- DESIGN: Future CMS surfaces should authenticate as Supabase Auth users
-- with `app_metadata.role = 'admin'` set via the service role.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Generic updated_at trigger function.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Rate limiting (Postgres-backed sliding-window buckets)
-- ============================================================================

create table if not exists public.rate_limit_buckets (
  ip_hash      text         not null,
  action       text         not null,
  window_start timestamptz  not null,
  count        int          not null default 0,
  primary key (ip_hash, action, window_start)
);

alter table public.rate_limit_buckets enable row level security;
-- Buckets are only ever touched by the SECURITY DEFINER function below.
-- No anon/authenticated policies are granted; access is via the function only.

-- Returns true if the request is within the allowed rate, false if rate-limited.
-- Caller (server action) is responsible for passing a stable ip_hash.
create or replace function public.check_rate_limit(
  p_ip_hash text,
  p_action text,
  p_max_count int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_count int;
begin
  -- Bucket key is the floored window boundary, so concurrent requests collide
  -- onto the same row and an UPSERT counter resolves cleanly.
  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.rate_limit_buckets as b (ip_hash, action, window_start, count)
    values (p_ip_hash, p_action, v_window_start, 1)
  on conflict (ip_hash, action, window_start)
    do update set count = b.count + 1
  returning count into v_count;

  -- Opportunistic cleanup of buckets older than 24h. Cheap because of the PK.
  delete from public.rate_limit_buckets
   where window_start < now() - interval '24 hours';

  return v_count <= p_max_count;
end;
$$;

revoke all on function public.check_rate_limit(text, text, int, int) from public;
grant execute on function public.check_rate_limit(text, text, int, int) to service_role;

-- ============================================================================
-- Content tables
-- ============================================================================

create table if not exists public.games (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  tagline           text,
  description       text,
  genre             text,
  platforms         text[] not null default '{}',
  status            text not null default 'live' check (status in ('live','coming_soon','archived')),
  hero_image_url    text,
  trailer_url       text,
  screenshots       jsonb not null default '[]'::jsonb,
  play_store_url    text,
  app_store_url     text,
  release_date      date,
  downloads_count   bigint not null default 0,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists games_published_idx on public.games (published, release_date desc);
create index if not exists games_status_idx    on public.games (status);
create trigger games_updated_at before update on public.games
  for each row execute function public.set_updated_at();

create table if not exists public.web3_projects (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  title               text not null,
  description         text,
  chains              text[] not null default '{}',
  live_url            text,
  contract_addresses  jsonb not null default '{}'::jsonb,
  audit_url           text,
  supported_wallets   text[] not null default '{}',
  status              text not null default 'live' check (status in ('live','testnet','coming_soon','archived')),
  hero_image_url      text,
  published           boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists web3_projects_published_idx on public.web3_projects (published, created_at desc);
create trigger web3_projects_updated_at before update on public.web3_projects
  for each row execute function public.set_updated_at();

create table if not exists public.apps (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  tagline           text,
  description       text,
  category          text,
  platforms         text[] not null default '{}',
  status            text not null default 'live' check (status in ('live','coming_soon','archived')),
  hero_image_url    text,
  screenshots       jsonb not null default '[]'::jsonb,
  play_store_url    text,
  app_store_url     text,
  release_date      date,
  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists apps_published_idx on public.apps (published, release_date desc);
create trigger apps_updated_at before update on public.apps
  for each row execute function public.set_updated_at();

create table if not exists public.team_members (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  role          text not null,
  bio           text,
  photo_url     text,
  socials       jsonb not null default '{}'::jsonb,
  display_order int  not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists team_members_active_order_idx on public.team_members (active, display_order);

create table if not exists public.job_openings (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  department      text,
  location        text,
  employment_type text check (employment_type in ('full_time','part_time','contract','internship')),
  description     text,
  requirements    text,
  perks           text,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);
create index if not exists job_openings_active_idx on public.job_openings (active, created_at desc);

create table if not exists public.job_applications (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid not null references public.job_openings(id) on delete cascade,
  name          text not null,
  email         text not null,
  resume_url    text,
  cover_letter  text,
  created_at    timestamptz not null default now()
);
create index if not exists job_applications_job_idx on public.job_applications (job_id, created_at desc);

create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  excerpt         text,
  content_mdx     text not null,
  cover_image_url text,
  author_id       uuid references public.team_members(id) on delete set null,
  tags            text[] not null default '{}',
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists posts_published_at_idx on public.posts (published, published_at desc);
create index if not exists posts_tags_gin         on public.posts using gin (tags);
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique,
  confirmed     boolean not null default false,
  confirm_token uuid not null default gen_random_uuid(),
  created_at    timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index if not exists contact_submissions_created_idx on public.contact_submissions (created_at desc);

create table if not exists public.studio_stats (
  id            uuid primary key default gen_random_uuid(),
  key           text unique not null,
  label         text not null,
  value         text not null,
  display_order int not null default 0
);
create index if not exists studio_stats_order_idx on public.studio_stats (display_order);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.games                  enable row level security;
alter table public.web3_projects          enable row level security;
alter table public.apps                   enable row level security;
alter table public.team_members           enable row level security;
alter table public.job_openings           enable row level security;
alter table public.job_applications       enable row level security;
alter table public.posts                  enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.studio_stats           enable row level security;

-- Public read of published rows
create policy "games_public_select" on public.games
  for select using (published = true);
create policy "web3_projects_public_select" on public.web3_projects
  for select using (published = true);
create policy "apps_public_select" on public.apps
  for select using (published = true);
create policy "posts_public_select" on public.posts
  for select using (published = true);
create policy "team_members_public_select" on public.team_members
  for select using (active = true);
create policy "job_openings_public_select" on public.job_openings
  for select using (active = true);
create policy "studio_stats_public_select" on public.studio_stats
  for select using (true);

-- Anon inserts allowed for newsletter / contact / job applications.
-- Rate limiting is enforced in the server action *before* the insert.
create policy "newsletter_anon_insert" on public.newsletter_subscribers
  for insert to anon with check (true);
create policy "contact_anon_insert" on public.contact_submissions
  for insert to anon with check (true);
create policy "applications_anon_insert" on public.job_applications
  for insert to anon with check (true);

-- Admin-only mutations on every content table.
create policy "games_admin_all"          on public.games          for all using (public.is_admin()) with check (public.is_admin());
create policy "web3_projects_admin_all"  on public.web3_projects  for all using (public.is_admin()) with check (public.is_admin());
create policy "apps_admin_all"           on public.apps           for all using (public.is_admin()) with check (public.is_admin());
create policy "team_members_admin_all"   on public.team_members   for all using (public.is_admin()) with check (public.is_admin());
create policy "job_openings_admin_all"   on public.job_openings   for all using (public.is_admin()) with check (public.is_admin());
create policy "posts_admin_all"          on public.posts          for all using (public.is_admin()) with check (public.is_admin());
create policy "studio_stats_admin_all"   on public.studio_stats   for all using (public.is_admin()) with check (public.is_admin());
create policy "applications_admin_read"  on public.job_applications     for select using (public.is_admin());
create policy "newsletter_admin_read"    on public.newsletter_subscribers for select using (public.is_admin());
create policy "contact_admin_read"       on public.contact_submissions    for select using (public.is_admin());
