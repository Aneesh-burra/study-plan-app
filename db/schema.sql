-- StudyLane auth tables. Safe to run more than once.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  token_hash text primary key,
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists sessions_user_id_idx on sessions (user_id);

alter table users add column if not exists is_demo boolean not null default false;
alter table users add column if not exists stripe_customer_id text unique;

create table if not exists study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  content jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists study_plans_user_created_idx on study_plans (user_id, created_at desc);

create table if not exists study_generation_usage (
  user_id uuid not null references users(id) on delete cascade,
  usage_date date not null,
  attempts integer not null,
  primary key (user_id, usage_date)
);

alter table study_plans add column if not exists workspace text not null default '';
alter table study_plans add column if not exists completed_tasks jsonb not null default '{}'::jsonb;
alter table study_plans add column if not exists missed_questions jsonb not null default '{}'::jsonb;
alter table study_plans add column if not exists is_sample boolean not null default false;

create unique index if not exists study_plans_sample_workspace_idx
  on study_plans (user_id, workspace) where is_sample;

create index if not exists study_plans_workspace_created_idx
  on study_plans (user_id, workspace, created_at desc);
