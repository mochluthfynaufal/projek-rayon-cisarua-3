"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Search, Filter, Users, ChevronDown, GraduationCap,
  X, Trophy, Star, MapPin, Calendar, User, BookOpen,
} from "lucide-react";
import { daftarSiswa, type Jabatan, type Angkatan, type Siswa } from "@/lib/siswaData";

// ─── Types (sama dengan ProfilSiswa) ─────────────────────────────────────────
interface Prestasi {
  id: string;
  juara: string;
  tingkat: string;
  nama: string;
  tanggal: string;
}
interface ProfilData { bio: string; prestasi: Prestasi[] }

function loadProfil(id: number): ProfilData {
  if (typeof window === "undefined") return { bio: "", prestasi: [] };
  try {
    const raw = localStorage.getItem(`siswa_profil_${id}`);
    if (raw) return JSON.parse(raw) as ProfilData;
  } catch { /* ignore */ }
  return { bio: "", prestasi: [] };
}

const juaraColor = (j: string) => {
  if (j.includes("1")) return "from-yellow-400 to-amber-500";
  if (j.includes("2")) return "from-gray-300 to-gray-400";
  if (j.includes("3")) return "from-orange-400 to-amber-600";
  return "from-indigo-400 to-indigo-500";
};

// ─── Lookup maps ──────────────────────────────────────────────────────────────
const jabatanColors: Record<Jabatan, string> = {
  "Ketua":       "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Wakil Ketua": "bg-blue-100   text-blue-800   border-blue-300",
  "Sekretaris":  "bg-green-100  text-green-800  border-green-300",
  "Bendahara":   "bg-purple-100 text-purple-800 border-purple-300",
  "Anggota":     "bg-gray-100   text-gray-700   border-gray-300",
};

// ─── Sistem Warna Berdasarkan Tahun Angkatan (Siklis) ─────────────────────────
// Urutan: Biru → Pink → Kuning → Biru → Pink → Kuning → ...
// Alumni selalu Abu-abu
const ANGKATAN_COLOR_CYCLE = [
  // Biru
  {
    badge: "bg-blue-50 text-blue-700",
    border: "border-blue-200",
    hover: "hover:border-blue-400",
    glow: "hover:shadow-blue-100",
    text: "text-blue-600",
    avatar: "bg-blue-600",
  },
  // Pink
  {
    badge: "bg-pink-50 text-pink-700",
    border: "border-pink-200",
    hover: "hover:border-pink-400",
    glow: "hover:shadow-pink-100",
    text: "text-pink-600",
    avatar: "bg-pink-600",
  },
  // Kuning
  {
    badge: "bg-yellow-50 text-yellow-700",
    border: "border-yellow-200",
    hover: "hover:border-yellow-400",
    glow: "hover:shadow-yellow-100",
    text: "text-yellow-600",
    avatar: "bg-yellow-500",
  },
] as const;

const ALUMNI_COLOR = {
  badge: "bg-gray-100 text-gray-600",
  border: "border-gray-200",
  hover: "hover:border-gray-400",
  glow: "hover:shadow-gray-100",
  text: "text-gray-500",
  avatar: "bg-gray-500",
} as const;

// Kumpulkan semua tahun angkatan unik (non-alumni), urutkan ascending
const uniqueTahunAngkatan = [...new Set(
  daftarSiswa
    .filter(s => s.angkatan !== "Alumni")
    .map(s => s.tahunAngkatan)
)].sort();

// Map tahun angkatan → warna
const tahunAngkatanColorMap = new Map(
  uniqueTahunAngkatan.map((tahun, idx) => [tahun, ANGKATAN_COLOR_CYCLE[idx % ANGKATAN_COLOR_CYCLE.length]])
);

function getAngkatanColor(siswa: { angkatan: Angkatan; tahunAngkatan: string }) {
  if (siswa.angkatan === "Alumni") return ALUMNI_COLOR;
  return tahunAngkatanColorMap.get(siswa.tahunAngkatan) ?? ANGKATAN_COLOR_CYCLE[0];
}

const jabatanOptions: Jabatan[] = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Anggota"];
const angkatanOptions: Angkatan[] = ["Kelas X", "Kelas XI", "Kelas XII (PKL)", "Alumni"];

