-- Replace the generic CRM deal stages with Jinyu's operational conversion journey.
-- Probabilities are derived from the selected stage so reporting and forecasts
-- always use the agreed business rules.

begin;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

alter table public.crm_contacts
  add column if not exists conversion_stage text not null default 'new_inquiry',
  add column if not exists conversion_probability integer not null default 10;

alter table public.crm_contacts
  drop constraint if exists crm_contacts_conversion_stage_check,
  drop constraint if exists crm_contacts_conversion_probability_check;

alter table public.crm_contacts
  add constraint crm_contacts_conversion_stage_check
    check (conversion_stage in (
      'new_inquiry',
      'quoted_price',
      'negotiating_price',
      'pi_pending_confirmation',
      'deposit_received',
      'customs_clearance_and_shipment',
      'full_payment_settled'
    )),
  add constraint crm_contacts_conversion_probability_check
    check (conversion_probability in (10, 25, 40, 60, 80, 95, 100));

alter table public.crm_deals
  drop constraint if exists crm_deals_stage_check;

-- Preserve existing opportunities while translating the old generic stages to
-- the closest real sales milestone.
update public.crm_deals
set
  stage = case stage
    when 'lead' then 'new_inquiry'
    when 'qualified' then 'quoted_price'
    when 'proposal' then 'quoted_price'
    when 'negotiation' then 'negotiating_price'
    when 'won' then 'full_payment_settled'
    else stage
  end,
  probability = case stage
    when 'lead' then 10
    when 'qualified' then 25
    when 'proposal' then 25
    when 'negotiation' then 40
    when 'won' then 100
    when 'lost' then 0
    else probability
  end;

alter table public.crm_deals
  add constraint crm_deals_stage_check
    check (stage in (
      'new_inquiry',
      'quoted_price',
      'negotiating_price',
      'pi_pending_confirmation',
      'deposit_received',
      'customs_clearance_and_shipment',
      'full_payment_settled',
      'lost'
    ));

create or replace function private.crm_set_contact_conversion_probability()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.conversion_probability := case new.conversion_stage
    when 'new_inquiry' then 10
    when 'quoted_price' then 25
    when 'negotiating_price' then 40
    when 'pi_pending_confirmation' then 60
    when 'deposit_received' then 80
    when 'customs_clearance_and_shipment' then 95
    when 'full_payment_settled' then 100
  end;
  return new;
end;
$$;

revoke all on function private.crm_set_contact_conversion_probability()
from public, anon, authenticated;

drop trigger if exists crm_contacts_set_conversion_probability on public.crm_contacts;
create trigger crm_contacts_set_conversion_probability
before insert or update of conversion_stage
on public.crm_contacts
for each row execute function private.crm_set_contact_conversion_probability();

create or replace function private.crm_set_deal_conversion_probability()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.probability := case new.stage
    when 'new_inquiry' then 10
    when 'quoted_price' then 25
    when 'negotiating_price' then 40
    when 'pi_pending_confirmation' then 60
    when 'deposit_received' then 80
    when 'customs_clearance_and_shipment' then 95
    when 'full_payment_settled' then 100
    when 'lost' then 0
  end;

  if new.stage in ('full_payment_settled', 'lost') then
    new.closed_at := coalesce(new.closed_at, now());
  else
    new.closed_at := null;
  end if;

  return new;
end;
$$;

revoke all on function private.crm_set_deal_conversion_probability()
from public, anon, authenticated;

drop trigger if exists crm_deals_set_conversion_probability on public.crm_deals;
create trigger crm_deals_set_conversion_probability
before insert or update of stage
on public.crm_deals
for each row execute function private.crm_set_deal_conversion_probability();

