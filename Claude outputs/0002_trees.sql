-- 0002_trees.sql
-- Tree readings (private, written by the server only) and calculated trees
-- (public, written only by recalc_tree, which runs automatically).

-------------------------------------------------------------------------------
-- 1. Calculated trees: what the map reads. Public, read-only.
-------------------------------------------------------------------------------
create table public.trees (
  tree_number   smallint primary key check (tree_number between 1 and 9999),
  lat           double precision not null,
  lng           double precision not null,
  species_id    text,                                   -- null = nobody named a species
  species_votes integer not null default 0,             -- votes for the winning species
  reading_count integer not null check (reading_count > 0),
  updated_at    timestamptz not null default now()
);
create index trees_species_id_idx on public.trees (species_id);

alter table public.trees enable row level security;
create policy "Trees are public" on public.trees
  for select to anon, authenticated using (true);

revoke all on public.trees from anon, authenticated, service_role;
grant select on public.trees to anon, authenticated, service_role;
-- Nobody but recalc_tree (security definer) writes this table, the server included.

-------------------------------------------------------------------------------
-- 2. Readings: one per user per tree number. Private, server-written.
-------------------------------------------------------------------------------
create table public.tree_readings (
  tree_number    smallint not null check (tree_number between 1 and 9999),
  user_id        uuid not null references auth.users (id) on delete cascade,
  -- Coarse box around campus as a backstop; the real campus polygon check
  -- happens in the server until the polygon is approved.
  lat            double precision not null check (lat between 38.545 and 38.575),
  lng            double precision not null check (lng between -121.440 and -121.410),
  accuracy_m     real not null check (accuracy_m > 0 and accuracy_m <= 25),
  species_id     text check (species_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(species_id) <= 80),
  species_set_at timestamptz not null default now(),    -- age of this species vote (tie-breaks)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  primary key (tree_number, user_id)                    -- also enforces one reading per user per tree
);
create index tree_readings_user_id_idx on public.tree_readings (user_id);  -- ban cleanup

alter table public.tree_readings enable row level security;  -- no policies: service_role only
revoke all on public.tree_readings from anon, authenticated;
grant select, insert, update, delete on public.tree_readings to service_role;

-------------------------------------------------------------------------------
-- 3. Guard updates: number and user are immutable; timestamps are server-owned.
-------------------------------------------------------------------------------
create function public.tree_readings_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_at     := now();
    new.updated_at     := now();
    new.species_set_at := now();
    return new;
  end if;

  if new.tree_number <> old.tree_number or new.user_id <> old.user_id then
    raise exception 'tree_number and user_id cannot change; delete and re-add instead';
  end if;

  new.created_at := old.created_at;
  new.updated_at := now();
  -- A vote only gets younger when the species actually changes.
  if new.species_id is distinct from old.species_id then
    new.species_set_at := now();
  else
    new.species_set_at := old.species_set_at;
  end if;
  return new;
end
$$;

create trigger tree_readings_before_write
  before insert or update on public.tree_readings
  for each row execute function public.tree_readings_before_write();

-------------------------------------------------------------------------------
-- 4. Recalculate one tree from its readings.
--    Location: median lat and median lng. With 3+ readings, drop readings more
--    than 30 m from that first median and take the median again.
--    Species: most votes; ties go to the oldest vote. Uses all readings,
--    including location outliers.
-------------------------------------------------------------------------------
create function public.recalc_tree(p_tree_number smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_outlier_m constant double precision := 30;
  v_count   integer;
  v_mlat    double precision;
  v_mlng    double precision;
  v_lat     double precision;
  v_lng     double precision;
  v_species text;
  v_votes   integer;
begin
  -- Serialize recalcs of the same tree so concurrent writes can't leave it stale.
  perform pg_advisory_xact_lock(7311, p_tree_number);

  select count(*),
         percentile_cont(0.5) within group (order by lat),
         percentile_cont(0.5) within group (order by lng)
    into v_count, v_mlat, v_mlng
    from public.tree_readings
   where tree_number = p_tree_number;

  if v_count = 0 then
    delete from public.trees where tree_number = p_tree_number;
    return;
  end if;

  v_lat := v_mlat;
  v_lng := v_mlng;

  if v_count >= 3 then
    -- Flat-earth distance in metres; error is well under 1% at campus scale.
    select percentile_cont(0.5) within group (order by lat),
           percentile_cont(0.5) within group (order by lng)
      into v_lat, v_lng
      from public.tree_readings
     where tree_number = p_tree_number
       and sqrt(  power((lat - v_mlat) * 111320, 2)
                + power((lng - v_mlng) * 111320 * cos(radians(v_mlat)), 2)) <= c_outlier_m;

    if v_lat is null then   -- every reading was an "outlier": keep the plain median
      v_lat := v_mlat;
      v_lng := v_mlng;
    end if;
  end if;

  select species_id, count(*)
    into v_species, v_votes
    from public.tree_readings
   where tree_number = p_tree_number
     and species_id is not null
   group by species_id
   order by count(*) desc, min(species_set_at) asc, species_id asc
   limit 1;

  insert into public.trees
         (tree_number, lat, lng, species_id, species_votes, reading_count, updated_at)
  values (p_tree_number, v_lat, v_lng, v_species, coalesce(v_votes, 0), v_count, now())
  on conflict (tree_number) do update
     set lat           = excluded.lat,
         lng           = excluded.lng,
         species_id    = excluded.species_id,
         species_votes = excluded.species_votes,
         reading_count = excluded.reading_count,
         updated_at    = now();
end
$$;

-- Recalculate everything (e.g. after changing the outlier distance).
create function public.recalc_all_trees()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  n smallint;
begin
  for n in
    select tree_number from public.tree_readings
    union
    select tree_number from public.trees
  loop
    perform public.recalc_tree(n);
  end loop;
end
$$;

revoke execute on function public.recalc_tree(smallint) from public, anon, authenticated;
revoke execute on function public.recalc_all_trees()     from public, anon, authenticated;
grant  execute on function public.recalc_tree(smallint) to service_role;
grant  execute on function public.recalc_all_trees()     to service_role;

-------------------------------------------------------------------------------
-- 5. Recalculate automatically on every reading change. Covers add, re-submit,
--    delete, and ban cleanup (delete from tree_readings where user_id = ...),
--    plus auth-user deletion via the cascade.
-------------------------------------------------------------------------------
create function public.tree_readings_after_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform public.recalc_tree(coalesce(new.tree_number, old.tree_number));
  return null;
end
$$;

create trigger tree_readings_after_change
  after insert or update or delete on public.tree_readings
  for each row execute function public.tree_readings_after_change();

-- Run this separately, once, to add the seed tree under your admin account.
-- Delete it before launch (delete from public.tree_readings where tree_number = 9999).
--
-- insert into public.tree_readings (tree_number, user_id, lat, lng, accuracy_m, species_id)
-- select 9999, id, 38.563753, -121.425666, 5, 'pinus-pinea'
-- from public.profiles where is_admin limit 1;
