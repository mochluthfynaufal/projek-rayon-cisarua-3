"use client"
import { useState } from "react"
import { GraduationCap, Search, Filter, Briefcase, BookOpen, TrendingUp, ChevronDown, ChevronUp, Quote } from "lucide-react"

interface Alumni {
  id: number
  nama: string         // PLACEHOLDER
  jurusan: string      // PLACEHOLDER
  tahunLulus: number   // PLACEHOLDER
  status: "Bekerja" | "Kuliah" | "Wirausaha"
  tempat: string       // PLACEHOLDER — nama perusahaan/kampus
  testimoni: string    // PLACEHOLDER
  inisial: string      // Inisial nama untuk avatar
  warnaAvatar: string
}

// PLACEHOLDER — Sesuaikan semua data alumni dengan data asli
const daftarAlumni: Alumni[] = [
  {
    id: 1, nama: "Alumni A", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2023, status: "Bekerja",
    tempat: "PT. Teknologi Maju Indonesia", // PLACEHOLDER
    testimoni: "Ilmu dan pengalaman PKL di SMK Wikrama memudahkan saya beradaptasi dengan cepat di dunia kerja nyata.", // PLACEHOLDER
    inisial: "A", warnaAvatar: "bg-yellow-500",
  },
  {
    id: 2, nama: "Alumni B", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2023, status: "Kuliah",
    tempat: "Universitas Negeri Jakarta — Teknik Informatika", // PLACEHOLDER
    testimoni: "SMK Wikrama membekali saya dengan kompetensi teknis yang membuat saya siap bersaing di perguruan tinggi.", // PLACEHOLDER
    inisial: "B", warnaAvatar: "bg-blue-600",
  },
  {
    id: 3, nama: "Alumni C", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2024, status: "Wirausaha",
    tempat: "Usaha Jasa Komputer & Jaringan Mandiri", // PLACEHOLDER
    testimoni: "Berkat keterampilan yang saya bangun di SMK, kini saya bisa membuka usaha sendiri dan melayani banyak pelanggan.", // PLACEHOLDER
    inisial: "C", warnaAvatar: "bg-green-600",
  },
  {
    id: 4, nama: "Alumni D", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2024, status: "Bekerja",
    tempat: "Instansi Pemerintah — Dinas Kominfo", // PLACEHOLDER
    testimoni: "Wali kelas dan guru-guru di SMK Wikrama selalu mendorong kami untuk menjadi yang terbaik. Sangat berterima kasih!", // PLACEHOLDER
    inisial: "D", warnaAvatar: "bg-purple-600",
  },
  {
    id: 5, nama: "Alumni E", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2023, status: "Kuliah",
    tempat: "Politeknik Negeri Jakarta — D3 Sistem Informasi", // PLACEHOLDER
    testimoni: "Nilai-nilai disiplin dan kebersamaan yang ditanamkan di kelas sangat membantu saya di kehidupan kampus.", // PLACEHOLDER
    inisial: "E", warnaAvatar: "bg-rose-600",
  },
  {
    id: 6, nama: "Alumni F", jurusan: "Teknik Komputer dan Jaringan",
    tahunLulus: 2024, status: "Bekerja",
    tempat: "Startup Teknologi — Bidang Pengembangan Web", // PLACEHOLDER
    testimoni: "Pengalaman belajar di kelas yang solid dan suportif membuat saya percaya diri terjun ke industri teknologi.", // PLACEHOLDER
    inisial: "F", warnaAvatar: "bg-slate-700",
  },
]

