import { supabase, isSupabaseConfigured } from "./supabaseClient";

export type KategoriInformasi =
  | "Penting"
  | "Kegiatan"
  | "Akademik"
  | "Kas & Keuangan"
  | "Piket & Kebersihan"
  | "Umum";

export interface InformasiRayonData {
  id: string;
  judul: string;
  kategori: KategoriInformasi;
  isi: string;
  tanggal: string; // YYYY-MM-DD (Tanggal terbit / mulai)
  berlaku_sampai?: string; // YYYY-MM-DD (Tanggal berakhir / kedaluwarsa, opsional)
  author_nama: string;
  author_role: "guru" | "pengurus" | "admin" | "siswa";
  is_pinned?: boolean;
  lampiran_url?: string;
  created_at?: string;
}

export function isInformasiActive(item: InformasiRayonData): boolean {
  if (!item.berlaku_sampai) return true;
  const now = new Date();
  const exp = new Date(item.berlaku_sampai + "T23:59:59");
  return exp.getTime() >= now.getTime();
}

const LOCAL_STORAGE_INFORMASI_KEY = "rayon_cisarua_3_informasi_list";

// Tidak ada data dummy — informasi diambil langsung dari database Supabase
export const initialInformasiList: InformasiRayonData[] = [];

export async function fetchAllInformasi(): Promise<InformasiRayonData[]> {
  let dbItems: InformasiRayonData[] = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("informasi_rayon")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("tanggal", { ascending: false });

      if (!error && data && data.length > 0) {
        dbItems = data.map((item: any) => ({
          id: String(item.id),
          judul: item.judul,
          kategori: item.kategori as KategoriInformasi,
          isi: item.isi,
          tanggal: item.tanggal,
          berlaku_sampai: item.berlaku_sampai || undefined,
          author_nama: item.author_nama,
          author_role: item.author_role,
          is_pinned: !!item.is_pinned,
          lampiran_url: item.lampiran_url || undefined,
          created_at: item.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch informasi error:", e);
    }
  }

  // Ambil data yang ditambah/diedit secara lokal (belum tersimpan ke DB)
  let localItems: InformasiRayonData[] = [];
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INFORMASI_KEY);
      if (saved) {
        const parsed: InformasiRayonData[] = JSON.parse(saved);
        // Hanya ambil item lokal yang bukan berasal dari data awal (id tidak diawali "00000000")
        localItems = parsed.filter((item) => !item.id.startsWith("00000000"));
      }
    } catch (e) {
      console.warn("LocalStorage parse informasi error:", e);
    }
  }

  // Gabungkan: DB sebagai sumber utama, lokal sebagai tambahan/override
  const combined = [...dbItems];

  localItems.forEach((local) => {
    const existingIdx = combined.findIndex((item) => item.id === local.id);
    if (existingIdx !== -1) {
      combined[existingIdx] = local;
    } else {
      combined.unshift(local);
    }
  });

  return combined.sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });
}

export async function saveNewInformasi(
  item: Omit<InformasiRayonData, "id" | "created_at">
): Promise<InformasiRayonData> {
  const newId = "info-" + Date.now();
  const newItem: InformasiRayonData = {
    ...item,
    id: newId,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("informasi_rayon")
        .insert({
          judul: newItem.judul,
          kategori: newItem.kategori,
          isi: newItem.isi,
          tanggal: newItem.tanggal,
          berlaku_sampai: newItem.berlaku_sampai || null,
          author_nama: newItem.author_nama,
          author_role: newItem.author_role,
          is_pinned: newItem.is_pinned || false,
          lampiran_url: newItem.lampiran_url || null,
        })
        .select()
        .single();

      if (!error && data) {
        newItem.id = String(data.id);
      }
    } catch (e) {
      console.warn("Supabase insert informasi error:", e);
    }
  }

  // Simpan ke localStorage
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INFORMASI_KEY);
      const list: InformasiRayonData[] = saved ? JSON.parse(saved) : [...initialInformasiList];
      list.unshift(newItem);
      localStorage.setItem(LOCAL_STORAGE_INFORMASI_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("LocalStorage save informasi error:", e);
    }
  }

  return newItem;
}

export async function updateInformasi(
  item: InformasiRayonData
): Promise<InformasiRayonData> {
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from("informasi_rayon")
        .update({
          judul: item.judul,
          kategori: item.kategori,
          isi: item.isi,
          tanggal: item.tanggal,
          berlaku_sampai: item.berlaku_sampai || null,
          author_nama: item.author_nama,
          is_pinned: item.is_pinned,
          lampiran_url: item.lampiran_url || null,
        })
        .eq("id", item.id);
    } catch (e) {
      console.warn("Supabase update informasi error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INFORMASI_KEY);
      let list: InformasiRayonData[] = saved ? JSON.parse(saved) : [];
      const idx = list.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        list[idx] = item;
      } else {
        list.push(item);
      }
      localStorage.setItem(LOCAL_STORAGE_INFORMASI_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("LocalStorage update informasi error:", e);
    }
  }

  return item;
}

export async function deleteInformasi(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    try {
      await supabase.from("informasi_rayon").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete informasi error:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_INFORMASI_KEY);
      if (saved) {
        const list: InformasiRayonData[] = JSON.parse(saved);
        const filtered = list.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_STORAGE_INFORMASI_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn("LocalStorage delete informasi error:", e);
    }
  }

  return true;
}
