"use client";

import React, { useState, useEffect } from "react";
import { Crown, UserCheck, FileText, Wallet, ArrowRight, Settings, Sparkles, Loader2 } from "lucide-react";
import { daftarSiswa as fallbackDaftarSiswa, Siswa } from "@/lib/siswaData";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import ModalEditPengurus, { PengurusItem } from "@/app/components/ModalEditPengurus";

const defaultPengurusData: PengurusItem[] = [
  {
    id: 1,
    peran: "Ketua Rayon",
    inisial: "KR",
    siswa_id: 8, // Muhamad Azwan Muzaki (TJKT)
    tugas: [
      "Memimpin dan mengkoordinir seluruh kegiatan rayon",
      "Menjadi penghubung utama antara anggota dengan Pembimbing Siswa (PS)",
      "Memimpin musyawarah, evaluasi, dan pembagian tugas rayon",
      "Bertanggung jawab atas ketertiban dan kehadiran rayon",
    ],
  },
  {
    id: 2,
    peran: "Wakil Ketua",
    inisial: "WK",
    siswa_id: 18, // Zaghita Rahmah Firdaus (KLN)
    tugas: [
      "Mendampingi dan membantu tugas ketua rayon",
      "Menggantikan ketua bila berhalangan hadir",
      "Membantu mengkoordinir kegiatan dan kedisiplinan",
      "Memastikan program kerja pengurus berjalan lancar",
    ],
  },
  {
    id: 3,
    peran: "Sekretaris",
    inisial: "SK",
    siswa_id: 5, // Haphinatul Shafira (DKV)
    tugas: [
      "Mencatat dan mendokumentasikan kegiatan rayon",
      "Mengurus administrasi, presensi, dan rekap rayon",
      "Membuat notulen dalam setiap evaluasi/rapat",
      "Mengelola arsip dokumen dan keluhan",
    ],
  },
  {
    id: 4,
    peran: "Bendahara",
    inisial: "BD",
    siswa_id: 1, // Al'Fika Dwi Cahyani (MPLB)
    tugas: [
      "Mengelola keuangan dan kas rayon secara transparan",
      "Mencatat seluruh pemasukan dan pengeluaran rayon",
      "Membuat laporan keuangan berkala",
      "Mengurus iuran kas dan kebutuhan operasional rayon",
    ],
  },
];

const aksenMap: Record<string, { card: string; icon: string; badge: string; initial: string; iconComp: any }> = {
  "Ketua Rayon": {
    card: "border-yellow-300 bg-yellow-50/70",
    icon: "bg-yellow-500",
    badge: "bg-yellow-100 text-yellow-800",
    initial: "bg-yellow-500",
    iconComp: Crown,
  },
  "Wakil Ketua": {
    card: "border-blue-200 bg-blue-50/70",
    icon: "bg-blue-600",
    badge: "bg-blue-100 text-blue-800",
    initial: "bg-blue-600",
    iconComp: UserCheck,
  },
  "Sekretaris": {
    card: "border-green-200 bg-green-50/70",
    icon: "bg-green-600",
    badge: "bg-green-100 text-green-800",
    initial: "bg-green-600",
    iconComp: FileText,
  },
  "Bendahara": {
    card: "border-purple-200 bg-purple-50/70",
    icon: "bg-purple-600",
    badge: "bg-purple-100 text-purple-800",
    initial: "bg-purple-600",
    iconComp: Wallet,
  },
};

export default function StrukturKelas() {
  const { role } = useAuth();
  const [pengurus, setPengurus] = useState<PengurusItem[]>(defaultPengurusData);
  const [siswaList, setSiswaList] = useState<Siswa[]>(fallbackDaftarSiswa);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Akses ubah pengurus: Khusus Guru/PS dan Admin
  const canManagePengurus = role === "guru" || role === "admin";

  const fetchStrukturData = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        // Ambil data siswa
        const { data: sData } = await supabase.from("siswa").select("*");
        if (sData && sData.length > 0) {
          const mapped: Siswa[] = sData.map((s) => ({
            id: s.id,
            nama: s.nama,
            nis: s.nis,
            jabatan: s.jabatan,
            angkatan: s.angkatan,
            tahunAngkatan: s.tahun_angkatan,
            inisial: s.inisial || s.nama.substring(0, 2).toUpperCase(),
            warnaBg: s.warna_bg || "bg-blue-600",
          }));
          setSiswaList(mapped);
        }

        // Ambil struktur pengurus
        const { data: pData } = await supabase
          .from("struktur_pengurus")
          .select("*")
          .order("urutan", { ascending: true });

        if (pData && pData.length > 0) {
          setPengurus(pData);
        }
      } else {
        const local = localStorage.getItem("custom_struktur_pengurus");
        if (local) {
          setPengurus(JSON.parse(local));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrukturData();
  }, []);

  return (
    <section className="w-full py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Section Label & Tombol Aksi */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 bg-yellow-500 rounded-full" />
            <div>
              <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Organisasi</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Struktur Pengurus Rayon</h2>
            </div>
          </div>

          {canManagePengurus && (
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <Settings className="w-4 h-4 text-yellow-400" />
              Atur Pengurus Rayon (Khusus Guru/Admin)
            </button>
          )}
        </div>

        {/* Kartu Pengurus — ID Card Style Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {pengurus.map((p) => {
            const aksen = aksenMap[p.peran] || aksenMap["Ketua Rayon"];
            const Icon = aksen.iconComp;
            const assignedSiswa = siswaList.find((s) => s.id === p.siswa_id);

            const displayName = assignedSiswa?.nama || p.nama_custom || "Belum Ditentukan";
            const displaySub = assignedSiswa
              ? `${assignedSiswa.angkatan} · NIS ${assignedSiswa.nis}`
              : "Menunggu penugasan Guru";
            const displayInisial = assignedSiswa?.inisial || p.inisial || "RC";

            return (
              <div
                key={p.id}
                className={`group border-2 ${aksen.card} rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white flex flex-col justify-between`}
              >
                <div>
                  {/* Card Header */}
                  <div className={`${aksen.icon} px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-white text-xs font-bold uppercase tracking-wide">{p.peran}</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                  </div>

                  {/* Avatar + Nama */}
                  <div className="p-5 text-center border-b border-gray-100">
                    <div className={`w-16 h-16 ${aksen.initial} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <span className="text-white font-extrabold text-xl">{displayInisial}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 leading-snug">{displayName}</h3>
                    <p className="text-[11px] text-gray-500 font-mono mb-2">{displaySub}</p>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${aksen.badge}`}>
                      {p.peran}
                    </span>
                  </div>

                  {/* Tugas */}
                  <div className="p-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Tugas & Tanggung Jawab</p>
                    <ul className="space-y-2">
                      {p.tugas.map((t, ti) => (
                        <li key={ti} className="flex items-start gap-2 text-xs text-gray-600">
                          <ArrowRight className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Edit Pengurus */}
      {isEditOpen && (
        <ModalEditPengurus
          daftarSiswa={siswaList}
          currentPengurus={pengurus}
          onClose={() => setIsEditOpen(false)}
          onSaved={(updated) => {
            setPengurus(updated);
            fetchStrukturData();
          }}
        />
      )}
    </section>
  );
}