const statusConfig = {
  Bekerja:   { ikon: Briefcase,   bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
  Kuliah:    { ikon: BookOpen,    bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500" },
  Wirausaha: { ikon: TrendingUp,  bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
}

const tahunOptions = ["Semua", ...Array.from(new Set(daftarAlumni.map(a => `${a.tahunLulus}`))).sort()]
const statusOptions = ["Semua", "Bekerja", "Kuliah", "Wirausaha"]

export default function InteractiveMap() {
  const [search, setSearch]     = useState("")
  const [tahun, setTahun]       = useState("Semua")
  const [status, setStatus]     = useState("Semua")
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = daftarAlumni.filter(a => {
    const matchSearch = a.nama.toLowerCase().includes(search.toLowerCase()) ||
                        a.tempat.toLowerCase().includes(search.toLowerCase())
    const matchTahun  = tahun === "Semua" || `${a.tahunLulus}` === tahun
    const matchStatus = status === "Semua" || a.status === status
    return matchSearch && matchTahun && matchStatus
  })

  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Lulusan</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Alumni Kelas Kami</h2>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Alumni", nilai: daftarAlumni.length, warna: "text-slate-800" },
            { label: "Bekerja", nilai: daftarAlumni.filter(a => a.status === "Bekerja").length, warna: "text-green-700" },
            { label: "Kuliah / Wirausaha", nilai: daftarAlumni.filter(a => a.status !== "Bekerja").length, warna: "text-blue-700" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-center">
              <p className={`text-2xl font-extrabold ${s.warna}`}>{s.nilai}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama alumni..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Filter Tahun */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Tahun Lulus</p>
              </div>
              <div className="space-y-1">
                {tahunOptions.map(t => (
                  <button key={t} onClick={() => setTahun(t)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      tahun === t ? "bg-yellow-500 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    {t === "Semua" ? "Semua Angkatan" : `Lulusan ${t}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Status</p>
              </div>
              <div className="space-y-1">
                {statusOptions.map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      status === s ? "bg-yellow-500 text-white font-semibold" : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    {s === "Semua" ? "Semua Status" : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alumni List */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-sm text-gray-500 mb-2">{filtered.length} alumni ditemukan</p>

            {filtered.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
                <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Tidak ada alumni yang sesuai dengan filter ini.</p>
              </div>
            )}

            {filtered.map(alumni => {
              const cfg = statusConfig[alumni.status]
              const StatusIkon = cfg.ikon
              const isOpen = expanded === alumni.id
              return (
                <div key={alumni.id}
                  className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md ${
                    isOpen ? "border-yellow-300" : "border-gray-200"
                  }`}
                >
                  {/* Card Header */}
                  <button
                    className="w-full text-left bg-white px-6 py-5 flex items-center gap-4"
                    onClick={() => setExpanded(isOpen ? null : alumni.id)}
                  >
                    {/* Avatar */}
                    <div className={`w-12 h-12 ${alumni.warnaAvatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-extrabold text-lg">{alumni.inisial}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        {/* PLACEHOLDER — nama akan diganti */}
                        <h4 className="font-bold text-slate-800">{alumni.nama}</h4>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                          <StatusIkon className="w-3 h-3" />{alumni.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{alumni.jurusan} · Lulusan {alumni.tahunLulus}</p>
                      <p className="text-xs text-gray-600 truncate mt-0.5 font-medium">{alumni.tempat}</p>
                    </div>

                    {/* Expand arrow */}
                    <div className="flex-shrink-0 text-gray-400">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Testimoni */}
                  {isOpen && (
                    <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Quote className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Testimoni</p>
                          {/* PLACEHOLDER — testimoni akan diganti */}
                          <p className="text-gray-700 text-sm leading-relaxed italic">"{alumni.testimoni}"</p>
                          <p className="text-xs font-bold text-slate-700 mt-2">— {alumni.nama}, {alumni.tahunLulus}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-slate-800 rounded-2xl p-7 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Sudah Lulus? Bergabunglah!</h3>
            {/* PLACEHOLDER — ganti dengan info kontak atau cara daftar alumni */}
            <p className="text-slate-400 text-sm">Hubungi pengurus kelas untuk menambahkan profilmu ke halaman alumni.</p>
          </div>
          <button className="flex-shrink-0 bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
            Daftarkan Dirimu
          </button>
        </div>
      </div>
    </section>
  )
}
