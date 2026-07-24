-- Unified CRM for contacts, organizations, opportunities, and customer activity.
-- All CRM records are private to authenticated administrators.

begin;

create table if not exists public.crm_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  website text,
  phone text,
  industry text,
  country text,
  city text,
  address text,
  status text not null default 'prospect'
    check (status in ('prospect', 'customer', 'partner', 'inactive')),
  size text
    check (size is null or size in ('solo', 'small', 'medium', 'large', 'enterprise')),
  owner_id uuid references auth.users(id) on delete set null,
  notes text,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists crm_companies_name_unique
  on public.crm_companies (lower(name))
  where trim(name) <> '';

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.crm_companies(id) on delete set null,
  first_name text not null check (char_length(trim(first_name)) > 0),
  last_name text not null default '',
  email text,
  phone text,
  job_title text,
  lifecycle_stage text not null default 'lead'
    check (lifecycle_stage in ('lead', 'prospect', 'opportunity', 'customer', 'partner', 'inactive')),
  lead_status text not null default 'new'
    check (lead_status in ('new', 'attempted', 'contacted', 'qualified', 'nurturing', 'unqualified')),
  source text not null default 'manual'
    check (source in ('manual', 'website', 'quote', 'order', 'distributor', 'import', 'referral')),
  lead_score integer not null default 0 check (lead_score between 0 and 100),
  tags text[] not null default '{}',
  marketing_opt_in boolean not null default false,
  owner_id uuid references auth.users(id) on delete set null,
  notes text,
  last_contacted_at timestamptz,
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists crm_contacts_email_unique
  on public.crm_contacts (lower(email))
  where email is not null and trim(email) <> '';
create index if not exists crm_contacts_company_idx on public.crm_contacts(company_id);
create index if not exists crm_contacts_lifecycle_idx on public.crm_contacts(lifecycle_stage);
create index if not exists crm_contacts_lead_status_idx on public.crm_contacts(lead_status);
create index if not exists crm_contacts_follow_up_idx
  on public.crm_contacts(next_follow_up_at)
  where next_follow_up_at is not null;

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete set null,
  company_id uuid references public.crm_companies(id) on delete set null,
  title text not null check (char_length(trim(title)) > 0),
  stage text not null default 'lead'
    check (stage in ('lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  amount numeric(14, 2) not null default 0 check (amount >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  probability integer not null default 10 check (probability between 0 and 100),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high')),
  expected_close_date date,
  closed_at timestamptz,
  loss_reason text,
  source text not null default 'manual'
    check (source in ('manual', 'website', 'quote', 'order', 'distributor', 'import', 'referral')),
  source_record_id uuid,
  owner_id uuid references auth.users(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists crm_deals_source_record_unique
  on public.crm_deals(source, source_record_id)
  where source_record_id is not null;
create index if not exists crm_deals_contact_idx on public.crm_deals(contact_id);
create index if not exists crm_deals_company_idx on public.crm_deals(company_id);
create index if not exists crm_deals_stage_idx on public.crm_deals(stage);
create index if not exists crm_deals_expected_close_idx
  on public.crm_deals(expected_close_date)
  where stage not in ('won', 'lost');

create table if not exists public.crm_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.crm_contacts(id) on delete cascade,
  company_id uuid references public.crm_companies(id) on delete cascade,
  deal_id uuid references public.crm_deals(id) on delete cascade,
  type text not null default 'note'
    check (type in ('note', 'email', 'call', 'meeting', 'task', 'status_change')),
  status text not null default 'open'
    check (status in ('open', 'completed', 'cancelled')),
  subject text not null check (char_length(trim(subject)) > 0),
  body text,
  outcome text,
  due_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists crm_activities_contact_idx on public.crm_activities(contact_id);
create index if not exists crm_activities_company_idx on public.crm_activities(company_id);
create index if not exists crm_activities_deal_idx on public.crm_activities(deal_id);
create index if not exists crm_activities_created_idx on public.crm_activities(created_at desc);
create index if not exists crm_activities_open_due_idx
  on public.crm_activities(due_at)
  where status = 'open' and due_at is not null;

create table if not exists public.crm_contact_sources (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  source_type text not null
    check (source_type in ('order', 'quote', 'distributor', 'contact_message')),
  source_id uuid not null,
  created_at timestamptz not null default now(),
  unique (source_type, source_id)
);

create index if not exists crm_contact_sources_contact_idx
  on public.crm_contact_sources(contact_id);

create or replace function public.crm_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists crm_companies_set_updated_at on public.crm_companies;
create trigger crm_companies_set_updated_at
before update on public.crm_companies
for each row execute function public.crm_set_updated_at();

drop trigger if exists crm_contacts_set_updated_at on public.crm_contacts;
create trigger crm_contacts_set_updated_at
before update on public.crm_contacts
for each row execute function public.crm_set_updated_at();

drop trigger if exists crm_deals_set_updated_at on public.crm_deals;
create trigger crm_deals_set_updated_at
before update on public.crm_deals
for each row execute function public.crm_set_updated_at();

drop trigger if exists crm_activities_set_updated_at on public.crm_activities;
create trigger crm_activities_set_updated_at
before update on public.crm_activities
for each row execute function public.crm_set_updated_at();

-- Seed organizations found in existing quote and distributor records.
insert into public.crm_companies (name, country, status, last_activity_at)
select distinct on (lower(trim(company_name)))
  trim(company_name),
  nullif(trim(country), ''),
  case when origin = 'distributor' then 'partner' else 'prospect' end,
  created_at
from (
  select company_name, null::text as country, 'quote'::text as origin, created_at
  from public.quote_requests
  where nullif(trim(company_name), '') is not null
  union all
  select company_name, country, 'distributor'::text as origin, created_at
  from public.distributor_applications
  where nullif(trim(company_name), '') is not null
) source_companies
order by lower(trim(company_name)), created_at desc
on conflict (lower(name)) where trim(name) <> ''
do update set
  country = coalesce(public.crm_companies.country, excluded.country),
  last_activity_at = greatest(public.crm_companies.last_activity_at, excluded.last_activity_at);

-- Existing commercial records become unified CRM contacts.
insert into public.crm_contacts (
  first_name, last_name, email, phone, lifecycle_stage, lead_status,
  source, lead_score, last_contacted_at, created_at
)
select distinct on (lower(trim(email)))
  trim(first_name),
  coalesce(trim(last_name), ''),
  lower(trim(email)),
  nullif(trim(phone), ''),
  'customer',
  'qualified',
  'order',
  80,
  created_at,
  created_at
from public.orders
where nullif(trim(email), '') is not null
order by lower(trim(email)), created_at desc
on conflict (lower(email)) where email is not null and trim(email) <> ''
do update set
  phone = coalesce(public.crm_contacts.phone, excluded.phone),
  lifecycle_stage = 'customer',
  lead_status = 'qualified',
  lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score),
  last_contacted_at = greatest(public.crm_contacts.last_contacted_at, excluded.last_contacted_at);

