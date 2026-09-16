-- ==============================================================================
-- SKEMA LENGKAP SUPABASE & MANAJEMEN ROLE AKUN RAYON CISARUA 3
-- Jalankan seluruh script ini di Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. TABEL UTAMA: SISWA
CREATE TABLE IF NOT EXISTS public.siswa (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  nis TEXT NOT NULL UNIQUE,
  jabatan TEXT NOT NULL DEFAULT 'Anggota',
  angkatan TEXT NOT NULL DEFAULT 'Kelas X',
  tahun_angkatan TEXT NOT NULL DEFAULT '2026/2027',
  jurusan TEXT DEFAULT NULL,
  inisial TEXT NOT NULL DEFAULT '',
  warna_bg TEXT NOT NULL DEFAULT 'bg-blue-600',
  bio TEXT DEFAULT '',
  foto_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom jurusan jika tabel sudah pernah dibuat sebelumnya
ALTER TABLE public.siswa ADD COLUMN IF NOT EXISTS jurusan TEXT DEFAULT NULL;

-- 2. TABEL PROFILES (Terhubung ke Supabase Auth / auth.users)
-- Role: 'admin', 'guru', 'pengurus', 'siswa'
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nama TEXT NOT NULL,
  nis TEXT DEFAULT NULL,
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('admin', 'guru', 'pengurus', 'siswa')),
  siswa_id INT REFERENCES public.siswa(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nis TEXT DEFAULT NULL;

-- 3. TABEL PRESTASI SISWA
CREATE TABLE IF NOT EXISTS public.prestasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id INT NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  juara TEXT NOT NULL,
  tingkat TEXT NOT NULL,
  tanggal DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL STRUKTUR PENGURUS KELAS / RAYON
CREATE TABLE IF NOT EXISTS public.struktur_pengurus (
  id SERIAL PRIMARY KEY,
  peran TEXT NOT NULL UNIQUE,
  inisial TEXT NOT NULL DEFAULT '',
  siswa_id INT REFERENCES public.siswa(id) ON DELETE SET NULL,
  nama_custom TEXT DEFAULT NULL,
  tugas TEXT[] NOT NULL DEFAULT '{}',
  urutan INT NOT NULL DEFAULT 1
);

-- 5. TABEL JADWAL PIKET
CREATE TABLE IF NOT EXISTS public.jadwal_piket (
  id SERIAL PRIMARY KEY,
  hari TEXT NOT NULL,
  day_index INT NOT NULL CHECK (day_index BETWEEN 1 AND 5),
  siswa_id INT NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  urutan INT NOT NULL DEFAULT 1
);

-- 6. TABEL KELUHAN RAYON
CREATE TABLE IF NOT EXISTS public.keluhan_rayon (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id INT REFERENCES public.siswa(id) ON DELETE SET NULL,
  nama_pengirim TEXT NOT NULL,
  nis_pengirim TEXT,
  judul TEXT NOT NULL,
  isi TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Umum',
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diproses', 'Selesai')),
  tanggapan TEXT DEFAULT NULL,
  ditanggapi_oleh UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger auth.users dihapus agar tidak memblokir query internal Supabase Auth (GoTrue)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.struktur_pengurus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jadwal_piket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keluhan_rayon ENABLE ROW LEVEL SECURITY;

-- Berikan izin akses schema public ke semua role Supabase
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

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

-- Policies SISWA
DROP POLICY IF EXISTS "Public can view siswa" ON public.siswa;
CREATE POLICY "Public can view siswa" ON public.siswa FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin/Guru can modify siswa" ON public.siswa;
CREATE POLICY "Admin/Guru can modify siswa" ON public.siswa FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'guru')
);

DROP POLICY IF EXISTS "Siswa can update their own bio" ON public.siswa;
CREATE POLICY "Siswa can update their own bio" ON public.siswa FOR UPDATE USING (
  id IN (SELECT siswa_id FROM public.profiles WHERE id = auth.uid())
);

-- Policies PROFILES
DROP POLICY IF EXISTS "Public view profiles" ON public.profiles;
CREATE POLICY "Public view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "User can update their own profile" ON public.profiles;
CREATE POLICY "User can update their own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;
CREATE POLICY "Admin can manage all profiles" ON public.profiles FOR ALL USING (public.get_current_user_role() = 'admin');

