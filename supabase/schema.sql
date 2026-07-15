create extension if not exists "pgcrypto";

create type app_role as enum ('admin', 'cm');
create type post_status as enum ('draft', 'scheduled', 'publishing', 'published', 'failed');
create type social_network as enum ('Instagram', 'LinkedIn', 'TikTok', 'Facebook', 'X', 'YouTube', 'Pinterest', 'WhatsApp Business', 'Threads', 'Bluesky');

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role app_role not null default 'cm',
  created_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  language text default 'Espanol',
  owner_profile_id uuid references profiles(id) on delete set null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists client_members (
  client_id uuid references clients(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  role app_role not null default 'cm',
  created_at timestamptz not null default now(),
  primary key (client_id, profile_id)
);

create table if not exists social_accounts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  network social_network not null,
  handle text not null,
  external_account_id text,
  access_token text,
  token_expires_at timestamptz,
  audience integer default 0,
  engagement numeric default 0,
  reach integer default 0,
  posts_count integer default 0,
  clicks integer default 0,
  saves integer default 0,
  response_rate integer default 0,
  growth numeric default 0,
  created_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  uploaded_by_profile_id uuid references profiles(id) on delete set null,
  file_name text not null,
  content_type text,
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete cascade,
  social_account_id uuid references social_accounts(id) on delete cascade,
  created_by_profile_id uuid references profiles(id) on delete set null,
  scheduled_at timestamptz not null,
  caption text not null,
  format text default 'Post',
  goal text default 'Engagement',
  status post_status not null default 'scheduled',
  media_asset_id uuid references media_assets(id) on delete set null,
  media_url text,
  external_post_id text,
  error_message text,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists scheduled_posts_due_idx
  on scheduled_posts (scheduled_at)
  where status = 'scheduled';

alter table profiles enable row level security;
alter table clients enable row level security;
alter table client_members enable row level security;
alter table social_accounts enable row level security;
alter table media_assets enable row level security;
alter table scheduled_posts enable row level security;

-- The Vercel API uses SUPABASE_SERVICE_ROLE_KEY and bypasses RLS.
-- Public client access should be added only after Supabase Auth is fully wired.
