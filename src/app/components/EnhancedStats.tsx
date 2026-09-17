"use client"
import { useState, useEffect } from "react"
import { Users, ShieldCheck, Trophy, Heart, TrendingUp, Zap, CalendarDays, GraduationCap, CheckCircle2, MessageCircle } from "lucide-react"
import { jumlahSiswaAktif } from "@/lib/siswaData"

const statsData = [
  {
    icon: <Users className="w-8 h-8" />,
    value: `${jumlahSiswaAktif}`,
    label: "Siswa Aktif",
    description: `Total ${jumlahSiswaAktif} anggota aktif rayon Cisarua 3 yang solid dan kompak.`,
    color: "emerald",
    growth: "Active",
    detail: "Terdiri dari angkatan Kelas X, XI, dan XII yang aktif berorganisasi.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    value: "98%",
    label: "Tingkat Kedisiplinan",
    description: "Persentase kedisiplinan dan kehadiran harian siswa Cisarua 3.",
    color: "blue",
    growth: "+5%",
    detail: "Meningkat konsisten setiap semester berkat pembiasaan harian.",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    value: "12+",
    label: "Prestasi & Juara",
    description: "Perolehan penghargaan dari berbagai kompetisi akademik, seni, dan olahraga yang diraih anggota rayon.",
    color: "green",
    growth: "Award",
    detail: "Mencakup kompetisi tingkat sekolah, kota, hingga provinsi.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    value: "100%",
    label: "Kekeluargaan",
    description: "Komitmen saling merangkul dan membimbing dari senior ke junior.",
    color: "yellow",
    growth: "Top",
    detail: "Budaya saling support yang dibangun sejak awal terbentuknya rayon.",
  },
]

export default function EnhancedStats() {
  const [countedStats, setCountedStats] = useState(statsData.map(() => 0))
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("stats-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const interval = 50
    const steps = duration / interval

    statsData.forEach((stat, index) => {
      const target = Number.parseInt(stat.value.replace(/[^\d]/g, ""))
      if (isNaN(target)) return

      let step = 0
      const timer = setInterval(() => {
        step += 1
        const progress = Math.min(step / steps, 1)
        const currentValue = Math.floor(progress * target)

        setCountedStats((prev) => {
          const newCounts = [...prev]
          newCounts[index] = currentValue
          return newCounts
        })

        if (progress === 1) clearInterval(timer)
      }, interval)
    })
  }, [isVisible])

  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        iconBg: "bg-emerald-500",
        gradient: "from-emerald-100 to-emerald-200",
        glow: "shadow-emerald-200",
      },
      blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        iconBg: "bg-blue-500",
        gradient: "from-blue-100 to-blue-200",
        glow: "shadow-blue-200",
      },
      green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        iconBg: "bg-green-500",
        gradient: "from-green-100 to-green-200",
        glow: "shadow-green-200",
      },
      yellow: {
        bg: "bg-yellow-50",
        text: "text-yellow-600",
        border: "border-yellow-200",
        iconBg: "bg-yellow-500",
        gradient: "from-yellow-100 to-yellow-200",
        glow: "shadow-yellow-200",
      },
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.emerald
  }

  return (
    <section id="stats-section" className="relative w-full py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg border border-gray-200">
            <TrendingUp className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-emerald-700 font-semibold text-sm">Profil Rayon</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Mengenal Lebih Dekat{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Rayon Cisarua 3
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Angka-angka yang mencerminkan semangat, kedisiplinan, dan kebersamaan seluruh anggota Rayon Cisarua 3
          </p>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  isVisible ? "bg-emerald-500" : "bg-gray-300"
                }`}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => {
            const colors = getColorClasses(stat.color)
            const floatDelay = `${index * 0.3}s`

            return (
              <div
                key={index}
                className={`group relative cursor-pointer transform transition-all duration-700 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{
                  animation: isVisible ? `float 6s ease-in-out infinite ${floatDelay}` : "none",
                  transitionDelay: `${index * 150}ms`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl ${colors.glow} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                ></div>

                {/* Main Card */}
                <div
                  className={`relative ${colors.bg} border-2 ${colors.border} rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 z-10 overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
                    <div className={`absolute -top-4 -right-4 w-24 h-24 ${colors.iconBg} rounded-full blur-2xl`}></div>
                    <div className={`absolute -bottom-4 -left-4 w-20 h-20 ${colors.iconBg} rounded-full blur-xl`}></div>
                  </div>

                  <div className="relative z-10">
                    {/* Enhanced Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg`}
                      >
                        <div className="text-white">{stat.icon}</div>
                      </div>

                      {/* Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm ${
                        stat.color === 'emerald' ? 'bg-green-100 text-green-700' :
                        stat.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        stat.color === 'green' ? 'bg-lime-100 text-lime-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {stat.growth}
                      </div>
                    </div>

                    {/* Enhanced Stats Number */}
                    <div className="mb-4">
                      <h3 className="text-4xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">
                        {stat.value.includes("%") || stat.value.includes("+")
                          ? stat.value
                          : countedStats[index].toLocaleString() + (stat.value.includes("+") ? "+" : "")}
                      </h3>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                        <div
                          className={`h-1 rounded-full ${colors.iconBg} transition-all duration-2000`}
                          style={{
                            width: isVisible ? "100%" : "0%",
                            transitionDelay: `${index * 200}ms`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Label */}
                    <h4 className={`text-lg font-bold mb-3 ${colors.text} transition-colors duration-300`}>
                      {stat.label}
                    </h4>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 text-sm mb-4">
                      {stat.description}
                    </p>

                    {/* Detail on Hover */}
                    {hoveredIndex === index && (
                      <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 animate-in slide-in-from-bottom duration-300">
                        <p className="text-xs text-gray-600 font-medium">{stat.detail}</p>
                      </div>
                    )}

                    {/* Hover indicator */}
                    <div
                      className={`mt-4 w-full h-1 ${colors.iconBg} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Enhanced Bottom Section */}
        <div className="mt-20 grid md:grid-cols-2 gap-8">
          {/* CTA Kolaborasi */}
          <div className="bg-gradient-to-br from-emerald-100 to-green-100 border border-emerald-200 rounded-3xl p-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-green-500 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Punya Ide atau Ingin Kolaborasi?</h3>
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                Ingin bikin acara bareng, kolaborasi antar-rayon, atau mau tanya-tanya seputar Rayon Cisarua 3? Pintu kami selalu terbuka!
              </p>

              <button className="bg-emerald-500 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2">
                Hubungi Pengurus →
              </button>
            </div>
          </div>

          {/* Status & Ringkasan Rayon */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Status & Ringkasan Rayon
            </h3>

            <div className="space-y-4">
              {[
                {
                  icon: <GraduationCap className="w-5 h-5 text-emerald-600" />,
                  label: "Angkatan Aktif",
                  value: "3 Angkatan",
                },
                {
                  icon: <CalendarDays className="w-5 h-5 text-blue-500" />,
                  label: "Agenda Bulan Ini",
                  value: "2 Kegiatan",
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
                  label: "Status Pembiasaan",
                  value: "100% Tuntas",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <span className="font-medium text-gray-800">{item.label}</span>
                  </div>
                  <div className="font-bold text-gray-800">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-green-200 rounded-full opacity-25 animate-ping"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  )
}
