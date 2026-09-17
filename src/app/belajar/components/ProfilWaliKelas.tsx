import {
  BookOpen,
  Users,
  GraduationCap,
  School,
  ClipboardList,
  Quote,
} from "lucide-react";

// Info Pembimbing Rayon & Rayon Cisarua 3
const profilData = {
  namaSekolah: "SMK Wikrama Bogor",
  namaRayon: "Cisarua 3",
  tahunAjaran: "2025/2026",
  jurusan: "Teknik Komputer dan Jaringan",
  waliKelas: {
    nama: "Mohamad Rizal, S.Pd.",
    nip: "197801012005011001",
    jabatan: "Pembimbing Siswa (PS) Rayon Cisarua 3",
    motivasi:
      '"Jadilah siswa yang tidak hanya cerdas secara akademik, tetapi juga kuat dalam karakter dan semangat kebersamaan. Kalian adalah kebanggaan saya dan SMK Wikrama Bogor."',
  },
  angkatanAktif: [
    { kelas: "Kelas X", status: "Aktif", jumlah: 36, ikon: "📚" },
    { kelas: "Kelas XI", status: "Aktif", jumlah: 34, ikon: "🎯" },
    { kelas: "Kelas XII", status: "PKL", jumlah: 33, ikon: "💼" },
  ],
  bentoItems: [
    {
      label: "Program Keahlian",
      nilai: "TKJ",
      sub: "Teknik Komputer dan Jaringan",
      ikon: School,
      warna: { bg: "bg-yellow-50", border: "border-yellow-200", ikonBg: "bg-yellow-500" },
    },
    {
      label: "Semangat Rayon",
      nilai: "Solid",
      sub: "Satu rayon, satu keluarga yang saling mendukung dan berprestasi bersama",
      ikon: Users,
      warna: { bg: "bg-blue-50", border: "border-blue-200", ikonBg: "bg-blue-600" },
    },
    {
      label: "Kegiatan Unggulan",
      nilai: "Aktif",
      sub: "Praktikum, lomba kompetensi, dan berbagai kegiatan akademik",
      ikon: ClipboardList,
      warna: { bg: "bg-green-50", border: "border-green-200", ikonBg: "bg-green-600" },
    },
    {
      label: "Tahun Ajaran",
      nilai: "2025/26",
      sub: "Aktif belajar di SMK Wikrama Bogor tahun ini",
      ikon: BookOpen,
      warna: { bg: "bg-purple-50", border: "border-purple-200", ikonBg: "bg-purple-600" },
    },
  ],
};

export default function Pendahuluan() {
  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto space-y-14">
        {/* ── Section Label ── */}
        <div className="text-center">
          <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Pembimbing Siswa
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            Mengenal Pembimbing Rayon Kami
          </h2>
          <p className="text-gray-500 text-base max-w-lg mx-auto">
            Mengenal pendamping yang senantiasa membimbing dan mengarahkan rayon kami menuju keberhasilan.
          </p>
        </div>

        {/* ── Kartu Pembimbing Siswa ── */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
          <div className="flex flex-col sm:flex-row items-start gap-8">
            {/* Kiri — Foto/Avatar kotak dengan badge */}
            <div className="relative flex-shrink-0">
              <div className="w-40 h-48 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                <GraduationCap className="w-20 h-20 text-yellow-600 opacity-60" />
              </div>
              {/* Badge di bawah foto */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <span className="inline-block bg-yellow-500 text-slate-900 text-[11px] font-extrabold px-4 py-1.5 rounded-full shadow uppercase tracking-wide whitespace-nowrap">
                  Pembimbing Siswa
                </span>
              </div>
            </div>

            {/* Kanan — Nama, jabatan, quote */}
            <div className="flex-1 pt-2">
              <h3 className="text-2xl font-extrabold text-slate-800 mb-1">
                {profilData.waliKelas.nama}
              </h3>
              <p className="text-yellow-600 font-semibold text-sm mb-5">
                {profilData.waliKelas.jabatan} &nbsp;·&nbsp; NIP. {profilData.waliKelas.nip}
              </p>

              {/* Kotak Quote */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                <Quote className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  {profilData.waliKelas.motivasi}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