-- Keep the contact-level journey summary aligned with the most advanced deal
-- for that contact. A contact without a deal retains the stage selected by an
-- administrator.
create or replace function private.crm_refresh_contact_conversion(contact_uuid uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  most_advanced_stage text;
  most_advanced_probability integer;
begin
  select d.stage, d.probability
  into most_advanced_stage, most_advanced_probability
  from public.crm_deals d
  where d.contact_id = contact_uuid
    and d.stage <> 'lost'
  order by d.probability desc, d.updated_at desc
  limit 1;

  if most_advanced_stage is not null then
    update public.crm_contacts
    set
      conversion_stage = most_advanced_stage,
      conversion_probability = most_advanced_probability
    where id = contact_uuid
      and most_advanced_probability >= conversion_probability;
  end if;
end;
$$;

revoke all on function private.crm_refresh_contact_conversion(uuid)
from public, anon, authenticated;

create or replace function private.crm_sync_contact_conversion_from_deal()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op in ('UPDATE', 'DELETE') and old.contact_id is not null then
    perform private.crm_refresh_contact_conversion(old.contact_id);
  end if;

  if tg_op in ('INSERT', 'UPDATE') and new.contact_id is not null then
    perform private.crm_refresh_contact_conversion(new.contact_id);
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function private.crm_sync_contact_conversion_from_deal()
from public, anon, authenticated;

drop trigger if exists crm_deals_sync_contact_conversion on public.crm_deals;
create trigger crm_deals_sync_contact_conversion
after insert or update of stage, contact_id or delete
on public.crm_deals
for each row execute function private.crm_sync_contact_conversion_from_deal();

-- Website quote requests are CRM enquiries. New submissions start at 10%, and
-- marking a request as quoted progresses the linked contact and deal to 25%.
create or replace function private.crm_sync_quote_request()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  synced_company_id uuid;
  synced_contact_id uuid;
  synced_stage text;
  synced_probability integer;
  synced_deal_id uuid;
begin
  synced_stage := case new.status
    when 'quoted' then 'quoted_price'
    when 'negotiating_price' then 'negotiating_price'
    when 'pi_pending_confirmation' then 'pi_pending_confirmation'
    when 'deposit_received' then 'deposit_received'
    when 'customs_clearance_and_shipment' then 'customs_clearance_and_shipment'
    when 'closed' then 'full_payment_settled'
    when 'full_payment_settled' then 'full_payment_settled'
    else 'new_inquiry'
  end;

  synced_probability := case synced_stage
    when 'new_inquiry' then 10
    when 'quoted_price' then 25
    when 'negotiating_price' then 40
    when 'pi_pending_confirmation' then 60
    when 'deposit_received' then 80
    when 'customs_clearance_and_shipment' then 95
    when 'full_payment_settled' then 100
  end;

  if nullif(trim(new.company_name), '') is not null then
    insert into public.crm_companies (name, status, last_activity_at)
    values (
      trim(new.company_name),
      case when synced_probability = 100 then 'customer' else 'prospect' end,
      new.created_at
    )
    on conflict (lower(name)) where trim(name) <> ''
    do update set
      status = case
        when excluded.status = 'customer' then 'customer'
        else public.crm_companies.status
      end,
      last_activity_at = greatest(public.crm_companies.last_activity_at, excluded.last_activity_at)
    returning id into synced_company_id;
  end if;

  insert into public.crm_contacts (
    company_id,
    first_name,
    last_name,
    email,
    phone,
    lifecycle_stage,
    lead_status,
    source,
    lead_score,
    conversion_stage,
    conversion_probability,
    next_follow_up_at,
    created_at
  )
  values (
    synced_company_id,
    trim(new.first_name),
    coalesce(trim(new.last_name), ''),
    lower(trim(new.email)),
    nullif(trim(new.phone), ''),
    case when synced_probability = 100 then 'customer' else 'opportunity' end,
    case when synced_probability >= 25 then 'qualified' else 'new' end,
    'quote',
    case when synced_probability = 100 then 100 when synced_probability >= 25 then 65 else 45 end,
    synced_stage,
    synced_probability,
    case when synced_probability < 100 then new.created_at + interval '2 days' else null end,
    new.created_at
  )
  on conflict (lower(email)) where email is not null and trim(email) <> ''
  do update set
    company_id = coalesce(public.crm_contacts.company_id, excluded.company_id),
    phone = coalesce(public.crm_contacts.phone, excluded.phone),
    lifecycle_stage = case
      when excluded.lifecycle_stage = 'customer' then 'customer'
      when public.crm_contacts.lifecycle_stage = 'customer' then 'customer'
      else 'opportunity'
    end,
    lead_status = case
      when excluded.conversion_probability >= 25 then 'qualified'
      else public.crm_contacts.lead_status
    end,
    lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score),
    conversion_stage = case
      when excluded.conversion_probability >= public.crm_contacts.conversion_probability
        then excluded.conversion_stage
      else public.crm_contacts.conversion_stage
    end,
    conversion_probability = greatest(
      public.crm_contacts.conversion_probability,
      excluded.conversion_probability
    ),
    next_follow_up_at = case
      when excluded.conversion_probability = 100 then null
      else coalesce(public.crm_contacts.next_follow_up_at, excluded.next_follow_up_at)
    end
  returning id into synced_contact_id;

  insert into public.crm_contact_sources (contact_id, source_type, source_id)
  values (synced_contact_id, 'quote', new.id)
  on conflict (source_type, source_id)
  do update set contact_id = excluded.contact_id;

  insert into public.crm_deals (
    contact_id,
    company_id,
    title,
    stage,
    amount,
    probability,
    expected_close_date,
    source,
    source_record_id,
    created_at
  )
  values (
    synced_contact_id,
    synced_company_id,
    concat_ws(
      ' - ',
      nullif(trim(new.company_name), ''),
      coalesce(nullif(trim(new.product_interest), ''), 'Quote opportunity')
    ),
    synced_stage,
    0,
    synced_probability,
    (new.created_at + interval '30 days')::date,
    'quote',
    new.id,
    new.created_at
  )
  on conflict (source, source_record_id) where source_record_id is not null
  do update set
    contact_id = excluded.contact_id,
    company_id = coalesce(public.crm_deals.company_id, excluded.company_id),
    title = excluded.title,
    stage = case
      when excluded.probability >= public.crm_deals.probability then excluded.stage
      else public.crm_deals.stage
    end
  returning id into synced_deal_id;

  if synced_stage = 'new_inquiry' then
    insert into public.crm_activities (
      contact_id,
      deal_id,
      type,
      status,
      subject,
      body,
      due_at,
      metadata,
      created_at
    )
    select
      synced_contact_id,
      synced_deal_id,
      'task',
      'open',
      'Follow up on quote request',
      new.message,
      new.created_at + interval '2 days',
      jsonb_build_object('source', 'quote_request', 'source_id', new.id),
      new.created_at
    where not exists (
      select 1
      from public.crm_activities activity
      where activity.metadata ->> 'source' = 'quote_request'
        and activity.metadata ->> 'source_id' = new.id::text
    );
  end if;

  return new;