insert into public.crm_contacts (
  company_id, first_name, last_name, email, phone, lifecycle_stage,
  lead_status, source, lead_score, next_follow_up_at, created_at
)
select distinct on (lower(trim(q.email)))
  c.id,
  trim(q.first_name),
  coalesce(trim(q.last_name), ''),
  lower(trim(q.email)),
  nullif(trim(q.phone), ''),
  'opportunity',
  case when q.status = 'quoted' then 'qualified' else 'new' end,
  'quote',
  case when q.status = 'quoted' then 65 else 45 end,
  q.created_at + interval '2 days',
  q.created_at
from public.quote_requests q
left join public.crm_companies c on lower(c.name) = lower(trim(q.company_name))
where nullif(trim(q.email), '') is not null
order by lower(trim(q.email)), q.created_at desc
on conflict (lower(email)) where email is not null and trim(email) <> ''
do update set
  company_id = coalesce(public.crm_contacts.company_id, excluded.company_id),
  phone = coalesce(public.crm_contacts.phone, excluded.phone),
  lifecycle_stage = case
    when public.crm_contacts.lifecycle_stage = 'customer' then 'customer'
    else 'opportunity'
  end,
  lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score),
  next_follow_up_at = coalesce(public.crm_contacts.next_follow_up_at, excluded.next_follow_up_at);

insert into public.crm_contacts (
  company_id, first_name, last_name, email, phone, lifecycle_stage,
  lead_status, source, lead_score, created_at
)
select distinct on (lower(trim(d.email)))
  c.id,
  trim(d.contact_name),
  '',
  lower(trim(d.email)),
  nullif(trim(d.phone), ''),
  'partner',
  case when d.status = 'approved' then 'qualified' else 'new' end,
  'distributor',
  case when d.status = 'approved' then 75 else 40 end,
  d.created_at
from public.distributor_applications d
left join public.crm_companies c on lower(c.name) = lower(trim(d.company_name))
where nullif(trim(d.email), '') is not null
order by lower(trim(d.email)), d.created_at desc
on conflict (lower(email)) where email is not null and trim(email) <> ''
do update set
  company_id = coalesce(public.crm_contacts.company_id, excluded.company_id),
  phone = coalesce(public.crm_contacts.phone, excluded.phone),
  lifecycle_stage = case
    when public.crm_contacts.lifecycle_stage = 'customer' then 'customer'
    else 'partner'
  end,
  lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score);