-- Policies PRESTASI
DROP POLICY IF EXISTS "Public view prestasi" ON public.prestasi;
CREATE POLICY "Public view prestasi" ON public.prestasi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Owner, Admin, Guru can manage prestasi" ON public.prestasi;
CREATE POLICY "Owner, Admin, Guru can manage prestasi" ON public.prestasi FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'guru') OR
  siswa_id IN (SELECT siswa_id FROM public.profiles WHERE id = auth.uid())
);

-- Policies STRUKTUR PENGURUS
DROP POLICY IF EXISTS "Public view struktur_pengurus" ON public.struktur_pengurus;
CREATE POLICY "Public view struktur_pengurus" ON public.struktur_pengurus FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru and Admin can manage struktur" ON public.struktur_pengurus;
CREATE POLICY "Guru and Admin can manage struktur" ON public.struktur_pengurus FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'guru')
);

-- Policies JADWAL PIKET
DROP POLICY IF EXISTS "Public view jadwal_piket" ON public.jadwal_piket;
CREATE POLICY "Public view jadwal_piket" ON public.jadwal_piket FOR SELECT USING (true);

DROP POLICY IF EXISTS "Pengurus, Guru, Admin can manage piket" ON public.jadwal_piket;
CREATE POLICY "Pengurus, Guru, Admin can manage piket" ON public.jadwal_piket FOR ALL USING (
  public.get_current_user_role() IN ('admin', 'guru', 'pengurus')
);

-- Policies KELUHAN RAYON
DROP POLICY IF EXISTS "Authenticated users can insert keluhan" ON public.keluhan_rayon;
CREATE POLICY "Authenticated users can insert keluhan" ON public.keluhan_rayon FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "View keluhan policy" ON public.keluhan_rayon;
CREATE POLICY "View keluhan policy" ON public.keluhan_rayon FOR SELECT USING (
  public.get_current_user_role() IN ('admin', 'guru', 'pengurus') OR
  siswa_id IN (SELECT siswa_id FROM public.profiles WHERE id = auth.uid())
);

DROP POLICY IF EXISTS "Manage keluhan policy" ON public.keluhan_rayon;
CREATE POLICY "Manage keluhan policy" ON public.keluhan_rayon FOR UPDATE USING (
  public.get_current_user_role() IN ('admin', 'guru', 'pengurus')
);

