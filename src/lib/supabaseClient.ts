import { createClient } from "@supabase/supabase-js";

// Mengambil dari .env dengan fallback kredensial project Supabase Anda
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://aersamndejvkgdtvwqng.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_GRH-c2AK610_t1DvfzOMxQ_25Etlgvl";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your-project-id") &&
  !supabaseAnonKey.includes("your-anon-key-here")
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