// ─── Modal Profil Siswa ───────────────────────────────────────────────────────
function ModalProfil({ siswa, onClose }: { siswa: Siswa; onClose: () => void }) {
  const [profil, setProfil] = useState<ProfilData>({ bio: "", prestasi: [] });

  useEffect(() => {
    setProfil(loadProfil(siswa.id));
    // Tutup dengan Escape
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [siswa.id, onClose]);

  const angkColor = getAngkatanColor(siswa);
  const formatTanggal = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  const sortedPrestasi = [...profil.prestasi].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative rounded-t-3xl flex-shrink-0">
          <div
            className="absolute inset-0 opacity-20 rounded-t-3xl"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          {/* Tombol tutup */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Avatar */}
          <div className={`absolute -bottom-9 left-5 w-18 h-18 w-[72px] h-[72px] ${angkColor.avatar} rounded-2xl flex items-center justify-center shadow-xl border-4 border-white`}>
            {siswa.angkatan === "Alumni"
              ? <GraduationCap className="w-8 h-8 text-white" />
              : <span className="text-white font-extrabold text-xl">{siswa.inisial}</span>
            }
          </div>
        </div>

        {/* Konten */}
        <div className="px-5 pt-14 pb-6">

          {/* Nama + NIS */}
          <div className="mb-3">
            <h2 className="text-lg font-bold text-slate-800 leading-tight">{siswa.nama}</h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5">NIS: {siswa.nis}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-0.5">Jabatan</p>
              <p className="text-xs font-bold text-slate-700">{siswa.jabatan}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-0.5">Kelas</p>
              <p className="text-xs font-bold text-slate-700">{siswa.angkatan}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 mb-0.5">Angkatan</p>
              <p className="text-xs font-bold text-slate-700">{siswa.tahunAngkatan}</p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${jabatanColors[siswa.jabatan]}`}>
              {siswa.jabatan}
            </span>
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${angkColor.badge}`}>
              {siswa.angkatan === "Alumni" ? "Alumni" : "Aktif"}
            </span>
          </div>

          {/* Bio */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 mb-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              <User className="w-3 h-3" /> Bio
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {profil.bio
                ? profil.bio
                : <span className="italic text-gray-400 text-xs">Siswa ini belum menambahkan bio.</span>
              }
            </p>
          </div>

          {/* Daftar Kejuaraan */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              <Trophy className="w-3 h-3" /> Daftar Kejuaraan ({sortedPrestasi.length})
            </div>

            {sortedPrestasi.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100">
                <Trophy className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Belum ada prestasi tercatat.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedPrestasi.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-3">
                    {/* Medal */}
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${juaraColor(p.juara)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.nama}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                          {p.juara}
                        </span>
                        <span className="text-[10px] text-gray-500 flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> Tingkat {p.tingkat}
                        </span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Calendar className="w-2.5 h-2.5" /> {formatTanggal(p.tanggal)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DaftarSiswa() {
  const [search, setSearch]               = useState("");
  const [filterJabatan, setFilterJabatan] = useState<Jabatan | "Semua">("Semua");
  const [filterAngkatan, setFilterAngkatan] = useState<Angkatan | "Semua">("Semua");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState<Siswa | null>(null);

  const LIMIT = 20;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return daftarSiswa
      .filter(s => {
        const matchSearch   = s.nama.toLowerCase().includes(q) || s.nis.includes(q);
        const matchJabatan  = filterJabatan  === "Semua" || s.jabatan  === filterJabatan;
        const matchAngkatan = filterAngkatan === "Semua" || s.angkatan === filterAngkatan;
        return matchSearch && matchJabatan && matchAngkatan;
      })
      .sort((a, b) => {
        const aIsAlumni = a.angkatan === "Alumni" ? 1 : 0;
        const bIsAlumni = b.angkatan === "Alumni" ? 1 : 0;
        if (aIsAlumni !== bIsAlumni) return aIsAlumni - bIsAlumni;
        return a.nama.localeCompare(b.nama, "id");
      });
  }, [search, filterJabatan, filterAngkatan]);

  const displayed = showAll ? filtered : filtered.slice(0, LIMIT);

  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Siswa</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Daftar Siswa Aktif</h2>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau NIS siswa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterJabatan}
              onChange={e => setFilterJabatan(e.target.value as Jabatan | "Semua")}
              className="pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer min-w-[160px]"
            >
              <option value="Semua">Semua Jabatan</option>
              {jabatanOptions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={filterAngkatan}
              onChange={e => setFilterAngkatan(e.target.value as Angkatan | "Semua")}
              className="pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer min-w-[190px]"
            >
              <option value="Semua">Semua Angkatan</option>
              {angkatanOptions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {/* Result Count */}
        <p className="text-sm text-gray-500 mb-5">
          Menampilkan <span className="font-bold text-slate-700">{filtered.length}</span> dari {daftarSiswa.length} siswa
          <span className="ml-2 text-xs text-gray-400">· Klik kartu untuk lihat profil</span>
        </p>

        {/* ID Card Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Tidak ada siswa yang sesuai dengan pencarian atau filter ini.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayed.map(siswa => (
                <button
                  key={siswa.id}
                  onClick={() => setSelected(siswa)}
                  className={`bg-white border-2 ${getAngkatanColor(siswa).border} ${getAngkatanColor(siswa).hover} ${getAngkatanColor(siswa).glow} rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer`}
                >
                  {/* Avatar */}
                  <div className={`w-14 h-14 ${getAngkatanColor(siswa).avatar} rounded-full flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    {siswa.angkatan === "Alumni"
                      ? <GraduationCap className="w-7 h-7 text-white" />
                      : <span className="text-white font-extrabold text-base">{siswa.inisial}</span>
                    }
                  </div>

                  {/* Nama */}
                  <h4 className="font-bold text-slate-800 text-xs leading-tight mb-0.5 line-clamp-2">
                    {siswa.nama}
                  </h4>

                  {/* NIS */}
                  <p className="text-[10px] text-gray-400 font-mono mb-3">NIS. {siswa.nis}</p>

                  {siswa.angkatan === "Alumni" ? (
                    <>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-gray-100 text-gray-600 border-gray-300 mb-1">
                        Alumni
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1">{siswa.tahunAngkatan}</span>
                    </>
                  ) : (
                    <>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${jabatanColors[siswa.jabatan]}`}>
                        {siswa.jabatan}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getAngkatanColor(siswa).badge}`}>
                        {siswa.angkatan}
                      </span>
                      <span className="text-[9px] text-gray-400 mt-1">{siswa.tahunAngkatan}</span>
                    </>
                  )}

                  {/* Hint lihat profil */}
                  <span className={`mt-2 text-[9px] ${getAngkatanColor(siswa).text} font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    Lihat Profil →
                  </span>
                </button>
              ))}
            </div>

            {/* Tombol See More */}
            {filtered.length > LIMIT && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-gray-50 hover:border-yellow-400 hover:text-yellow-700 transition-all duration-200 shadow-sm"
                >
                  {showAll ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 15l-6-6-6 6"/></svg>
                      Sembunyikan
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6"/></svg>
                      Lihat Semua ({filtered.length - LIMIT} lainnya)
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Profil */}
      {selected && (
        <ModalProfil siswa={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
