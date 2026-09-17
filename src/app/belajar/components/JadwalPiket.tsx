"use client";

import { useState, useEffect, useMemo } from "react";
import { Settings, Users, Filter, CalendarCheck, Sparkles } from "lucide-react";
import { daftarSiswa as fallbackDaftarSiswa, Siswa, Angkatan } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import ModalEditPiket, { PiketDayData, deduplicatePetugasList } from "@/app/components/ModalEditPiket";

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

const angkatanOptions = [
  { key: "Semua", label: "Semua Angkatan" },
  { key: "Kelas X", label: "Kelas X" },
  { key: "Kelas XI", label: "Kelas XI" },
  { key: "Kelas XII (PKL)", label: "Kelas XII (PKL)" },
];

export default function JadwalPiket() {
  const { role } = useAuth();
  const [jadwal, setJadwal] = useState<PiketDayData[]>(() =>
    initialDefaultJadwal.map((d) => ({
      ...d,
      petugas: deduplicatePetugasList(d.petugas),
    }))
  );
  const [siswaList, setSiswaList] = useState<Siswa[]>(fallbackDaftarSiswa);
  const [selectedAngkatan, setSelectedAngkatan] = useState<string>("Semua");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [hariIniIndex, setHariIniIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Hak akses ubah piket: Pengurus, Guru/PS, Admin
  const canManagePiket = role === "pengurus" || role === "guru" || role === "admin";

  // Map Siswa untuk lookup angkatan cepat
  const siswaMap = useMemo(() => {
    const map = new Map<number, Siswa>();
    siswaList.forEach((s) => map.set(s.id, s));
    return map;
  }, [siswaList]);

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
          const uniqueSiswa = mappedSiswa.filter(
            (s, idx, arr) => idx === arr.findIndex((t) => t.id === s.id)
          );
          setSiswaList(uniqueSiswa);
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
              const name = row.siswa?.nama || "Siswa";
              const sId = row.siswa_id;
              daysMap[dayIdx].petugas.push({
                id: row.id,
                siswa_id: sId,
                nama: name,
              });
            }
          });

          const cleanJadwal = Object.values(daysMap).map((d) => ({
            ...d,
            petugas: deduplicatePetugasList(d.petugas),
          }));

          setJadwal(cleanJadwal);
        }
      } else {
        const local = localStorage.getItem("custom_jadwal_piket");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            const cleanParsed = parsed.map((d: PiketDayData) => ({
              ...d,
              petugas: deduplicatePetugasList(d.petugas || []),
            }));
            setJadwal(cleanParsed);
          }
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

  const isToday = (dayIndex: number) => hariIniIndex === dayIndex;

  // Jadwal yang difilter berdasarkan angkatan yang dipilih
  const filteredJadwal = useMemo(() => {
    return jadwal.map((day) => {
      const cleanPetugas = deduplicatePetugasList(day.petugas);
      const filtered =
        selectedAngkatan === "Semua"
          ? cleanPetugas
          : cleanPetugas.filter((p) => {
              const siswa =
                siswaMap.get(p.siswa_id) ||
                siswaList.find(
                  (s) => s.nama.trim().toLowerCase() === p.nama.trim().toLowerCase()
                );
              return siswa?.angkatan === selectedAngkatan;
            });
      return {
        ...day,
        petugas: filtered,
      };
    });
  }, [jadwal, selectedAngkatan, siswaMap, siswaList]);

  const maxPetugas = Math.max(1, ...filteredJadwal.map((j) => j.petugas.length));

  // Total petugas saat ini
  const totalPetugasFiltered = useMemo(() => {
    return filteredJadwal.reduce((acc, curr) => acc + curr.petugas.length, 0);
  }, [filteredJadwal]);

  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header + Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-12 bg-yellow-500 rounded-full" />
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">
                Jadwal
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                Jadwal Piket Kebersihan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Menampilkan {totalPetugasFiltered} petugas piket{" "}
                {selectedAngkatan !== "Semua" ? `(${selectedAngkatan})` : "seluruh angkatan"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-auto">
            {canManagePiket && (
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex items-center gap-2 bg-slate-900 text-white font-bold px-4 py-2.5 rounded-2xl text-xs hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              >
                <Settings className="w-4 h-4 text-yellow-400" />
                Atur Jadwal Piket
              </button>
            )}

            {/* Sortiran / Filter by Angkatan */}
            <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200 gap-1 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1.5 hidden sm:flex">
                <Filter className="w-3.5 h-3.5 text-yellow-600" />
                Filter:
              </span>
              {angkatanOptions.map((ang) => {
                const isActive = selectedAngkatan === ang.key;
                return (
                  <button
                    key={ang.key}
                    type="button"
                    onClick={() => setSelectedAngkatan(ang.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-yellow-500 text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-gray-200/60"
                    }`}
                  >
                    {ang.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TABEL JADWAL — Senin–Jumat */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-slate-900 text-slate-400 text-xs font-bold uppercase tracking-wider px-5 py-4 text-left w-36 sticky left-0 z-10 border-b border-slate-800">
                    Petugas
                  </th>
                  {filteredJadwal.map((col) => {
                    const today = isToday(col.dayIndex);
                    return (
                      <th
                        key={`th-${col.dayIndex}`}
                        className={`text-center px-4 py-4 font-bold text-sm transition-colors border-b border-slate-800 ${
                          today ? "bg-yellow-500 text-slate-900" : "bg-slate-900 text-white"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{col.hari}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              today
                                ? "bg-slate-900 text-yellow-400"
                                : "bg-white/10 text-gray-300"
                            }`}
                          >
                            {today ? "Hari Ini" : `${col.petugas.length} Siswa`}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: maxPetugas }).map((_, rowIndex) => (
                  <tr
                    key={`tr-${rowIndex}`}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  >
                    <td className="px-5 py-3.5 sticky left-0 bg-inherit border-r border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {rowIndex + 1}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          Petugas {rowIndex + 1}
                        </span>
                      </div>
                    </td>

                    {filteredJadwal.map((col) => {
                      const petugasObj = col.petugas[rowIndex] ?? null;
                      const today = isToday(col.dayIndex);
                      const siswaObj = petugasObj
                        ? siswaMap.get(petugasObj.siswa_id) ||
                          siswaList.find(
                            (s) =>
                              s.nama.trim().toLowerCase() ===
                              petugasObj.nama.trim().toLowerCase()
                          )
                        : null;

                      return (
                        <td
                          key={`td-${col.dayIndex}-${rowIndex}`}
                          className={`px-3 py-3 text-center transition-colors ${
                            today ? "bg-yellow-50/60" : ""
                          }`}
                        >
                          {petugasObj ? (
                            <div className="inline-flex flex-col items-center gap-1">
                              <span
                                className={`inline-block whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs ${
                                  today
                                    ? "bg-yellow-100 text-yellow-900 border border-yellow-300 font-bold"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {petugasObj.nama}
                              </span>
                              {selectedAngkatan === "Semua" && siswaObj?.angkatan && (
                                <span className="text-[10px] font-medium text-slate-400">
                                  {siswaObj.angkatan === "Kelas XII (PKL)"
                                    ? "Kelas XII"
                                    : siswaObj.angkatan}
                                </span>
                              )}
                            </div>
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

