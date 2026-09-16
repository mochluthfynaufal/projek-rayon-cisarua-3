"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, Settings, Users, Loader2 } from "lucide-react";
import { daftarSiswa as fallbackDaftarSiswa, Siswa } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import ModalEditPiket, { PiketDayData } from "@/app/components/ModalEditPiket";

const initialDefaultJadwal: PiketDayData[] = [
  {
    hari: "Senin",
    dayIndex: 1,
    petugas: [
      { siswa_id: 22, nama: "Chieka Sharlie Wulandari" },
      { siswa_id: 23, nama: "Daniel Kurniawan" },
      { siswa_id: 28, nama: "M Zafa Zulprana" },
      { siswa_id: 29, nama: "Muhammad Asrul Gunawan" },
      { siswa_id: 12, nama: "Nadira Dewanti Putri" },
      { siswa_id: 6,  nama: "Moch Luthfy Naufal" },
      { siswa_id: 17, nama: "Syifa Dwi Anggraini" },
      { siswa_id: 18, nama: "Zaghita Rahmah Firdaus" },
    ],
  },
  {
    hari: "Selasa",
    dayIndex: 2,
    petugas: [
      { siswa_id: 1,  nama: "Al'Fika Dwi Cahyani" },
      { siswa_id: 3,  nama: "Fadlan Ahmad Jamil Al Ayubi" },
      { siswa_id: 5,  nama: "Haphinatul Shafira" },
      { siswa_id: 7,  nama: "Muhamad Aditya Abdilah" },
      { siswa_id: 8,  nama: "Muhamad Azwan Muzaki" },
      { siswa_id: 10, nama: "Muhamad Fedliansyah Ilham" },
      { siswa_id: 14, nama: "Salsabila Destiana Putri" },
    ],
  },
  {
    hari: "Rabu",
    dayIndex: 3,
    petugas: [
      { siswa_id: 25, nama: "Dervy Alita Wijaya" },
      { siswa_id: 31, nama: "Muhammad Naufal Alkahfi" },
      { siswa_id: 34, nama: "Sifa Aulia" },
      { siswa_id: 4,  nama: "Fadliansyah Venanda" },
      { siswa_id: 9,  nama: "Muhamad Fadilah" },
      { siswa_id: 13, nama: "Ridwan Faiz Rojabi" },
      { siswa_id: 16, nama: "Siti Aliya Zhafirah" },
    ],
  },
  {
    hari: "Kamis",
    dayIndex: 4,
    petugas: [
      { siswa_id: 20, nama: "Adhwa Baihaqi" },
      { siswa_id: 24, nama: "Danisha Aniq Ayasha Firgiansa" },
      { siswa_id: 27, nama: "Ferhika Putri Maulidina" },
      { siswa_id: 30, nama: "Muhammad Faris Hisyam Azizi" },
      { siswa_id: 32, nama: "Mustafa Habibi Agnia" },
      { siswa_id: 33, nama: "Rizky Ikhsan Maulana" },
      { siswa_id: 36, nama: "Viona Oktora Mulyana Putri" },
    ],
  },
  {
    hari: "Jumat",
    dayIndex: 5,
    petugas: [
      { siswa_id: 21, nama: "Alisya Zahwa Nurlatifah" },
      { siswa_id: 26, nama: "Dinda Aqila Nurfadilah" },
      { siswa_id: 35, nama: "Siti Erfina Nurmawati" },
      { siswa_id: 2,  nama: "Bagas Dizwar Asfas" },
      { siswa_id: 11, nama: "Muhammad Rafliansyah Putra" },
      { siswa_id: 15, nama: "Sandy Prayogo" },
      { siswa_id: 19, nama: "Zyad Abdillah" },
    ],
  },
];

