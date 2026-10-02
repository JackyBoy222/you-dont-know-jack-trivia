create type inquiry_kind as enum ('booking', 'contact');
create type inquiry_status as enum ('new', 'contacted', 'qualified', 'booked', 'closed', 'spam');

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  kind inquiry_kind not null,
  status inquiry_status not null default 'new',
  name text not null,
  email text not null,
  organization text,
  subject text,
  message text not null,
  event_type text check (event_type in ('weekly', 'private', 'corporate', 'fundraiser', 'special')),
  event_date_text text,
  guest_count int check (guest_count > 0),
  venue text,
  source text not null default 'website',
  internal_notes text,
  contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_status_created_at_idx on inquiries(status, created_at desc);
create index inquiries_email_idx on inquiries(email);

alter table inquiries enable row level security;

-- No public table policies: website submissions go through the validated
-- server route using the service role. Admin read access is added with auth.
