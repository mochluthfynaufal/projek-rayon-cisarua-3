import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { daftarSiswa } from "./siswaData";

export interface PrestasiData {
  id: string;
  siswa_id?: number;
  author_nama: string;
  nis?: string;
  jurusan?: string;
  angkatan?: string;
  nama: string; // Nama prestasi / lomba
  juara: string; // "Juara 1", "Juara 2", "Juara 3", "Harapan 1", "Gold Medal", dll
  tingkat: "Sekolah" | "Kecamatan" | "Kabupaten/Kota" | "Provinsi" | "Nasional" | "Internasional";
  penyelenggara?: string;
  tanggal: string; // YYYY-MM-DD
  deskripsi?: string;
  foto_url?: string; // Foto sertifikat / piagam / piala
  created_at?: string;
}

export interface GaleriData {
  id: string;
  judul: string;
  kategori: "Kegiatan Rayon" | "Dokumentasi Rayon" | "Acara Sekolah" | "Kebersamaan" | "Prestasi & Lomba";
  deskripsi?: string;
  foto_url: string;
  tanggal: string; // YYYY-MM-DD
  author_nama: string;
  created_by_role?: string;
  created_at?: string;
}

const LOCAL_STORAGE_PRESTASI_KEY = "rayon_cisarua_3_prestasi_list";
const LOCAL_STORAGE_GALERI_KEY = "rayon_cisarua_3_galeri_list";

// Data Awal Kosong (Tanpa Dummy Data)
export const initialPrestasiList: PrestasiData[] = [];
export const initialGaleriList: GaleriData[] = [];

// ==========================================
// PRESTASI HELPER FUNCTIONS
// ==========================================

export async function fetchAllPrestasi(): Promise<PrestasiData[]> {
  let dbItems: PrestasiData[] = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("prestasi")
        .select("*, siswa(nama, nis, jurusan, angkatan)")
        .order("tanggal", { ascending: false });

      if (!error && data && data.length > 0) {
        dbItems = data.map((item: any) => ({
          id: String(item.id),
          siswa_id: item.siswa_id,
          author_nama: item.siswa?.nama || item.author_nama || "Siswa Cisarua 3",
          nis: item.siswa?.nis || item.nis || "",
          jurusan: item.siswa?.jurusan || item.jurusan || "",
          angkatan: item.siswa?.angkatan || item.angkatan || "",
          nama: item.nama,
          juara: item.juara,
          tingkat: item.tingkat,
          penyelenggara: item.penyelenggara || "",
          tanggal: item.tanggal,
          deskripsi: item.deskripsi || "",
          foto_url: item.foto_url || "",
          created_at: item.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch prestasi error:", e);
    }
  }

  // Ambil dari localStorage (filter dummy lama jika ada)
  let localItems: PrestasiData[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESTASI_KEY);
      if (saved) {
        const parsed: PrestasiData[] = JSON.parse(saved);
        localItems = parsed.filter((item) => !["pres-1", "pres-2", "pres-3", "pres-4"].includes(item.id));
      }
    } catch (e) {
      console.warn("LocalStorage parse prestasi error:", e);
    }
  }

  const combined = [...dbItems];
  localItems.forEach((local) => {
    if (!combined.some((item) => item.id === local.id)) {
      combined.push(local);
    }
  });

  return combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
}

export async function saveNewPrestasi(newItem: Omit<PrestasiData, "id">): Promise<PrestasiData> {
  const generatedId = "pres-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const createdItem: PrestasiData = {
    ...newItem,
    id: generatedId,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("prestasi")
        .insert({
          siswa_id: newItem.siswa_id,
          nama: newItem.nama,
          juara: newItem.juara,
          tingkat: newItem.tingkat,
          tanggal: newItem.tanggal,
          penyelenggara: newItem.penyelenggara || null,
          deskripsi: newItem.deskripsi || null,
          foto_url: newItem.foto_url || null,
        })
        .select()
        .single();

      if (!error && data) {
        createdItem.id = String(data.id);
      }
    } catch (e) {
      console.warn("Supabase save prestasi error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESTASI_KEY);
      const list: PrestasiData[] = saved ? JSON.parse(saved) : [];
      list.unshift(createdItem);
      localStorage.setItem(LOCAL_STORAGE_PRESTASI_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("LocalStorage save prestasi error:", e);
    }
  }

  return createdItem;
}

export async function removePrestasi(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("prestasi").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete prestasi error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PRESTASI_KEY);
      if (saved) {
        const list: PrestasiData[] = JSON.parse(saved);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_PRESTASI_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("LocalStorage delete prestasi error:", e);
    }
  }
}

// ==========================================
// GALERI HELPER FUNCTIONS
// ==========================================

export async function fetchAllGaleri(): Promise<GaleriData[]> {
  let dbItems: GaleriData[] = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("galeri")
        .select("*")
        .order("tanggal", { ascending: false });

      if (!error && data && data.length > 0) {
        dbItems = data.map((item: any) => ({
          id: String(item.id),
          judul: item.judul,
          kategori: item.kategori,
          deskripsi: item.deskripsi || "",
          foto_url: item.foto_url,
          tanggal: item.tanggal,
          author_nama: item.author_nama || "Pengurus Rayon",
          created_by_role: item.created_by_role || "pengurus",
          created_at: item.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch galeri error:", e);
    }
  }

  // Ambil dari localStorage (filter dummy lama jika ada)
  let localItems: GaleriData[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALERI_KEY);
      if (saved) {
        const parsed: GaleriData[] = JSON.parse(saved);
        localItems = parsed.filter((item) => !["gal-1", "gal-2", "gal-3", "gal-4", "gal-5"].includes(item.id));
      }
    } catch (e) {
      console.warn("LocalStorage parse galeri error:", e);
    }
  }

  const combined = [...dbItems];
  localItems.forEach((local) => {
    if (!combined.some((item) => item.id === local.id)) {
      combined.push(local);
    }
  });

  return combined.sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
}

export async function saveNewGaleri(newItem: Omit<GaleriData, "id">): Promise<GaleriData> {
  const generatedId = "gal-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
  const createdItem: GaleriData = {
    ...newItem,
    id: generatedId,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("galeri")
        .insert({
          judul: newItem.judul,
          kategori: newItem.kategori,
          deskripsi: newItem.deskripsi || null,
          foto_url: newItem.foto_url,
          tanggal: newItem.tanggal,
          author_nama: newItem.author_nama,
        })
        .select()
        .single();

      if (!error && data) {
        createdItem.id = String(data.id);
      }
    } catch (e) {
      console.warn("Supabase save galeri error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALERI_KEY);
      const list: GaleriData[] = saved ? JSON.parse(saved) : [];
      list.unshift(createdItem);
      localStorage.setItem(LOCAL_STORAGE_GALERI_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("LocalStorage save galeri error:", e);
    }
  }

  return createdItem;
}

export async function removeGaleri(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("galeri").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete galeri error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALERI_KEY);
      if (saved) {
        const list: GaleriData[] = JSON.parse(saved);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_GALERI_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("LocalStorage delete galeri error:", e);
    }
  }
}
