
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT TO anon, authenticated USING (true);
