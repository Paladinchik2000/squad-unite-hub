
-- Add image_url column to clan_news
ALTER TABLE public.clan_news ADD COLUMN image_url text;

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- Allow authenticated admins to upload news images
CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to update news images
CREATE POLICY "Admins can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow authenticated admins to delete news images
CREATE POLICY "Admins can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Allow public read access to news images
CREATE POLICY "Anyone can view news images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'news-images');
