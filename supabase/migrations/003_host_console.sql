create table venues (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address text not null,
  city text not null default 'New Orleans, Louisiana',
  description text,
  booking_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table events add column venue_id uuid references venues;
alter table events add column show_type text not null default 'weekly'
  check (show_type in ('weekly', 'private', 'corporate', 'fundraiser', 'special'));
alter table events add column winner_team_id uuid references teams;

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references admin_users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

alter table venues enable row level security;
alter table inquiries enable row level security;
alter table admin_audit_log enable row level security;
alter table admin_users enable row level security;

create policy "admins read own membership" on admin_users for select
using (id = auth.uid());

create policy "public active venues" on venues for select using (active = true);

create policy "admins manage venues" on venues for all
using (exists (select 1 from admin_users where id = auth.uid()))
with check (exists (select 1 from admin_users where id = auth.uid()));

create policy "admins manage inquiries" on inquiries for all
using (exists (select 1 from admin_users where id = auth.uid()))
with check (exists (select 1 from admin_users where id = auth.uid()));

create policy "admins read audit log" on admin_audit_log for select
using (exists (select 1 from admin_users where id = auth.uid()));

create policy "admins manage events" on events for all
using (exists (select 1 from admin_users where id = auth.uid()))
with check (exists (select 1 from admin_users where id = auth.uid()));

create policy "admins manage teams" on teams for all
using (exists (select 1 from admin_users where id = auth.uid()))
with check (exists (select 1 from admin_users where id = auth.uid()));

-- API access is denied by default for objects created through migrations.
-- Server routes use the secret key; authenticated users only need to verify
-- their own membership before the server API accepts host-console requests.
grant usage on schema public to service_role, authenticated;
grant all privileges on all tables in schema public to service_role;
grant select on admin_users to authenticated;

alter default privileges in schema public
grant all privileges on tables to service_role;
