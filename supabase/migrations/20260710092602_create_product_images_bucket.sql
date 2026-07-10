-- Create the product-images storage bucket
insert into storage.buckets (id, name, public, file_size_limit)
values ('product-images', 'product-images', true, 52428800) -- 50 MB limit
on conflict (id) do nothing;

-- Allow authenticated users (admins) to upload files
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

-- Allow authenticated users to update/replace files (upsert requires INSERT + SELECT + UPDATE)
create policy "Authenticated users can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

-- Allow authenticated users to select (needed for upsert and public URL generation)
create policy "Authenticated users can read product images"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images');

-- Allow public read access (bucket is public, but still need an object-level policy)
create policy "Public can read product images"
  on storage.objects for select
  to anon
  using (bucket_id = 'product-images');

-- Allow authenticated users to delete product images
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
