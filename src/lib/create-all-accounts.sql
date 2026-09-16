-- ==============================================================================
-- SCRIPT SQL MANDIRI: MEMBUAT & MEMASUKKAN SELURUH AKUN KE SUPABASE AUTH
-- Jalankan kode ini di Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- ==============================================================================

-- 1. Aktifkan ekstensi enkripsi password
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Pastikan tabel profiles sudah ada
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nama TEXT NOT NULL,
  nis TEXT DEFAULT NULL,
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('admin', 'guru', 'pengurus', 'siswa')),
  siswa_id INT REFERENCES public.siswa(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Eksekusi pembuatan seluruh akun siswa & guru
DO $$
DECLARE
  r RECORD;
  v_email TEXT;
  v_clean_name TEXT;
  v_role TEXT;
  v_user_id UUID;
BEGIN
  -- Looping seluruh siswa yang ada di tabel public.siswa
  FOR r IN SELECT * FROM public.siswa ORDER BY id ASC LOOP
    
    -- Format nama bersih untuk email (hapus spasi, tanda kutip, strip)
    v_clean_name := lower(regexp_replace(r.nama, '[^a-zA-Z0-9]', '', 'g'));
    v_email := v_clean_name || '@smkwikrama.sch.id';

    -- Menentukan Role Akun:
    IF r.nis IN ('12511074', '12511108', '12611468', '12611831') THEN
      v_role := 'admin';
    ELSIF r.nis IN ('12511094', '12511415', '12510978', '12510816') THEN
      v_role := 'pengurus';
    ELSE
      v_role := 'siswa';
    END IF;

    -- Cek apakah user sudah ada di auth.users
    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();

      -- A. Masukkan ke tabel Supabase Authentication (auth.users)
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_user_id,
        'authenticated',
        'authenticated',
        v_email,
        crypt(r.nis, gen_salt('bf')), -- Password adalah NIS siswa
        NOW(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('nama', r.nama, 'nis', r.nis, 'role', v_role, 'siswa_id', r.id),
        NOW(),
        NOW(),
        ''
      );

      -- B. Masukkan ke tabel identitas auth (auth.identities)
      INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email),
        'email',
        NOW(),
        NOW(),
        NOW()
      );
    ELSE
      -- Jika user sudah ada, update password dan metadatanya
      UPDATE auth.users
      SET encrypted_password = crypt(r.nis, gen_salt('bf')),
          raw_user_meta_data = jsonb_build_object('nama', r.nama, 'nis', r.nis, 'role', v_role, 'siswa_id', r.id),
          updated_at = NOW()
      WHERE id = v_user_id;
    END IF;

    -- C. Masukkan / Sinkronkan ke tabel public.profiles
    INSERT INTO public.profiles (id, email, nama, nis, role, siswa_id)
    VALUES (v_user_id, v_email, r.nama, r.nis, v_role, r.id)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        nama = EXCLUDED.nama,
        nis = EXCLUDED.nis,
        role = EXCLUDED.role,
        siswa_id = EXCLUDED.siswa_id;

  END LOOP;

  -- 4. DAFTARKAN AKUN GURU / PEMBIMBING SISWA (PS)
  -- Email: mohamadrizal@smkwikrama.sch.id | Password: psrayoncisarua
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'mohamadrizal@smkwikrama.sch.id';
  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'mohamadrizal@smkwikrama.sch.id',
      crypt('psrayoncisarua', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('nama', 'Mohamad Rizal, S.Pd.', 'role', 'guru'),
      NOW(), NOW(), ''
    );

    INSERT INTO auth.identities (
      id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      v_user_id::text,
      v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', 'mohamadrizal@smkwikrama.sch.id'),
      'email',
      NOW(), NOW(), NOW()
    );
  END IF;

  INSERT INTO public.profiles (id, email, nama, nis, role, siswa_id)
  VALUES (v_user_id, 'mohamadrizal@smkwikrama.sch.id', 'Mohamad Rizal, S.Pd.', NULL, 'guru', NULL)
  ON CONFLICT (id) DO UPDATE
  SET role = 'guru', nama = 'Mohamad Rizal, S.Pd.';

END $$;
