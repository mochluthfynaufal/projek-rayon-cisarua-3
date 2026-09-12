"use client";
import { Users, Award, CalendarDays, ClipboardList, Laptop, Heart } from "lucide-react";

// PLACEHOLDER — Sesuaikan semua angka dan teks fakta di bawah dengan data kelas asli
const faktaData = [
  {
    nilai: "103",       // PLACEHOLDER
    satuan: "siswa",
    label: "Total Siswa Aktif",
    sublabel: "Gabungan 3 angkatan aktif",
    ikon: Users,
    warna: "yellow",
  },
  {
    nilai: "3",
    satuan: "angkatan",
    label: "Angkatan Berjalan",
    sublabel: "Kelas X, XI, dan XII-PKL",
    ikon: ClipboardList,
    warna: "slate",
  },
  {
    nilai: "72",        // PLACEHOLDER
    satuan: "alumni",
    label: "Alumni Dihasilkan",
    sublabel: "Bekerja, kuliah, dan wirausaha",
    ikon: Award,
    warna: "green",
  },
  {
    nilai: "5",
    satuan: "hari",
    label: "Jadwal Piket",
    sublabel: "Senin hingga Jumat setiap minggu",
    ikon: CalendarDays,
    warna: "blue",
  },
  {
    nilai: "TKJ",       // PLACEHOLDER — ganti kode jurusan
    satuan: "",
    label: "Program Keahlian",
    sublabel: "Teknik Komputer dan Jaringan",    // PLACEHOLDER
    ikon: Laptop,
    warna: "purple",
  },
  {
    nilai: "2022",      // PLACEHOLDER — ganti tahun masuk
    satuan: "",
    label: "Tahun Angkatan Masuk",
    sublabel: "Awal perjalanan bersama",
    ikon: Heart,
    warna: "red",
  },
];

const warnaMap: Record<string, { bg: string; text: string; icon: string; border: string }> = {
  yellow: { bg: "bg-yellow-50",  text: "text-yellow-700", icon: "bg-yellow-500", border: "border-yellow-200" },
  slate:  { bg: "bg-slate-50",   text: "text-slate-700",  icon: "bg-slate-700",  border: "border-slate-200" },
  green:  { bg: "bg-green-50",   text: "text-green-700",  icon: "bg-green-600",  border: "border-green-200" },
  blue:   { bg: "bg-blue-50",    text: "text-blue-700",   icon: "bg-blue-600",   border: "border-blue-200" },
  purple: { bg: "bg-purple-50",  text: "text-purple-700", icon: "bg-purple-600", border: "border-purple-200" },
  red:    { bg: "bg-red-50",     text: "text-red-700",    icon: "bg-red-600",    border: "border-red-200" },
};

export default function Fakta() {
  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section Label */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Fakta & Data</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Fakta Menarik Kelas Kami</h2>
          </div>
        </div>

        {/* Grid Fakta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {faktaData.map((fakta, i) => {
            const Icon = fakta.ikon;
            const warna = warnaMap[fakta.warna];
            return (
              <div
                key={i}
                className={`group ${warna.bg} border ${warna.border} rounded-2xl p-7 flex gap-5 items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Ikon */}
                <div className={`w-12 h-12 ${warna.icon} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Teks */}
                <div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-3xl font-extrabold ${warna.text}`}>{fakta.nilai}</span>
                    {fakta.satuan && (
                      <span className={`text-sm font-semibold ${warna.text} opacity-70`}>{fakta.satuan}</span>
                    )}
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-0.5">{fakta.label}</p>
                  <p className="text-gray-500 text-xs">{fakta.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="mt-10 bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="text-center md:text-left">
            <p className="text-white font-bold mb-0.5">Tahukah Kamu?</p>
            {/* PLACEHOLDER — ganti dengan fakta unik kelas yang asli */}
            <p className="text-slate-400 text-sm">
              Kelas kami telah menghasilkan alumni yang kini bekerja di berbagai perusahaan IT
              dan berkuliah di perguruan tinggi negeri ternama di Indonesia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
