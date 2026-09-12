"use client";
import {
  ShieldCheck,
  BookMarked,
  Handshake,
  Palette,
  Sparkles,
} from "lucide-react";

const cards = [
  {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    stackLayer1: "bg-yellow-100 border-yellow-300",
    stackLayer2: "bg-yellow-200 border-yellow-400",
    iconBg: "bg-gradient-to-br from-yellow-400 to-amber-500",
    icon: ShieldCheck,
    iconAnimation: "group-hover:rotate-12 group-hover:scale-110",
    titleColor: "text-yellow-700",
    linkColor: "text-yellow-600 hover:text-yellow-800",
    shadowColor: "shadow-yellow-200",
    rotateClass: "rotate-2",
    floatDelay: "",
    title: "Disiplin & Tanggung Jawab",
    desc: "Siswa Rayon Cisarua 3 selalu mengutamakan nilai-nilai disiplin dan tanggung jawab dalam belajar maupun berorganisasi.",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    stackLayer1: "bg-blue-100 border-blue-300",
    stackLayer2: "bg-blue-200 border-blue-400",
    iconBg: "bg-gradient-to-br from-blue-400 to-blue-600",
    icon: BookMarked,
    iconAnimation: "group-hover:-rotate-12 group-hover:scale-110",
    titleColor: "text-blue-700",
    linkColor: "text-blue-600 hover:text-blue-800",
    shadowColor: "shadow-blue-200",
    rotateClass: "-rotate-1",
    floatDelay: "1s",
    translate: "md:translate-y-8",
    title: "Pilar Prestasi Akademik",
    desc: "Kami berkomitmen untuk terus berprestasi, mengasah kemampuan akademik, dan menjadi siswa yang unggul.",
  },
  {
    bg: "bg-green-50",
    border: "border-green-200",
    stackLayer1: "bg-green-100 border-green-300",
    stackLayer2: "bg-green-200 border-green-400",
    iconBg: "bg-gradient-to-br from-green-400 to-emerald-600",
    icon: Handshake,
    iconAnimation: "group-hover:rotate-6 group-hover:scale-110",
    titleColor: "text-green-700",
    linkColor: "text-green-600 hover:text-green-800",
    shadowColor: "shadow-green-200",
    rotateClass: "-rotate-2",
    floatDelay: "2s",
    translate: "md:-translate-y-4",
    title: "Persahabatan & Solidaritas",
    desc: "Kami adalah satu keluarga. Rayon Cisarua 3 mengutamakan rasa persahabatan dan solidaritas antar anggota.",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    stackLayer1: "bg-purple-100 border-purple-300",
    stackLayer2: "bg-purple-200 border-purple-400",
    iconBg: "bg-gradient-to-br from-purple-400 to-violet-600",
    icon: Palette,
    iconAnimation: "group-hover:-rotate-6 group-hover:scale-110",
    titleColor: "text-purple-700",
    linkColor: "text-purple-600 hover:text-purple-800",
    shadowColor: "shadow-purple-200",
    rotateClass: "rotate-1",
    floatDelay: "3s",
    translate: "md:translate-y-6",
    title: "Pusat Kreativitas & Bakat",
    desc: "Setiap siswa Rayon Cisarua 3 didorong untuk mengembangkan bakat dan kreativitas melalui berbagai kegiatan non-akademik.",
  },
];

export default function LatarBelakang() {
  return (
    <section className="relative w-full py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm border border-green-100">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-emerald-700 font-medium text-sm">
              About Page
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            MENGENAL{" "}
            <span className="text-emerald-600">RAYON CISARUA 3</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Pusat kebersamaan, kreativitas, dan dedikasi siswa Rayon Cisarua 3
            dalam meraih masa depan.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.title}
                className={`group cursor-target relative cursor-pointer transform ${card.rotateClass} hover:rotate-0 transition-transform duration-500 ${card.translate ?? ""} animate-[float_6s_ease-in-out_infinite]`}
                style={card.floatDelay ? { animationDelay: card.floatDelay } : {}}
              >
                {/* Stack effect layers */}
                <div
                  className={`absolute inset-0 ${card.stackLayer1} rounded-3xl transform translate-x-2 translate-y-2 opacity-0 group-hover:opacity-60 transition-all duration-500 group-hover:translate-x-3 group-hover:translate-y-3`}
                ></div>
                <div
                  className={`absolute inset-0 ${card.stackLayer2} rounded-3xl transform translate-x-1 translate-y-1 opacity-0 group-hover:opacity-80 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2`}
                ></div>

                {/* Main card */}
                <div
                  className={`relative ${card.bg} border ${card.border} rounded-3xl p-8 ${card.shadowColor} hover:shadow-lg transition-all duration-500 hover:-translate-y-2 z-10`}
                >
                  <div
                    className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 ${card.iconAnimation} transition-all duration-300 shadow-md`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-4 ${card.titleColor} transition-colors duration-300`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors duration-300 mb-6">
                    {card.desc}
                  </p>
                  <a
                    href="#"
                    className={`inline-flex items-center gap-1 font-semibold text-sm ${card.linkColor} transition-colors duration-200 group/link`}
                  >
                    Pelajari lebih lanjut
                    <span className="group-hover/link:translate-x-1 transition-transform duration-200 inline-block">
                      →
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </section>
  );
}
