-- ==============================================================================
-- SCRIPT PERBAIKAN PERMISSION & RELOAD SCHEMA POSTGREST SUPABASE
-- Jalankan script ini di Supabase SQL Editor untuk mengatasi "Database error querying schema"
-- ==============================================================================

-- 1. Berikan Hak Akses Penuh Schema Public ke Role Supabase
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 2. Perbaiki Fungsi get_current_user_role (Aman saat user anonim/guest)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid()),
    'guest'
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO postgres, anon, authenticated, service_role;

-- 3. Pastikan RLS Policy tabel profiles mengizinkan read untuk role anon & authenticated
DROP POLICY IF EXISTS "Public view profiles" ON public.profiles;
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view siswa" ON public.siswa;
CREATE POLICY "Public can view siswa" ON public.siswa FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view struktur_pengurus" ON public.struktur_pengurus;
CREATE POLICY "Public view struktur_pengurus" ON public.struktur_pengurus FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view jadwal_piket" ON public.jadwal_piket;
CREATE POLICY "Public view jadwal_piket" ON public.jadwal_piket FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public view prestasi" ON public.prestasi;
CREATE POLICY "Public view prestasi" ON public.prestasi FOR SELECT USING (true);

-- 4. Kirim Sinyal Reload Schema ke PostgREST API
NOTIFY pgrst, 'reload schema';
