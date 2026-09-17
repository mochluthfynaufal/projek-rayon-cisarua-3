"use client";
import React from "react";
import { CheckCircle, Clock, GraduationCap, Briefcase, BookOpen, Users, ArrowRight } from "lucide-react";

interface TahapAkademik {
  id: number;
  kelas: string;
  subtitle: string;
  deskripsi: string;
  tahun: string; // PLACEHOLDER
  status: "selesai" | "berjalan" | "mendatang";
  jumlahSiswa: number; // PLACEHOLDER
  ikon: React.ElementType;
  pencapaian: string[];
}

// PLACEHOLDER — Sesuaikan semua data tahap akademik di bawah
const tahapAkademik: TahapAkademik[] = [
  {
    id: 1,
    kelas: "Kelas X",
    subtitle: "Tahap Orientasi & Dasar Kejuruan",
    deskripsi: "Masa adaptasi di SMK Wikrama Bogor. Siswa mengenal lingkungan sekolah, membangun kebersamaan, dan mempelajari kompetensi dasar kejuruan.",
    tahun: "2022/2023", // PLACEHOLDER
    status: "selesai",
    jumlahSiswa: 36, // PLACEHOLDER
    ikon: BookOpen,
    pencapaian: ["MPLS & Orientasi Sekolah", "Dasar Kompetensi Kejuruan", "Pembentukan Pengurus Rayon", "Penilaian Akhir Tahun"],
  },
  {
    id: 2,
    kelas: "Kelas XI",
    subtitle: "Tahap Kompetensi & Produktivitas",
    deskripsi: "Pendalaman materi kejuruan dan persiapan menuju dunia industri. Siswa aktif mengikuti berbagai kegiatan kompetensi dan mempersiapkan diri untuk PKL.",
    tahun: "2023/2024", // PLACEHOLDER
    status: "berjalan",
    jumlahSiswa: 34, // PLACEHOLDER
    ikon: Users,
    pencapaian: ["Materi Produktif Lanjutan", "Persiapan PKL & Portofolio", "Lomba Kompetensi Keahlian", "Kunjungan Industri"],
  },
  {
    id: 3,
    kelas: "Kelas XII — PKL",
    subtitle: "Praktik Kerja Lapangan",
    deskripsi: "Angkatan senior menjalani PKL di perusahaan dan instansi mitra sekolah. Menerapkan kompetensi secara langsung di lingkungan kerja nyata.",
    tahun: "2024/2025", // PLACEHOLDER
    status: "berjalan",
    jumlahSiswa: 33, // PLACEHOLDER
    ikon: Briefcase,
    pencapaian: ["Penempatan di Industri Mitra", "Jurnal & Laporan PKL Harian", "Monitoring oleh Pembimbing", "Sidang & Evaluasi PKL"],
  },
  {
    id: 4,
    kelas: "Alumni",
    subtitle: "Wisuda & Dunia Nyata",
    deskripsi: "Puncak perjalanan akademik. Para alumni SMK Wikrama Bogor siap berkontribusi di dunia kerja, melanjutkan pendidikan, atau merintis wirausaha.",
    tahun: "2025", // PLACEHOLDER
    status: "mendatang",
    jumlahSiswa: 72, // PLACEHOLDER
    ikon: GraduationCap,
    pencapaian: ["Ujian Kompetensi Keahlian (UKK)", "Wisuda Lulusan", "Serapan Kerja & Kuliah", "Jaringan Alumni"],
  },
];

const statusConfig = {
  selesai: { label: "Selesai", bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500", border: "border-green-200" },
  berjalan: { label: "Berlangsung", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500", border: "border-yellow-300" },
  mendatang: { label: "Mendatang", bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", border: "border-gray-200" },
};

export default function LearningPath() {
  const selesai = tahapAkademik.filter(t => t.status === "selesai").length;
  const totalSiswaAktif = tahapAkademik.filter(t => t.status !== "mendatang").reduce((s, t) => s + t.jumlahSiswa, 0);

  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Perjalanan Akademik</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Tahapan Angkatan Rayon</h2>
          </div>
        </div>

        {/* Progress Bar Ringkasan */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-10 grid grid-cols-3 divide-x divide-gray-200">
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-slate-800">{selesai}</p>
            <p className="text-sm text-gray-500 mt-1">Tahap Selesai</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-yellow-600">{totalSiswaAktif}</p>
            <p className="text-sm text-gray-500 mt-1">Siswa Aktif</p>
          </div>
          <div className="text-center px-4">
            <p className="text-3xl font-bold text-blue-600">{tahapAkademik.find(t => t.status === "mendatang")?.jumlahSiswa ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Alumni</p>
          </div>
        </div>

        {/* Tahap List */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gray-200 hidden md:block" />

          <div className="space-y-6">
            {tahapAkademik.map((tahap, index) => {
              const cfg = statusConfig[tahap.status];
              const Icon = tahap.ikon;
              return (
                <div key={tahap.id} className="flex items-start gap-6">
                  {/* Step indicator */}
                  <div className="relative z-10 flex-shrink-0 hidden md:flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full border-2 ${cfg.border} ${cfg.bg} flex items-center justify-center shadow-sm`}>
                      {tahap.status === "selesai" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 bg-white border-2 rounded-2xl p-6 md:p-8 transition-all duration-200 hover:shadow-md ${
                    tahap.status === "berjalan" ? "border-yellow-300" : "border-gray-200"
                  }`}>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-slate-800">{tahap.kelas}</h3>
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-yellow-700 mb-2">{tahap.subtitle}</p>
                        <p className="text-gray-600 text-sm leading-relaxed max-w-xl">{tahap.deskripsi}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />
                          {tahap.tahun} {/* PLACEHOLDER */}
                        </p>
                        <p className="text-xl font-bold text-slate-800">
                          {tahap.jumlahSiswa} {/* PLACEHOLDER */}
                        </p>
                        <p className="text-xs text-gray-500">siswa</p>
                      </div>
                    </div>

                    {/* Pencapaian */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {tahap.pencapaian.map((p, pi) => (
                        <div key={pi} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-3 py-2">
                          <ArrowRight className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span className="text-xs text-gray-700">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA bawah */}
        <div className="mt-12 bg-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Siap Menjadi Alumni Terbaik?</h3>
            {/* PLACEHOLDER — ganti dengan pesan motivasi kelas */}
            <p className="text-slate-400 text-sm">Setiap tahap adalah fondasi untuk masa depan yang gemilang bersama SMK Wikrama Bogor.</p>
          </div>
          <button className="flex-shrink-0 bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-600 transition-colors">
            Lihat Profil Alumni
          </button>
        </div>
      </div>
    </section>
  );
}
