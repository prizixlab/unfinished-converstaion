create extension if not exists "pgcrypto";

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  stripe_session_id text unique not null,
  status text not null default 'pending' check (status in ('pending', 'ready', 'failed')),
  delay_minutes int default 180,
  token text unique not null,
  language text,
  person_role text,
  unfinished_summary text,
  unsaid_message text,
  relationship_tone text,
  desired_outcome text,
  response_text text,
  ready_at timestamptz,
  error text
);

create index if not exists requests_status_created_at_idx on public.requests (status, created_at);
