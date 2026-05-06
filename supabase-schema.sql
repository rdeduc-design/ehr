-- HCT EHR Simulation Supabase schema
-- Run this in the Supabase SQL editor for the project used by supabase-config.js.
-- This stores simulation charting only. Do not store real patient PHI here unless your institution has approved the environment.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  student_id text,
  section text,
  role text not null default 'student' check (role in ('student', 'instructor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chart_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  local_patient_id text not null,
  scenario_id text,
  scenario_name text,
  patient_name text,
  patient_mrn text,
  student_name text,
  student_id text,
  section text,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  chart jsonb not null default '{}'::jsonb,
  review_score numeric,
  review_comment text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, local_patient_id)
);

create index if not exists chart_attempts_user_idx on public.chart_attempts(user_id);
create index if not exists chart_attempts_section_idx on public.chart_attempts(section);
create index if not exists chart_attempts_updated_idx on public.chart_attempts(updated_at desc);
create index if not exists chart_attempts_status_idx on public.chart_attempts(status);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists chart_attempts_touch_updated_at on public.chart_attempts;
create trigger chart_attempts_touch_updated_at
before update on public.chart_attempts
for each row execute function public.touch_updated_at();

create or replace function public.is_instructor()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'instructor'
  );
$$;

alter table public.profiles enable row level security;
alter table public.chart_attempts enable row level security;

drop policy if exists "Profiles are visible to owner or instructor" on public.profiles;
create policy "Profiles are visible to owner or instructor"
on public.profiles for select
using (id = auth.uid() or public.is_instructor());

drop policy if exists "Students create own profile" on public.profiles;
create policy "Students create own profile"
on public.profiles for insert
with check (id = auth.uid() and role = 'student');

drop policy if exists "Students update own student profile" on public.profiles;
create policy "Students update own student profile"
on public.profiles for update
using (id = auth.uid() and not public.is_instructor())
with check (id = auth.uid() and role = 'student');

drop policy if exists "Instructors update profiles" on public.profiles;
create policy "Instructors update profiles"
on public.profiles for update
using (public.is_instructor())
with check (public.is_instructor());

drop policy if exists "Users update own profile" on public.profiles;

drop policy if exists "Attempts visible to owner or instructor" on public.chart_attempts;
create policy "Attempts visible to owner or instructor"
on public.chart_attempts for select
using (user_id = auth.uid() or public.is_instructor());

drop policy if exists "Students create own attempts" on public.chart_attempts;
create policy "Students create own attempts"
on public.chart_attempts for insert
with check (user_id = auth.uid());

drop policy if exists "Students update own attempts and instructors review" on public.chart_attempts;
create policy "Students update own attempts and instructors review"
on public.chart_attempts for update
using (user_id = auth.uid() or public.is_instructor())
with check (user_id = auth.uid() or public.is_instructor());

-- After an instructor creates/logs into an account, promote them with the Supabase SQL editor:
-- update public.profiles set role = 'instructor' where email = 'instructor@example.edu';
