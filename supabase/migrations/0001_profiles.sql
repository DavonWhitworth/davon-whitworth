-- One row per signed-in person.
-- Supabase keeps the login itself (email, Google identity) in auth.users.
-- This table holds only what this site adds on top of it.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  is_admin boolean not null default false,
  is_blocked boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- No policies on purpose: visitors cannot read or change profiles through the
-- public API, so nobody can make themselves admin or unblock themselves.
-- Only server code using the secret key (which bypasses row level security)
-- can. This needs the grant below because new tables are not exposed by default.
-- Supabase gives new tables some default rights to the public roles; remove them.
revoke all on public.profiles from anon, authenticated;
grant select, insert, update, delete on public.profiles to service_role;

-- Create the profile automatically the first time someone signs in.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create profiles for people who signed in before this trigger existed.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- Run this separately, once, with YOUR Google email, to make yourself admin:
--
-- update public.profiles
-- set is_admin = true
-- where id = (select id from auth.users where email = 'you@example.com');
