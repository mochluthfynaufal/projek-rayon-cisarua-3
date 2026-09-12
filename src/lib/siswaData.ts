// ─────────────────────────────────────────────────────────────────────────────
// SUMBER DATA TUNGGAL — Siswa Rayon Cisarua 3
// File ini digunakan oleh:
//   - src/app/belajar/components/DaftarSiswa.tsx   (halaman Belajar)
//   - src/app/components/EnhancedStats.tsx          (beranda / statistik)
//
// Cukup ubah data di sini, semua halaman akan otomatis ter-update.
// ─────────────────────────────────────────────────────────────────────────────

export type Jabatan = "Ketua" | "Wakil Ketua" | "Sekretaris" | "Bendahara" | "Anggota";
export type Angkatan = "Kelas X" | "Kelas XI" | "Kelas XII (PKL)" | "Alumni";

export interface Siswa {
  id: number;
  nama: string;
  nis: string;
  jabatan: Jabatan;
  angkatan: Angkatan;
  tahunAngkatan: string;
  inisial: string;
  warnaBg: string;
}

export const daftarSiswa: Siswa[] = [
  // ── KELAS XI (Aktif) ──────────────────────────────────────────────────────
  { id: 1,  nama: "Al'Fika Dwi Cahyani",           nis: "12510816", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "AF", warnaBg: "bg-cyan-600"   },
  { id: 2,  nama: "Bagas Dizwar Asfas",            nis: "12510875", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "BD", warnaBg: "bg-sky-500"    },
  { id: 3,  nama: "Fadlan Ahmad Jamil Al Ayubi",   nis: "12510938", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "FA", warnaBg: "bg-slate-600"  },
  { id: 4,  nama: "Fadliansyah Venanda",           nis: "12510940", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "FV", warnaBg: "bg-yellow-600" },
  { id: 5,  nama: "Haphinatul Shafira",            nis: "12510978", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "HS", warnaBg: "bg-orange-500" },
  { id: 6,  nama: "Moch Luthfy Naufal",            nis: "12511074", jabatan: "Bendahara",   angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "ML", warnaBg: "bg-purple-600" },
  { id: 7,  nama: "Muhamad Aditya Abdilah",        nis: "12511087", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "MA", warnaBg: "bg-lime-600"   },
  { id: 8,  nama: "Muhamad Azwan Muzaki",          nis: "12511094", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "MM", warnaBg: "bg-indigo-600" },
  { id: 9,  nama: "Muhamad Fadilah",               nis: "12511101", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "MF", warnaBg: "bg-blue-500"   },
  { id: 10, nama: "Muhamad Fedliansyah Ilham",     nis: "12511108", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "MF", warnaBg: "bg-violet-600" },
  { id: 11, nama: "Muhammad Rafliansyah Putra",    nis: "12511202", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "MR", warnaBg: "bg-red-600"    },
  { id: 12, nama: "Nadira Dewanti Putri",          nis: "12511233", jabatan: "Sekretaris",  angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "ND", warnaBg: "bg-pink-600"   },
  { id: 13, nama: "Ridwan Faiz Rojabi",            nis: "12511336", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "RF", warnaBg: "bg-green-500"  },
  { id: 14, nama: "Salsabila Destiana Putri",      nis: "12511344", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "SD", warnaBg: "bg-fuchsia-600"},
  { id: 15, nama: "Sandy Prayogo",                 nis: "12511347", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "SP", warnaBg: "bg-slate-500"  },
  { id: 16, nama: "Siti Aliya Zhafirah",           nis: "12511365", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "SZ", warnaBg: "bg-purple-500" },
  { id: 17, nama: "Syifa Dwi Anggraini",           nis: "12511391", jabatan: "Wakil Ketua", angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "SA", warnaBg: "bg-rose-600"   },
  { id: 18, nama: "Zaghita Rahmah Firdaus",        nis: "12511415", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "ZR", warnaBg: "bg-teal-600"   },
  { id: 19, nama: "Zyad Abdillah",                 nis: "12511425", jabatan: "Anggota",     angkatan: "Kelas XI", tahunAngkatan: "2025/2026", inisial: "ZA", warnaBg: "bg-fuchsia-500"},

  // ── KELAS X (Aktif) ───────────────────────────────────────────────────────
  { id: 20, nama: "Adhwa Baihaqi",                 nis: "12611434", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "AB", warnaBg: "bg-pink-500"    },
  { id: 21, nama: "Alisya Zahwa Nurlatifah",       nis: "12611468", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "AZ", warnaBg: "bg-lime-500"    },
  { id: 22, nama: "Chieka Sharlie Wulandari",      nis: "12611539", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "CS", warnaBg: "bg-yellow-500"  },
  { id: 23, nama: "Daniel Kurniawan",              nis: "12611548", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "DK", warnaBg: "bg-blue-600"    },
  { id: 24, nama: "Danisha Aniq Ayasha Firgiansa", nis: "12611549", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "DA", warnaBg: "bg-rose-500"    },
  { id: 25, nama: "Dervy Alita Wijaya",            nis: "12611560", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "DW", warnaBg: "bg-emerald-600" },
  { id: 26, nama: "Dinda Aqila Nurfadilah",        nis: "12611572", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "DN", warnaBg: "bg-amber-500"   },
  { id: 27, nama: "Ferhika Putri Maulidina",       nis: "12611612", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "FP", warnaBg: "bg-teal-500"    },
  { id: 28, nama: "M Zafa Zulprana",               nis: "12611692", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "MZ", warnaBg: "bg-green-600"   },
  { id: 29, nama: "Muhammad Asrul Gunawan",        nis: "12611795", jabatan: "Ketua",   angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "MA", warnaBg: "bg-amber-600"   },
  { id: 30, nama: "Muhammad Faris Hisyam Azizi",   nis: "12611807", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "MH", warnaBg: "bg-orange-600"  },
  { id: 31, nama: "Muhammad Naufal Alkahfi",       nis: "12611831", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "MN", warnaBg: "bg-sky-600"     },
  { id: 32, nama: "Mustafa Habibi Agnia",          nis: "12611861", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "MH", warnaBg: "bg-cyan-700"    },
  { id: 33, nama: "Rizky Ikhsan Maulana",          nis: "12611961", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "RI", warnaBg: "bg-indigo-500"  },
  { id: 34, nama: "Sifa Aulia",                    nis: "12611987", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "SI", warnaBg: "bg-red-500"     },
  { id: 35, nama: "Siti Erfina Nurmawati",         nis: "12611994", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "SE", warnaBg: "bg-emerald-500" },
  { id: 36, nama: "Viona Oktora Mulyana Putri",    nis: "12612043", jabatan: "Anggota", angkatan: "Kelas X", tahunAngkatan: "2026/2027", inisial: "VO", warnaBg: "bg-violet-500"  },

  // ── KELAS XII (PKL) — PLACEHOLDER ────────────────────────────────────────
  { id: 37, nama: "Siswa XII-01", nis: "12410001", jabatan: "Ketua",      angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P1", warnaBg: "bg-blue-600"   },
  { id: 38, nama: "Siswa XII-02", nis: "12410002", jabatan: "Wakil Ketua",angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P2", warnaBg: "bg-indigo-600" },
  { id: 39, nama: "Siswa XII-03", nis: "12410003", jabatan: "Sekretaris", angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P3", warnaBg: "bg-violet-600" },
  { id: 40, nama: "Siswa XII-04", nis: "12410004", jabatan: "Bendahara",  angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P4", warnaBg: "bg-sky-600"    },
  { id: 41, nama: "Siswa XII-05", nis: "12410005", jabatan: "Anggota",    angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P5", warnaBg: "bg-blue-700"   },
  { id: 42, nama: "Siswa XII-06", nis: "12410006", jabatan: "Anggota",    angkatan: "Kelas XII (PKL)", tahunAngkatan: "2024/2025", inisial: "P6", warnaBg: "bg-cyan-700"   },

  // ── ALUMNI — PLACEHOLDER ─────────────────────────────────────────────────
  { id: 43, nama: "Alumni RC3-01", nis: "2110001", jabatan: "Anggota", angkatan: "Alumni", tahunAngkatan: "Lulus 2024", inisial: "A1", warnaBg: "bg-gray-500" },
  { id: 44, nama: "Alumni RC3-02", nis: "2110002", jabatan: "Anggota", angkatan: "Alumni", tahunAngkatan: "Lulus 2024", inisial: "A2", warnaBg: "bg-gray-600" },
  { id: 45, nama: "Alumni RC3-03", nis: "2110003", jabatan: "Anggota", angkatan: "Alumni", tahunAngkatan: "Lulus 2024", inisial: "A3", warnaBg: "bg-gray-700" },
  { id: 46, nama: "Alumni RC3-04", nis: "2110004", jabatan: "Anggota", angkatan: "Alumni", tahunAngkatan: "Lulus 2023", inisial: "A4", warnaBg: "bg-slate-500" },
  { id: 47, nama: "Alumni RC3-05", nis: "2110005", jabatan: "Anggota", angkatan: "Alumni", tahunAngkatan: "Lulus 2023", inisial: "A5", warnaBg: "bg-slate-600" },
];

// ── Helper: hitung siswa aktif (Kelas X, XI, XII PKL — bukan Alumni) ─────────
export const jumlahSiswaAktif = daftarSiswa.filter(
  (s) => s.angkatan !== "Alumni"
).length;

// ── Helper: hitung per angkatan ───────────────────────────────────────────────
export const jumlahPerAngkatan = {
  kelasX:   daftarSiswa.filter((s) => s.angkatan === "Kelas X").length,
  kelasXI:  daftarSiswa.filter((s) => s.angkatan === "Kelas XI").length,
  kelasXII: daftarSiswa.filter((s) => s.angkatan === "Kelas XII (PKL)").length,
  alumni:   daftarSiswa.filter((s) => s.angkatan === "Alumni").length,
};
