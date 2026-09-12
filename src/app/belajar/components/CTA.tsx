"use client";
import { GraduationCap, Users, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full py-20 px-4 bg-yellow-500 overflow-hidden">
      {/* Subtle decorative pattern */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
          backgroundSize: "14px 14px",
        }}
      />
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/30 rounded-full translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/20 rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <GraduationCap className="w-4 h-4 text-white" />
            <span className="text-white text-xs font-bold uppercase tracking-widest">SMK Wikrama Bogor</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">
            Kenali Keluarga Besar<br />Kelas Kami
          </h2>

          {/* PLACEHOLDER — sesuaikan teks CTA dengan konteks kelas asli */}
          <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
            Dari wali kelas yang berdedikasi, siswa aktif yang bersemangat, hingga alumni yang telah membuktikan diri di dunia kerja dan perguruan tinggi.
          </p>
        </div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Wali Kelas", sublabel: "Mohamad Rizal, S.Pd.", ikon: GraduationCap, bg: "bg-white/20 hover:bg-white/30" },
            { label: "Siswa Aktif", sublabel: "3 Angkatan — 103 Siswa", ikon: Users, bg: "bg-white text-yellow-600 hover:bg-yellow-50" }, // PLACEHOLDER
            { label: "Alumni", sublabel: "72 Alumni Membanggakan", ikon: ArrowRight, bg: "bg-white/20 hover:bg-white/30" }, // PLACEHOLDER
          ].map((card, i) => {
            const Icon = card.ikon;
            const isCenter = i === 1;
            return (
              <button key={i} className={`flex items-center gap-3 px-5 py-4 rounded-xl border border-white/30 transition-all duration-200 cursor-pointer ${card.bg} ${isCenter ? "" : "text-white"}`}>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isCenter ? "text-yellow-600" : "text-white"}`} />
                <div className="text-left">
                  <p className={`font-bold text-sm ${isCenter ? "text-slate-800" : "text-white"}`}>{card.label}</p>
                  <p className={`text-xs ${isCenter ? "text-yellow-700" : "text-white/70"}`}>{card.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
