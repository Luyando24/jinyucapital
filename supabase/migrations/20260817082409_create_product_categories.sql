-- Product categories are managed independently and referenced by products.
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index product_categories_name_unique
  on public.product_categories (lower(btrim(name)));

-- Preserve every existing category and its products during normalization.
insert into public.product_categories (name, sort_order)
select category, dense_rank() over (order by category) - 1
from (
  select distinct btrim(category) as category
  from public.products
  where btrim(category) <> ''
) existing_categories;

alter table public.products
  add column category_id uuid references public.product_categories(id) on delete restrict;

update public.products products
set category_id = categories.id
from public.product_categories categories
where lower(btrim(products.category)) = lower(btrim(categories.name));

alter table public.products
  alter column category_id set not null,
  alter column category drop default;

create index idx_products_category_id on public.products(category_id);

-- Keep the legacy category text synchronized for existing reads and reports.
create function public.set_product_category_name()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  select categories.name
  into new.category
  from public.product_categories categories
  where categories.id = new.category_id;

  if not found then
    raise exception 'Product category % does not exist', new.category_id;
  end if;

  return new;
end;
$$;

create trigger set_product_category_name_on_insert
before insert on public.products
for each row execute function public.set_product_category_name();

create trigger set_product_category_name_on_update
before update of category_id, category on public.products
for each row execute function public.set_product_category_name();

create function public.sync_product_category_name()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  update public.products
  set category = new.name
  where category_id = new.id;

  return new;
end;
$$;

create trigger sync_product_category_name_after_rename
after update of name on public.product_categories
for each row
when (old.name is distinct from new.name)
execute function public.sync_product_category_name();

create function public.set_product_category_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.name = btrim(new.name);
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_product_category_updated_at
before insert or update on public.product_categories
for each row execute function public.set_product_category_updated_at();

alter table public.product_categories enable row level security;

revoke all on table public.product_categories from anon, authenticated;
grant select on table public.product_categories to anon;
grant select, insert, update, delete on table public.product_categories to authenticated;
grant select, insert, update, delete on table public.product_categories to service_role;

create policy "Public read active product categories"
on public.product_categories
for select
to anon
using (is_active);

create policy "Authenticated read product categories"
on public.product_categories
for select
to authenticated
using (
  is_active
  or ((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin'
);

create policy "Admins insert product categories"
on public.product_categories
for insert
to authenticated
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

create policy "Admins update product categories"
on public.product_categories
for update
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

create policy "Admins delete product categories"
on public.product_categories
for delete
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');

-- Product writes use the same trusted app-metadata authorization as this UI.
drop policy if exists "Admin manage products" on public.products;

create policy "Admins manage products"
on public.products
for all
to authenticated
using (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin')
with check (((select auth.jwt()) -> 'app_metadata' ->> 'usertype') = 'admin');