-- ==============================================================================
-- SEED DATA REAL SISWA RAYON CISARUA 3 (57 Siswa dengan Jurusan & Jabatan)
-- ==============================================================================
INSERT INTO public.siswa (id, nama, nis, jabatan, angkatan, tahun_angkatan, jurusan, inisial, warna_bg) VALUES
  -- KELAS XI (Angkatan 30)
  (1,  'Al''Fika Dwi Cahyani',           '12510816', 'Bendahara',   'Kelas XI', '2025/2026', 'MPLB', 'AF', 'bg-cyan-600'),
  (2,  'Bagas Dizwar Asfas',            '12510875', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'BD', 'bg-sky-500'),
  (3,  'Fadlan Ahmad Jamil Al Ayubi',   '12510938', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'FA', 'bg-slate-600'),
  (4,  'Fadliansyah Venanda',           '12510940', 'Anggota',     'Kelas XI', '2025/2026', 'PPLG', 'FV', 'bg-yellow-600'),
  (5,  'Haphinatul Shafira',            '12510978', 'Sekretaris',  'Kelas XI', '2025/2026', 'DKV',  'HS', 'bg-orange-500'),
  (6,  'Moch Luthfy Naufal',            '12511074', 'Anggota',     'Kelas XI', '2025/2026', 'PPLG', 'ML', 'bg-purple-600'),
  (7,  'Muhamad Aditya Abdilah',        '12511087', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'MA', 'bg-lime-600'),
  (8,  'Muhamad Azwan Muzaki',          '12511094', 'Ketua',       'Kelas XI', '2025/2026', 'TJKT', 'MM', 'bg-indigo-600'),
  (9,  'Muhamad Fadilah',               '12511101', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'MF', 'bg-blue-500'),
  (10, 'Muhamad Fedliansyah Ilham',     '12511108', 'Anggota',     'Kelas XI', '2025/2026', 'PPLG', 'MF', 'bg-violet-600'),
  (11, 'Muhammad Rafliansyah Putra',    '12511202', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'MR', 'bg-red-600'),
  (12, 'Nadira Dewanti Putri',          '12511233', 'Anggota',     'Kelas XI', '2025/2026', 'MPLB', 'ND', 'bg-pink-600'),
  (13, 'Ridwan Faiz Rojabi',            '12511336', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'RF', 'bg-green-500'),
  (14, 'Salsabila Destiana Putri',      '12511344', 'Anggota',     'Kelas XI', '2025/2026', 'DKV',  'SD', 'bg-fuchsia-600'),
  (15, 'Sandy Prayogo',                 '12511347', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'SP', 'bg-slate-500'),
  (16, 'Siti Aliya Zhafirah',           '12511365', 'Anggota',     'Kelas XI', '2025/2026', 'MPLB', 'SZ', 'bg-purple-500'),
  (17, 'Syifa Dwi Anggraini',           '12511391', 'Anggota',     'Kelas XI', '2025/2026', 'MPLB', 'SA', 'bg-rose-600'),
  (18, 'Zaghita Rahmah Firdaus',        '12511415', 'Wakil Ketua', 'Kelas XI', '2025/2026', 'KLN',  'ZR', 'bg-teal-600'),
  (19, 'Zyad Abdillah',                 '12511425', 'Anggota',     'Kelas XI', '2025/2026', 'TJKT', 'ZA', 'bg-fuchsia-500'),

  -- KELAS X
  (20, 'Adhwa Baihaqi',                 '12611434', 'Anggota',     'Kelas X',  '2026/2027', 'PPLG', 'AB', 'bg-pink-500'),
  (21, 'Alisya Zahwa Nurlatifah',       '12611468', 'Anggota',     'Kelas X',  '2026/2027', 'DKV',  'AZ', 'bg-lime-500'),
  (22, 'Chieka Sharlie Wulandari',      '12611539', 'Anggota',     'Kelas X',  '2026/2027', 'MPLB', 'CS', 'bg-yellow-500'),
  (23, 'Daniel Kurniawan',              '12611548', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'DK', 'bg-blue-600'),
  (24, 'Danisha Aniq Ayasha Firgiansa', '12611549', 'Anggota',     'Kelas X',  '2026/2027', 'DKV',  'DA', 'bg-rose-500'),
  (25, 'Dervy Alita Wijaya',            '12611560', 'Anggota',     'Kelas X',  '2026/2027', 'PPLG', 'DW', 'bg-emerald-600'),
  (26, 'Dinda Aqila Nurfadilah',        '12611572', 'Anggota',     'Kelas X',  '2026/2027', 'MPLB', 'DN', 'bg-amber-500'),
  (27, 'Ferhika Putri Maulidina',       '12611612', 'Anggota',     'Kelas X',  '2026/2027', 'KLN',  'FP', 'bg-teal-500'),
  (28, 'M Zafa Zulprana',               '12611692', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'MZ', 'bg-green-600'),
  (29, 'Muhammad Asrul Gunawan',        '12611795', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'MA', 'bg-amber-600'),
  (30, 'Muhammad Faris Hisyam Azizi',   '12611807', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'MH', 'bg-orange-600'),
  (31, 'Muhammad Naufal Alkahfi',       '12611831', 'Anggota',     'Kelas X',  '2026/2027', 'PPLG', 'MN', 'bg-sky-600'),
  (32, 'Mustafa Habibi Agnia',          '12611861', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'MH', 'bg-cyan-700'),
  (33, 'Rizky Ikhsan Maulana',          '12611961', 'Anggota',     'Kelas X',  '2026/2027', 'TJKT', 'RI', 'bg-indigo-500'),
  (34, 'Sifa Aulia',                    '12611987', 'Anggota',     'Kelas X',  '2026/2027', 'DKV',  'SI', 'bg-red-500'),
  (35, 'Siti Erfina Nurmawati',         '12611994', 'Anggota',     'Kelas X',  '2026/2027', 'MPLB', 'SE', 'bg-emerald-500'),
  (36, 'Viona Oktora Mulyana Putri',    '12612043', 'Anggota',     'Kelas X',  '2026/2027', 'KLN',  'VO', 'bg-violet-500'),

  -- KELAS XII (PKL)
  (37, 'Air Langga Ali Syahbani',          '12410151', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'PPLG', 'AA', 'bg-blue-600'),
  (38, 'Almayra Nadhir',                   '12410176', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'MPLB', 'AN', 'bg-indigo-600'),
  (39, 'Alnyra Aisyah Rachman',            '12410178', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'DKV',  'AR', 'bg-violet-600'),
  (40, 'Dafi Hawandie',                    '12410239', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'TJKT', 'DH', 'bg-sky-600'),
  (41, 'Deby Nur Arfiyah Saputri',         '12410246', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'MPLB', 'DN', 'bg-blue-700'),
  (42, 'Fara Ayu Sudibyo',                 '12410282', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'KLN',  'FS', 'bg-cyan-700'),
  (43, 'Ghea Andara Ayudinata',            '12410306', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'DKV',  'GA', 'bg-blue-500'),
  (44, 'Muhamad Habibie Raysyah Toha',     '12410439', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'TJKT', 'MH', 'bg-indigo-500'),
  (45, 'Muhamad Ramadhan Fadilah Tjiptadi','12410462', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'PPLG', 'MR', 'bg-violet-500'),
  (46, 'Muhammad Razzan Firdaus',          '12410556', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'TJKT', 'MR', 'bg-sky-500'),
  (47, 'Muhammad Rizki Maulana',           '12410562', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'TJKT', 'MR', 'bg-blue-800'),
  (48, 'Mutia Oktaviani',                  '12410574', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'MPLB', 'MO', 'bg-indigo-700'),
  (49, 'Nazwa Afifa Sahira',               '12410600', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'DKV',  'NA', 'bg-cyan-600'),
  (50, 'Nelsa Septia Putri',               '12410606', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'KLN',  'NS', 'bg-violet-700'),
  (51, 'Queentana Allea Hasanath',         '12410639', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'MPLB', 'QA', 'bg-blue-600'),
  (52, 'Sylvia Aljazira Wafdah',           '12410741', 'Anggota', 'Kelas XII (PKL)', '2024/2025', 'PPLG', 'SW', 'bg-indigo-600'),

  -- ALUMNI
  (53, 'Alumni RC3-01', '2110001', 'Anggota', 'Alumni', 'Lulus 2024', 'TJKT', 'A1', 'bg-gray-500'),
  (54, 'Alumni RC3-02', '2110002', 'Anggota', 'Alumni', 'Lulus 2024', 'PPLG', 'A2', 'bg-gray-600'),
  (55, 'Alumni RC3-03', '2110003', 'Anggota', 'Alumni', 'Lulus 2024', 'DKV',  'A3', 'bg-gray-700'),
  (56, 'Alumni RC3-04', '2110004', 'Anggota', 'Alumni', 'Lulus 2023', 'MPLB', 'A4', 'bg-slate-500'),
  (57, 'Alumni RC3-05', '2110005', 'Anggota', 'Alumni', 'Lulus 2023', 'KLN',  'A5', 'bg-slate-600')