end;
$$;

revoke all on function private.crm_sync_quote_request()
from public, anon, authenticated;

drop trigger if exists crm_quote_requests_sync_conversion on public.quote_requests;
create trigger crm_quote_requests_sync_conversion
after insert or update
on public.quote_requests
for each row execute function private.crm_sync_quote_request();

-- General website messages and distributor applications also enter the CRM at
-- the 10% New inquiry stage.
create or replace function private.crm_sync_contact_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  synced_contact_id uuid;
begin
  insert into public.crm_contacts (
    first_name,
    last_name,
    email,
    lifecycle_stage,
    lead_status,
    source,
    lead_score,
    conversion_stage,
    conversion_probability,
    created_at
  )
  values (
    split_part(trim(new.name), ' ', 1),
    case
      when position(' ' in trim(new.name)) > 0
        then substring(trim(new.name) from position(' ' in trim(new.name)) + 1)
      else ''
    end,
    lower(trim(new.email)),
    'lead',
    'new',
    'website',
    25,
    'new_inquiry',
    10,
    new.created_at
  )
  on conflict (lower(email)) where email is not null and trim(email) <> ''
  do update set lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score)
  returning id into synced_contact_id;

  insert into public.crm_contact_sources (contact_id, source_type, source_id)
  values (synced_contact_id, 'contact_message', new.id)
  on conflict (source_type, source_id)
  do update set contact_id = excluded.contact_id;

  return new;