insert into public.crm_contacts (
  first_name, last_name, email, lifecycle_stage, lead_status,
  source, lead_score, created_at
)
select distinct on (lower(trim(email)))
  split_part(trim(name), ' ', 1),
  case
    when position(' ' in trim(name)) > 0
      then substring(trim(name) from position(' ' in trim(name)) + 1)
    else ''
  end,
  lower(trim(email)),
  'lead',
  'new',
  'website',
  25,
  created_at
from public.contact_messages
where nullif(trim(email), '') is not null
order by lower(trim(email)), created_at desc
on conflict (lower(email)) where email is not null and trim(email) <> ''
do update set
  lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score);

-- Preserve traceability to every source record without duplicating people.
insert into public.crm_contact_sources (contact_id, source_type, source_id)
select c.id, 'order', o.id
from public.orders o
join public.crm_contacts c on lower(c.email) = lower(trim(o.email))
where nullif(trim(o.email), '') is not null
on conflict (source_type, source_id) do nothing;

insert into public.crm_contact_sources (contact_id, source_type, source_id)
select c.id, 'quote', q.id
from public.quote_requests q
join public.crm_contacts c on lower(c.email) = lower(trim(q.email))
where nullif(trim(q.email), '') is not null
on conflict (source_type, source_id) do nothing;

insert into public.crm_contact_sources (contact_id, source_type, source_id)
select c.id, 'distributor', d.id
from public.distributor_applications d
join public.crm_contacts c on lower(c.email) = lower(trim(d.email))
where nullif(trim(d.email), '') is not null
on conflict (source_type, source_id) do nothing;

insert into public.crm_contact_sources (contact_id, source_type, source_id)
select c.id, 'contact_message', m.id
from public.contact_messages m
join public.crm_contacts c on lower(c.email) = lower(trim(m.email))
where nullif(trim(m.email), '') is not null
on conflict (source_type, source_id) do nothing;

-- Quote requests become pipeline opportunities and open follow-up tasks.
insert into public.crm_deals (
  contact_id, company_id, title, stage, probability, expected_close_date,
  source, source_record_id, created_at
)
select
  c.id,
  c.company_id,
  concat_ws(' - ', nullif(trim(q.company_name), ''), coalesce(nullif(trim(q.product_interest), ''), 'Quote opportunity')),
  case q.status
    when 'quoted' then 'proposal'
    when 'closed' then 'won'
    else 'lead'
  end,
  case q.status
    when 'quoted' then 60
    when 'closed' then 100
    else 20
  end,
  (q.created_at + interval '30 days')::date,
  'quote',
  q.id,
  q.created_at
from public.quote_requests q
join public.crm_contacts c on lower(c.email) = lower(trim(q.email))
where nullif(trim(q.email), '') is not null
on conflict (source, source_record_id) where source_record_id is not null do nothing;

insert into public.crm_activities (
  contact_id, deal_id, type, status, subject, body, due_at, metadata, created_at
)
select
  d.contact_id,
  d.id,
  'task',
  'open',
  'Follow up on quote request',
  q.message,
  q.created_at + interval '2 days',
  jsonb_build_object('source', 'quote_request', 'source_id', q.id),
  q.created_at
from public.crm_deals d
join public.quote_requests q on d.source = 'quote' and d.source_record_id = q.id
where q.status = 'new'
  and not exists (
    select 1
    from public.crm_activities a
    where a.metadata ->> 'source' = 'quote_request'
      and a.metadata ->> 'source_id' = q.id::text
  );

-- Least-privilege Data API access. Anonymous visitors cannot reach CRM data.
alter table public.crm_companies enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_deals enable row level security;
alter table public.crm_activities enable row level security;
alter table public.crm_contact_sources enable row level security;

revoke all on table public.crm_companies from anon;
revoke all on table public.crm_contacts from anon;
revoke all on table public.crm_deals from anon;
revoke all on table public.crm_activities from anon;
revoke all on table public.crm_contact_sources from anon;

grant select, insert, update, delete on table public.crm_companies to authenticated;
grant select, insert, update, delete on table public.crm_contacts to authenticated;
grant select, insert, update, delete on table public.crm_deals to authenticated;
grant select, insert, update, delete on table public.crm_activities to authenticated;
grant select, insert, update, delete on table public.crm_contact_sources to authenticated;

drop policy if exists "CRM admins manage companies" on public.crm_companies;
create policy "CRM admins manage companies"
on public.crm_companies
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

drop policy if exists "CRM admins manage contacts" on public.crm_contacts;
create policy "CRM admins manage contacts"
on public.crm_contacts
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

drop policy if exists "CRM admins manage deals" on public.crm_deals;
create policy "CRM admins manage deals"
on public.crm_deals
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

drop policy if exists "CRM admins manage activities" on public.crm_activities;
create policy "CRM admins manage activities"
on public.crm_activities
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

drop policy if exists "CRM admins manage source links" on public.crm_contact_sources;
create policy "CRM admins manage source links"
on public.crm_contact_sources
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

commit;
