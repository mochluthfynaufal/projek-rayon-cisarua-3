-- ==============================================================================
-- SCRIPT SOLUSI TUNTAS: "Database error querying schema" PADA LOGIN
-- Jalankan seluruh script ini di Supabase SQL Editor (New Query -> Run)
-- ==============================================================================

-- 1. HAPUS TRIGGER DI auth.users YANG MEMBLOKIR LOGIN SUPABASE AUTH
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- 2. BERIKAN PERMISSION LENGKAP PADA SCHEMA PUBLIC
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role, supabase_auth_admin;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role, supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role, supabase_auth_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role, supabase_auth_admin;

-- 3. PERBAIKI FUNGSI get_current_user_role AGAR TIDAK REKURSIF / ERROR
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    'guest'
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO postgres, anon, authenticated, service_role;

-- 4. PASTIKAN RLS POLICIES AMAN
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view profiles" ON public.profiles;
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User update own profile" ON public.profiles;
CREATE POLICY "User update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Public can view siswa" ON public.siswa;
CREATE POLICY "Public can view siswa" ON public.siswa FOR SELECT USING (true);

-- 5. RELOAD POSTGREST CACHE
NOTIFY pgrst, 'reload schema';