end;
$$;

revoke all on function private.crm_sync_contact_message()
from public, anon, authenticated;

drop trigger if exists crm_contact_messages_sync_conversion on public.contact_messages;
create trigger crm_contact_messages_sync_conversion
after insert or update
on public.contact_messages
for each row execute function private.crm_sync_contact_message();

create or replace function private.crm_sync_distributor_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  synced_company_id uuid;
  synced_contact_id uuid;
begin
  insert into public.crm_companies (name, country, status, last_activity_at)
  values (trim(new.company_name), nullif(trim(new.country), ''), 'partner', new.created_at)
  on conflict (lower(name)) where trim(name) <> ''
  do update set
    country = coalesce(public.crm_companies.country, excluded.country),
    status = 'partner',
    last_activity_at = greatest(public.crm_companies.last_activity_at, excluded.last_activity_at)
  returning id into synced_company_id;

  insert into public.crm_contacts (
    company_id,
    first_name,
    last_name,
    email,
    phone,
    lifecycle_stage,
    lead_status,
    source,
    lead_score,
    conversion_stage,
    conversion_probability,
    created_at
  )
  values (
    synced_company_id,
    trim(new.contact_name),
    '',
    lower(trim(new.email)),
    nullif(trim(new.phone), ''),
    'partner',
    case when new.status = 'approved' then 'qualified' else 'new' end,
    'distributor',
    case when new.status = 'approved' then 75 else 40 end,
    'new_inquiry',
    10,
    new.created_at
  )
  on conflict (lower(email)) where email is not null and trim(email) <> ''
  do update set
    company_id = coalesce(public.crm_contacts.company_id, excluded.company_id),
    phone = coalesce(public.crm_contacts.phone, excluded.phone),
    lifecycle_stage = case
      when public.crm_contacts.lifecycle_stage = 'customer' then 'customer'
      else 'partner'
    end,
    lead_status = case
      when excluded.lead_status = 'qualified' then 'qualified'
      else public.crm_contacts.lead_status
    end,
    lead_score = greatest(public.crm_contacts.lead_score, excluded.lead_score)
  returning id into synced_contact_id;

  insert into public.crm_contact_sources (contact_id, source_type, source_id)
  values (synced_contact_id, 'distributor', new.id)
  on conflict (source_type, source_id)
  do update set contact_id = excluded.contact_id;

  return new;
end;
$$;

revoke all on function private.crm_sync_distributor_application()
from public, anon, authenticated;

drop trigger if exists crm_distributor_applications_sync_conversion on public.distributor_applications;
create trigger crm_distributor_applications_sync_conversion
after insert or update
on public.distributor_applications
for each row execute function private.crm_sync_distributor_application();

create index if not exists crm_contacts_conversion_stage_idx
  on public.crm_contacts(conversion_stage);

-- Bring records submitted since the original CRM migration into the same
-- journey without duplicating contacts, deals, or activities.
update public.quote_requests set status = status;
update public.contact_messages set status = status;
update public.distributor_applications set status = status;

-- Existing order-backed contacts and the most advanced linked deal establish
-- the initial contact-level journey summary.
update public.crm_contacts contact
set
  conversion_stage = 'full_payment_settled',
  conversion_probability = 100
where exists (
  select 1
  from public.crm_contact_sources source
  where source.contact_id = contact.id
    and source.source_type = 'order'
);

with advanced as (
  select distinct on (deal.contact_id)
    deal.contact_id,
    deal.stage,
    deal.probability
  from public.crm_deals deal
  where deal.contact_id is not null
    and deal.stage <> 'lost'
  order by deal.contact_id, deal.probability desc, deal.updated_at desc
)
update public.crm_contacts contact
set
  conversion_stage = advanced.stage,
  conversion_probability = advanced.probability
from advanced
where advanced.contact_id = contact.id
  and advanced.probability >= contact.conversion_probability;

commit;
