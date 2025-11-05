-- Create a storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create a storage bucket for project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy: Allow anyone to view images (public read)
CREATE POLICY "Public Access for Blog Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Public Access for Project Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Create storage policy: Allow authenticated users to upload images (admin only via RLS)
CREATE POLICY "Admin Upload Blog Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-images' AND
  auth.role() = 'anon'
);

CREATE POLICY "Admin Upload Project Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images' AND
  auth.role() = 'anon'
);

-- Create storage policy: Allow authenticated users to update their images
CREATE POLICY "Admin Update Blog Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND auth.role() = 'anon');

CREATE POLICY "Admin Update Project Images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND auth.role() = 'anon');

-- Create storage policy: Allow authenticated users to delete images
CREATE POLICY "Admin Delete Blog Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND auth.role() = 'anon');

CREATE POLICY "Admin Delete Project Images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND auth.role() = 'anon');
