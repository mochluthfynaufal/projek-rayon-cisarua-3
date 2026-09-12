"use client"
import { useState } from "react"
import { CheckCircle, ChevronDown, ChevronUp, Flag, CalendarDays } from "lucide-react"

interface EventSejarah {
  id: number
  periode: string     // PLACEHOLDER
  judul: string
  deskripsi: string
  dampak: string
  status: "lampau" | "berjalan" | "mendatang"
  detail: string[]    // PLACEHOLDER
}

// PLACEHOLDER — Sesuaikan semua tanggal, judul, dan detail sejarah kelas di bawah
const sejarahKelas: EventSejarah[] = [
  {
    id: 1,
    periode: "Juli 2022",        // PLACEHOLDER
    judul: "MPLS — Hari Pertama",
    deskripsi: "Masa Pengenalan Lingkungan Sekolah menjadi awal mula kebersamaan seluruh angkatan di SMK Wikrama Bogor.",
    dampak: "Angkatan baru resmi terbentuk",
    status: "lampau",
    detail: [
      "Perkenalan antar siswa baru dari berbagai daerah",  // PLACEHOLDER
      "Orientasi fasilitas dan lingkungan sekolah",         // PLACEHOLDER
      "Pembentukan kepengurusan kelas perdana",             // PLACEHOLDER
    ],
  },
  {
    id: 2,
    periode: "Jan – Jun 2023",   // PLACEHOLDER
    judul: "Kelas X — Aktif Belajar",
    deskripsi: "Menjalani semester aktif dengan materi dasar kejuruan dan membangun karakter serta kedisiplinan sebagai siswa SMK.",
    dampak: "Kompetensi dasar terbentuk",
    status: "lampau",
    detail: [
      "Penilaian Akhir Semester 1 & 2",     // PLACEHOLDER
      "Praktikum dasar kejuruan pertama",    // PLACEHOLDER
      "Lomba tingkat sekolah diikuti",       // PLACEHOLDER
    ],
  },
  {
    id: 3,
    periode: "Juli 2023",        // PLACEHOLDER
    judul: "Kenaikan ke Kelas XI",
    deskripsi: "Seluruh siswa berhasil naik kelas dan menyambut tahun ajaran baru dengan semangat yang lebih tinggi.",
    dampak: "Seluruh siswa naik kelas",
    status: "lampau",
    detail: [
      "Laporan hasil belajar memuaskan",         // PLACEHOLDER
      "Kepengurusan Kelas XI baru dilantik",     // PLACEHOLDER
      "Angkatan baru Kelas X diterima",          // PLACEHOLDER
    ],
  },
  {
    id: 4,
    periode: "2023 – 2024",      // PLACEHOLDER
    judul: "Kelas XI — Materi Produktif",
    deskripsi: "Pendalaman kompetensi kejuruan yang lebih intensif, disertai persiapan matang menuju Praktik Kerja Lapangan.",
    dampak: "Siap terjun ke industri",
    status: "berjalan",
    detail: [
      "Praktik jaringan komputer & pemrograman",   // PLACEHOLDER
      "Kunjungan industri ke perusahaan IT",        // PLACEHOLDER
      "Pembuatan portofolio dan CV siswa",          // PLACEHOLDER
    ],
  },
  {
    id: 5,
    periode: "2024 – 2025",      // PLACEHOLDER
    judul: "Kelas XII — Praktik Kerja Lapangan",
    deskripsi: "Angkatan senior menjalani PKL di berbagai perusahaan dan instansi mitra untuk mengaplikasikan ilmu di lapangan.",
    dampak: "Pengalaman kerja nyata diraih",
    status: "berjalan",
    detail: [
      "Penempatan di perusahaan IT dan instansi mitra",   // PLACEHOLDER
      "Penulisan laporan jurnal harian PKL",               // PLACEHOLDER
      "Sidang dan evaluasi akhir PKL",                     // PLACEHOLDER
    ],
  },
  {
    id: 6,
    periode: "2025",             // PLACEHOLDER
    judul: "Wisuda & Kelulusan",
    deskripsi: "Puncak perjalanan — upacara wisuda dan pelepasan angkatan sebagai alumni SMK Wikrama Bogor yang siap berkarya.",
    dampak: "Alumni SMK Wikrama Bogor lahir",
    status: "mendatang",
    detail: [
      "Ujian Kompetensi Keahlian (UKK)",     // PLACEHOLDER
      "Upacara wisuda akbar",                 // PLACEHOLDER
      "Pelepasan menuju dunia kerja & kuliah",// PLACEHOLDER
    ],
  },
]

const statusStyle = {
  lampau:    { dot: "bg-green-500",  ring: "ring-green-200",  label: "Selesai",     labelBg: "bg-green-100 text-green-700" },
  berjalan:  { dot: "bg-yellow-500", ring: "ring-yellow-200", label: "Berlangsung", labelBg: "bg-yellow-100 text-yellow-700" },
  mendatang: { dot: "bg-gray-400",   ring: "ring-gray-200",   label: "Mendatang",   labelBg: "bg-gray-100 text-gray-600" },
}

export default function EcoTimeline() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Linimasa</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Sejarah Kelas Kami</h2>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-10 text-sm">
          {Object.entries(statusStyle).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
              <span className="text-gray-600">{val.label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-300" />

          <div className="space-y-8">
            {sejarahKelas.map((ev) => {
              const st = statusStyle[ev.status]
              const isExpanded = expanded === ev.id
              return (
                <div key={ev.id} className="relative flex items-start gap-6 pl-0">
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex-shrink-0 mt-4 ml-0.5 w-9 h-9 rounded-full ${st.dot} ring-4 ${st.ring} flex items-center justify-center shadow-sm`}>
                    {ev.status === "lampau"
                      ? <CheckCircle className="w-4 h-4 text-white" />
                      : ev.status === "berjalan"
                      ? <CalendarDays className="w-4 h-4 text-white" />
                      : <Flag className="w-4 h-4 text-white" />
                    }
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Header */}
                    <button
                      className="w-full text-left p-5 flex items-start justify-between gap-4"
                      onClick={() => setExpanded(isExpanded ? null : ev.id)}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs text-gray-400 font-medium">{ev.periode}</span> {/* PLACEHOLDER */}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.labelBg}`}>
                            {st.label}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">{ev.judul}</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{ev.deskripsi}</p>
                      </div>
                      <div className="flex-shrink-0 mt-1 text-gray-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100 pt-4 bg-gray-50">
                        <p className="text-xs font-semibold text-yellow-700 mb-3 uppercase tracking-wide">Detail Peristiwa</p>
                        <ul className="space-y-2">
                          {ev.detail.map((d, di) => ( // PLACEHOLDER
                            <li key={di} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2">
                          <Flag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Dampak: <span className="font-semibold text-gray-700">{ev.dampak}</span></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
