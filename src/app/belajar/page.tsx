"use client";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

import ProfilWaliKelas   from "./components/ProfilWaliKelas";
import StrukturKelas     from "./components/StrukturKelas";
import DaftarSiswa       from "./components/DaftarSiswa";
import JadwalPiket       from "./components/JadwalPiket";
import GamePiket         from "./components/GamePiket";

export default function BelajarPage() {
  // ================================================================
  // BAGIAN INI TIDAK DIUBAH — props Navbar & Hero tetap persis sama
  // ================================================================
  const belajarHeroProps = {
    title: "Siap Buat Belajar?",
    rotatingTexts: [
      "Keren!",
      "Berarti Peduli!",
      "Patut Dicontoh!",
      "Berani Berubah!",
    ],
    subtitle:
      "Belajar mengelola sampah dengan cara yang menyenangkan dan bermanfaat.",
    primaryColor: "text-yellow-500",
    ctaPrimary: {
      text: "Mulai Belajar",
      action: () => console.log("Start learning!"),
    },
    ctaSecondary: {
      text: "Lihat Materi",
      action: () => console.log("Learn more clicked!"),
    },
    theme: {
      gradient: "bg-gradient-to-t from-yellow-500/50 to-white",
      primaryColor: "bg-yellow-500",
      primaryHover: "hover:bg-yellow-700",
      borderColor: "border-yellow-600",
      hoverBg: "hover:bg-yellow-50",
    },
  };
  // ================================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* ===================== JANGAN DIUBAH ===================== */}
      <Navbar />
      <Hero {...belajarHeroProps} />
      {/* ========================================================= */}

      {/* Profil Pembimbing Rayon */}
      <ProfilWaliKelas />

      {/* Struktur Pengurus Rayon */}
      <StrukturKelas />

      {/* Daftar Siswa — 3 Angkatan */}
      <DaftarSiswa />

      {/* Jadwal Piket */}
      <JadwalPiket />

      {/* Game Piket */}
      <GamePiket />

      <Footer />
    </div>
  );
}
