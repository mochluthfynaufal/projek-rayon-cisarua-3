"use client";
import { Quote } from "lucide-react";

export default function Slogan() {
  return (
    <section className="relative w-full py-24 px-4 bg-slate-800 overflow-hidden">
      {/* Decorative geometric */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-white/5" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Accent line */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16 bg-yellow-500" />
          {/* PLACEHOLDER — ganti label jika perlu */}
          <span className="text-yellow-500 text-xs font-bold uppercase tracking-[0.3em]">Motto Kelas</span>
          <div className="h-px w-16 bg-yellow-500" />
        </div>

        {/* Quote icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        {/* PLACEHOLDER — Ganti dengan motto/slogan kelas asli */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
          "Satu Kelas,{" "}
          <span className="text-yellow-400">Satu Keluarga"</span>
        </h2>

        {/* PLACEHOLDER — Ganti dengan penjelasan motto/visi kelas */}
        <p className="text-slate-300 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Kebersamaan, kedisiplinan, dan komitmen untuk berprestasi adalah nilai
          yang kami pegang teguh di setiap langkah perjalanan akademik kami di
          SMK Wikrama Bogor.
        </p>

        {/* Info kelas */}
        <div className="inline-flex items-center gap-4 border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3">
          <div className="text-center">
            {/* PLACEHOLDER — ganti nama kelas */}
            <p className="text-white font-bold text-sm">SMK Wikrama Bogor</p>
            <p className="text-slate-400 text-xs">Teknik Komputer dan Jaringan</p> {/* PLACEHOLDER */}
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            {/* PLACEHOLDER — ganti angkatan */}
            <p className="text-yellow-400 font-bold text-sm">Angkatan 2022</p>
            <p className="text-slate-400 text-xs">Tahun Ajaran 2025/2026</p> {/* PLACEHOLDER */}
          </div>
        </div>
      </div>
    </section>
  );
}