ON CONFLICT (id) DO UPDATE
SET nama = EXCLUDED.nama,
    nis = EXCLUDED.nis,
    jabatan = EXCLUDED.jabatan,
    angkatan = EXCLUDED.angkatan,
    tahun_angkatan = EXCLUDED.tahun_angkatan,
    jurusan = EXCLUDED.jurusan,
    inisial = EXCLUDED.inisial,
    warna_bg = EXCLUDED.warna_bg;

SELECT setval('siswa_id_seq', (SELECT MAX(id) FROM public.siswa));

-- ==============================================================================
-- STRUKTUR PENGURUS RAYON CISARUA 3 (Ketua, Wakil, Sekretaris, Bendahara)
-- ==============================================================================
INSERT INTO public.struktur_pengurus (id, peran, inisial, siswa_id, tugas, urutan) VALUES
  (1, 'Ketua Rayon', 'KR', 8, ARRAY[
    'Memimpin dan mengkoordinir seluruh kegiatan anggota rayon Cisarua 3',
    'Menjadi penghubung utama antara anggota dengan Pembimbing Siswa (Guru / PS)',
    'Memimpin musyawarah, evaluasi mingguan, dan pembagian tugas rayon',
    'Bertanggung jawab penuh atas ketertiban, solidaritas, dan kedisiplinan rayon'
  ], 1),
  (2, 'Wakil Ketua', 'WK', 18, ARRAY[
    'Mendampingi dan membantu seluruh tanggung jawab ketua rayon',
    'Menggantikan posisi ketua rayon apabila berhalangan hadir',
    'Mengkoordinir kedisiplinan dan keikutsertaan program rayon',
    'Memastikan pelaksanaan program kerja pengurus berjalan dengan baik'
  ], 2),
  (3, 'Sekretaris', 'SK', 5, ARRAY[
    'Mencatat presensi, absensi, dan administrasi siswa rayon',
    'Mengurus dokumentasi, arsip laporan, dan surat-menyurat',
    'Membuat notulen dalam setiap evaluasi atau musyawarah rayon',
    'Membantu merekap laporan dari kotak keluhan rayon'
  ], 3),
  (4, 'Bendahara', 'BD', 1, ARRAY[
    'Mengelola keuangan dan uang kas rayon secara transparan dan tertib',
    'Mencatat seluruh rincian pemasukan, uang iuran, dan pengeluaran',
    'Membuat rekapitulasi laporan keuangan berkala',
    'Mengatur kebutuhan anggaran operasional dan sosial rayon'
  ], 4)
