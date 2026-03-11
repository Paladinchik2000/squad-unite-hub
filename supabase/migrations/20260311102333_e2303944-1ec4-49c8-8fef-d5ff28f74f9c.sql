
CREATE TABLE public.clan_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.clan_news ENABLE ROW LEVEL SECURITY;

-- Everyone can read published news
CREATE POLICY "Published news are viewable by everyone"
  ON public.clan_news FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admins can read all news (including drafts)
CREATE POLICY "Admins can read all news"
  ON public.clan_news FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Admins can insert news
CREATE POLICY "Admins can insert news"
  ON public.clan_news FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update news
CREATE POLICY "Admins can update news"
  ON public.clan_news FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can delete news
CREATE POLICY "Admins can delete news"
  ON public.clan_news FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));
