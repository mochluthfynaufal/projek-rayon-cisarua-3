"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Bell, CheckCircle } from "lucide-react";

// Data jadwal piket — JADWAL PIKET RAYON CISARUA 3 (2026/2027)
const jadwalPiket: { hari: string; dayIndex: number; petugas: string[] }[] = [
  {
    hari: "Senin",
    dayIndex: 1,
    petugas: [
      "Chieka Sharlie Wulandari",
      "Daniel Kurniawan",
      "M Zafa Zulprana",
      "Muhammad Asrul Gunawan",
      "Nadira Dewanti Putri",
      "Moch Luthfy Naufal",
      "Syifa Dwi Anggraini",
      "Zaghita Rahmah Firdaus",
    ],
  },
  {
    hari: "Selasa",
    dayIndex: 2,
    petugas: [
      "Al'Fika Dwi Cahyani",
      "Fadlan Ahmad Jamil Al Ayubi",
      "Haphinatul Shafira",
      "Muhamad Aditya Abdilah",
      "Muhamad Azwan Muzaki",
      "Muhamad Fedliansyah Ilham",
      "Salsabila Destiana Putri",
    ],
  },
  {
    hari: "Rabu",
    dayIndex: 3,
    petugas: [
      "Dervy Alita Wijaya",
      "Muhammad Naufal Alkahfi",
      "Sifa Aulia",
      "Fadliansyah Venanda",
      "Muhamad Fadilah",
      "Ridwan Faiz Rojabi",
      "Siti Aliya Zhafirah",
    ],
  },
  {
    hari: "Kamis",
    dayIndex: 4,
    petugas: [
      "Adhwa Baihaqi",
      "Danisha Aniq Ayasha Firgiansa",
      "Ferhika Putri Maulidina",
      "Muhammad Faris Hisyam Azizi",
      "Mustafa Habibi Agnia",
      "Rizky Ikhsan Maulana",
      "Viona Oktora Mulyana Putri",
    ],
  },
  {
    hari: "Jumat",
    dayIndex: 5,
    petugas: [
      "Alisya Zahwa Nurlatifah",
      "Dinda Aqila Nurfadilah",
      "Siti Erfina Nurmawati",
      "Bagas Dizwar Asfas",
      "Muhammad Rafliansyah Putra",
      "Sandy Prayogo",
      "Zyad Abdillah",
    ],
  },
];

export default function WasteCalculator() {
  const [hariIniIndex, setHariIniIndex] = useState<number | null>(null);
  const [hariAktifId, setHariAktifId]   = useState<number | null>(null); // dayIndex yang sedang disorot
  const [alert, setAlert]               = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().getDay();
    setHariIniIndex(today);
  }, []);

  const handleCekHariIni = () => {
    if (hariIniIndex === null) return;
    const hari = jadwalPiket.find(j => j.dayIndex === hariIniIndex);
    if (hari) {
      setHariAktifId(hari.dayIndex);
      setAlert(`Hari ini ${hari.hari} — petugas: ${hari.petugas.join(", ")}`);
    } else {
      setHariAktifId(null);
      setAlert("Hari ini adalah hari libur (Sabtu/Minggu). Tidak ada jadwal piket. 🎉");
    }
    setTimeout(() => setAlert(null), 6000);
  };

  const isToday = (dayIndex: number) => hariIniIndex === dayIndex;
  const isAktif = (dayIndex: number) => hariAktifId === dayIndex;

  // Jumlah maks petugas di semua hari (untuk tinggi tabel yang seragam)
  const maxPetugas = Math.max(...jadwalPiket.map(j => j.petugas.length));

  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Label + Tombol */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-yellow-500 rounded-full" />
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Jadwal</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Jadwal Piket Kelas</h2>
            </div>
          </div>
          <button
            onClick={handleCekHariIni}
            className="flex items-center gap-2 bg-yellow-500 text-white font-semibold px-5 py-3 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Bell className="w-4 h-4" />
            Cek Piket Hari Ini
          </button>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-8 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-4">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium">{alert}</p>
          </div>
        )}

        {/* ── TABEL JADWAL — Senin–Jumat sebagai KOLOM ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              {/* Header row: nama hari */}
              <thead>
                <tr>
                  {/* Kolom kiri: label baris */}
                  <th className="bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wide px-4 py-4 text-left w-32 sticky left-0 z-10">
                    Petugas
                  </th>
                  {jadwalPiket.map(col => {
                    const today   = isToday(col.dayIndex);
                    const aktif   = isAktif(col.dayIndex);
                    return (
                      <th
                        key={col.dayIndex}
                        className={`text-center px-4 py-4 font-bold text-sm transition-colors ${
                          aktif
                            ? "bg-yellow-500 text-white"
                            : today
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-slate-800 text-white"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{col.hari}</span>
                          {today && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              aktif ? "bg-white/30 text-white" : "bg-yellow-500 text-white"
                            }`}>
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body rows: setiap baris = satu slot petugas */}
              <tbody>
                {Array.from({ length: maxPetugas }).map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                    {/* Label baris (Petugas ke-N) */}
                    <td className="px-4 py-3 sticky left-0 bg-inherit border-r border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {rowIndex + 1}
                        </div>
                        <span className="text-xs text-gray-400">Petugas {rowIndex + 1}</span>
                      </div>
                    </td>

                    {/* Sel per hari */}
                    {jadwalPiket.map(col => {
                      const nama  = col.petugas[rowIndex] ?? null; // PLACEHOLDER
                      const aktif = isAktif(col.dayIndex);
                      const today = isToday(col.dayIndex);
                      return (
                        <td
                          key={col.dayIndex}
                          className={`px-3 py-3 text-center transition-colors ${
                            aktif
                              ? "bg-yellow-50"
                              : today
                              ? "bg-yellow-50/60"
                              : ""
                          }`}
                        >
                          {nama ? (
                            <span className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-medium ${
                              aktif
                                ? "bg-yellow-500 text-white shadow-sm"
                                : today
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {nama}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