export default function JadwalPiket() {
  const { role } = useAuth();
  const [jadwal, setJadwal] = useState<PiketDayData[]>(initialDefaultJadwal);
  const [siswaList, setSiswaList] = useState<Siswa[]>(fallbackDaftarSiswa);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [hariIniIndex, setHariIniIndex] = useState<number | null>(null);
  const [hariAktifId, setHariAktifId] = useState<number | null>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Hak akses ubah piket: Pengurus, Guru/PS, Admin
  const canManagePiket = role === "pengurus" || role === "guru" || role === "admin";

  const fetchJadwalPiket = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Ambil data siswa
        const { data: sData } = await supabase.from("siswa").select("*");
        if (sData && sData.length > 0) {
          const mappedSiswa: Siswa[] = sData.map((s) => ({
            id: s.id,
            nama: s.nama,
            nis: s.nis,
            jabatan: s.jabatan,
            angkatan: s.angkatan,
            tahunAngkatan: s.tahun_angkatan,
            inisial: s.inisial || s.nama.substring(0, 2).toUpperCase(),
            warnaBg: s.warna_bg || "bg-blue-600",
          }));
          setSiswaList(mappedSiswa);
        }

        // Ambil data jadwal piket
        const { data: pData, error: pErr } = await supabase
          .from("jadwal_piket")
          .select("id, hari, day_index, siswa_id, urutan, siswa(nama)")
          .order("urutan", { ascending: true });

        if (!pErr && pData && pData.length > 0) {
          const daysMap: Record<number, PiketDayData> = {
            1: { hari: "Senin", dayIndex: 1, petugas: [] },
            2: { hari: "Selasa", dayIndex: 2, petugas: [] },
            3: { hari: "Rabu", dayIndex: 3, petugas: [] },
            4: { hari: "Kamis", dayIndex: 4, petugas: [] },
            5: { hari: "Jumat", dayIndex: 5, petugas: [] },
          };

          pData.forEach((row: any) => {
            const dayIdx = row.day_index;
            if (daysMap[dayIdx]) {
              daysMap[dayIdx].petugas.push({
                id: row.id,
                siswa_id: row.siswa_id,
                nama: row.siswa?.nama || "Siswa",
              });
            }
          });

          setJadwal(Object.values(daysMap));
        }
      } else {
        const local = localStorage.getItem("custom_jadwal_piket");
        if (local) {
          setJadwal(JSON.parse(local));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().getDay();
    setHariIniIndex(today);
    fetchJadwalPiket();
  }, []);

  const handleCekHariIni = () => {
    if (hariIniIndex === null) return;
    const hari = jadwal.find((j) => j.dayIndex === hariIniIndex);
    if (hari && hari.petugas.length > 0) {
      setHariAktifId(hari.dayIndex);
      const names = hari.petugas.map((p) => p.nama).join(", ");
      setAlert(`Hari ini ${hari.hari} — Petugas: ${names}`);
    } else {
      setHariAktifId(null);
      setAlert("Hari ini adalah hari libur (Sabtu/Minggu). Tidak ada jadwal piket. 🎉");
    }
    setTimeout(() => setAlert(null), 7000);
  };

  const isToday = (dayIndex: number) => hariIniIndex === dayIndex;
  const isAktif = (dayIndex: number) => hariAktifId === dayIndex;

  const maxPetugas = Math.max(1, ...jadwal.map((j) => j.petugas.length));

  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Section Label + Tombol */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-yellow-500 rounded-full" />
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Jadwal</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Jadwal Piket Kebersihan</h2>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {canManagePiket && (
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <Settings className="w-4 h-4 text-yellow-400" />
                Atur Jadwal Piket
              </button>
            )}

            <button
              onClick={handleCekHariIni}
              className="flex items-center gap-2 bg-yellow-500 text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-yellow-600 transition-colors shadow-sm cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              Cek Piket Hari Ini
            </button>
          </div>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-8 flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm font-medium leading-relaxed">{alert}</p>
          </div>
        )}

        {/* TABEL JADWAL — Senin–Jumat */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-wider px-5 py-4 text-left w-36 sticky left-0 z-10 border-b border-slate-800">
                    Petugas
                  </th>
                  {jadwal.map((col) => {
                    const today = isToday(col.dayIndex);
                    const aktif = isAktif(col.dayIndex);
                    return (
                      <th
                        key={col.dayIndex}
                        className={`text-center px-4 py-4 font-bold text-sm transition-colors border-b border-slate-800 ${
                          aktif
                            ? "bg-yellow-500 text-slate-900"
                            : today
                            ? "bg-yellow-400/90 text-slate-900"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{col.hari}</span>
                          {today && (
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                aktif ? "bg-slate-900 text-white" : "bg-slate-900 text-yellow-400"
                              }`}
                            >
                              Hari Ini
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: maxPetugas }).map((_, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="px-5 py-3.5 sticky left-0 bg-inherit border-r border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {rowIndex + 1}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Petugas {rowIndex + 1}</span>
                      </div>
                    </td>

                    {jadwal.map((col) => {
                      const petugasObj = col.petugas[rowIndex] ?? null;
                      const aktif = isAktif(col.dayIndex);
                      const today = isToday(col.dayIndex);
                      return (
                        <td
                          key={col.dayIndex}
                          className={`px-3 py-3 text-center transition-colors ${
                            aktif ? "bg-yellow-50" : today ? "bg-yellow-50/60" : ""
                          }`}
                        >
                          {petugasObj ? (
                            <span
                              className={`inline-block whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold ${
                                aktif
                                  ? "bg-yellow-500 text-slate-900 shadow-sm"
                                  : today
                                  ? "bg-yellow-100 text-yellow-900 border border-yellow-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {petugasObj.nama}
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

      {/* Modal Edit Piket */}
      {isEditOpen && (
        <ModalEditPiket
          daftarSiswa={siswaList}
          currentJadwal={jadwal}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setJadwal(updated);
            fetchJadwalPiket();
          }}
        />
      )}
    </section>
  );
}
