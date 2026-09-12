import { Crown, UserCheck, FileText, Wallet, ArrowRight } from "lucide-react";

// PLACEHOLDER — Sesuaikan semua nama dan jabatan pengurus kelas di bawah
const pengurusKelas = [
  {
    peran: "Ketua Kelas",
    inisial: "KK",
    ikon: Crown,
    nama: "Nama Ketua Kelas", // PLACEHOLDER
    nim: "Kelas XI TKJ 1",    // PLACEHOLDER — ganti dengan kelas asli
    aksen: { card: "border-yellow-300 bg-yellow-50", icon: "bg-yellow-500", badge: "bg-yellow-100 text-yellow-800", initial: "bg-yellow-500" },
    tugas: [
      "Memimpin dan mengkoordinir seluruh kegiatan kelas",
      "Menjadi penghubung antara kelas dan wali kelas",
      "Memimpin rapat musyawarah kelas",
      "Bertanggung jawab atas ketertiban dan kehadiran kelas",
    ],
  },
  {
    peran: "Wakil Ketua",
    inisial: "WK",
    ikon: UserCheck,
    nama: "Nama Wakil Ketua", // PLACEHOLDER
    nim: "Kelas XI TKJ 1",    // PLACEHOLDER
    aksen: { card: "border-blue-200 bg-blue-50", icon: "bg-blue-600", badge: "bg-blue-100 text-blue-800", initial: "bg-blue-600" },
    tugas: [
      "Mendampingi dan membantu tugas ketua kelas",
      "Menggantikan ketua kelas bila berhalangan hadir",
      "Membantu mengkoordinir kegiatan kelas",
      "Memastikan program kerja pengurus berjalan lancar",
    ],
  },
  {
    peran: "Sekretaris",
    inisial: "SK",
    ikon: FileText,
    nama: "Nama Sekretaris",  // PLACEHOLDER
    nim: "Kelas XI TKJ 1",    // PLACEHOLDER
    aksen: { card: "border-green-200 bg-green-50", icon: "bg-green-600", badge: "bg-green-100 text-green-800", initial: "bg-green-600" },
    tugas: [
      "Mencatat dan mendokumentasikan kegiatan kelas",
      "Mengurus administrasi dan surat-menyurat kelas",
      "Membuat notulen dalam setiap rapat kelas",
      "Menyimpan arsip dan dokumen penting kelas",
    ],
  },
  {
    peran: "Bendahara",
    inisial: "BD",
    ikon: Wallet,
    nama: "Nama Bendahara",   // PLACEHOLDER
    nim: "Kelas XI TKJ 1",    // PLACEHOLDER
    aksen: { card: "border-purple-200 bg-purple-50", icon: "bg-purple-600", badge: "bg-purple-100 text-purple-800", initial: "bg-purple-600" },
    tugas: [
      "Mengelola keuangan dan kas kelas secara transparan",
      "Mencatat seluruh pemasukan dan pengeluaran kelas",
      "Membuat laporan keuangan secara berkala",
      "Mengurus iuran dan kebutuhan finansial kelas",
    ],
  },
];

export default function WasteManagementGuide() {
  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Organisasi</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Struktur Pengurus Kelas</h2>
          </div>
        </div>

        {/* Kartu Pengurus — ID Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {pengurusKelas.map((p, i) => {
            const Icon = p.ikon;
            return (
              <div key={i} className={`group border-2 ${p.aksen.card} rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                {/* Card Header / ID Strip */}
                <div className={`${p.aksen.icon} px-5 py-3 flex items-center gap-2`}>
                  <Icon className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold uppercase tracking-wide">{p.peran}</span>
                </div>

                {/* Avatar + Nama */}
                <div className="p-5 text-center border-b border-gray-100">
                  <div className={`w-16 h-16 ${p.aksen.initial} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-white font-extrabold text-xl">{p.inisial}</span>
                  </div>
                  {/* PLACEHOLDER — nama akan diganti */}
                  <h3 className="font-bold text-slate-800 text-base mb-1">{p.nama}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.aksen.badge}`}>
                    {p.peran}
                  </span>
                </div>

                {/* Tugas */}
                <div className="p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tugas & Tanggung Jawab</p>
                  <ul className="space-y-2">
                    {p.tugas.map((t, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-xs text-gray-600">
                        <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