ON CONFLICT (id) DO UPDATE
SET peran = EXCLUDED.peran,
    inisial = EXCLUDED.inisial,
    siswa_id = EXCLUDED.siswa_id,
    tugas = EXCLUDED.tugas,
    urutan = EXCLUDED.urutan;

-- ==============================================================================
-- JADWAL PIKET SEED
-- ==============================================================================
INSERT INTO public.jadwal_piket (hari, day_index, siswa_id, urutan) VALUES
  -- Senin
  ('Senin', 1, 22, 1), ('Senin', 1, 23, 2), ('Senin', 1, 28, 3), ('Senin', 1, 29, 4),
  ('Senin', 1, 12, 5), ('Senin', 1, 6, 6), ('Senin', 1, 17, 7), ('Senin', 1, 18, 8),
  -- Selasa
  ('Selasa', 2, 1, 1), ('Selasa', 2, 3, 2), ('Selasa', 2, 5, 3), ('Selasa', 2, 7, 4),
  ('Selasa', 2, 8, 5), ('Selasa', 2, 10, 6), ('Selasa', 2, 14, 7),
  -- Rabu
  ('Rabu', 3, 25, 1), ('Rabu', 3, 31, 2), ('Rabu', 3, 34, 3), ('Rabu', 3, 4, 4),
  ('Rabu', 3, 9, 5), ('Rabu', 3, 13, 6), ('Rabu', 3, 16, 7),
  -- Kamis
  ('Kamis', 4, 20, 1), ('Kamis', 4, 24, 2), ('Kamis', 4, 27, 3), ('Kamis', 4, 30, 4),
  ('Kamis', 4, 32, 5), ('Kamis', 4, 33, 6), ('Kamis', 4, 36, 7),
  -- Jumat
  ('Jumat', 5, 21, 1), ('Jumat', 5, 26, 2), ('Jumat', 5, 35, 3), ('Jumat', 5, 2, 4),
  ('Jumat', 5, 11, 5), ('Jumat', 5, 15, 6), ('Jumat', 5, 19, 7);

-- ==============================================================================
-- PENDAFTARAN OTOMATIS SELURUH AKUN SISWA & GURU KE SUPABASE AUTH
-- Format Email: namalengkap@smkwikrama.sch.id
-- Password: NIS masing-masing siswa (Contoh: 12511108)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  r RECORD;
  v_email TEXT;
  v_clean_name TEXT;
  v_role TEXT;
  v_user_id UUID;
BEGIN
  -- Looping seluruh siswa
  FOR r IN SELECT * FROM public.siswa ORDER BY id ASC LOOP
    
    v_clean_name := lower(regexp_replace(r.nama, '[^a-zA-Z0-9]', '', 'g'));
    v_email := v_clean_name || '@smkwikrama.sch.id';

    -- Tentukan Role
    IF r.nis IN ('12511074', '12511108', '12611468', '12611831') THEN
      v_role := 'admin';
    ELSIF r.nis IN ('12511094', '12511415', '12510978', '12510816') THEN
      v_role := 'pengurus';
    ELSE
      v_role := 'siswa';
    END IF;

    SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();

      -- 1. Insert ke auth.users
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
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

      -- 2. Insert identitas auth: id bertipe UUID, provider_id bertipe TEXT
      INSERT INTO auth.identities (
        id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
      ) VALUES (
        gen_random_uuid(),
        v_user_id::text,
        v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email),
        'email',
        NOW(), NOW(), NOW()
      );
    ELSE
      UPDATE auth.users
      SET encrypted_password = crypt(r.nis, gen_salt('bf')),
          raw_user_meta_data = jsonb_build_object('nama', r.nama, 'nis', r.nis, 'role', v_role, 'siswa_id', r.id),
          updated_at = NOW()
      WHERE id = v_user_id;
    END IF;

    -- 3. Sync ke profiles
    INSERT INTO public.profiles (id, email, nama, nis, role, siswa_id)
    VALUES (v_user_id, v_email, r.nama, r.nis, v_role, r.id)
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        nama = EXCLUDED.nama,
        nis = EXCLUDED.nis,
        role = EXCLUDED.role,
        siswa_id = EXCLUDED.siswa_id;

  END LOOP;

  -- 4. DAFTARKAN AKUN GURU / PS
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
