"use client";
import { useState, useCallback, useEffect } from "react";
import { RotateCcw, Trophy, CheckCircle, XCircle, Target, Users } from "lucide-react";

// ── Data dari jadwal piket asli ──────────────────────────────────────────────
const JADWAL = [
  { hari: "Senin",  dayId: 1, warna: "bg-yellow-500", border: "border-yellow-400", text: "text-yellow-700", singkat: "Sen" },
  { hari: "Selasa", dayId: 2, warna: "bg-blue-500",   border: "border-blue-400",   text: "text-blue-700",   singkat: "Sel" },
  { hari: "Rabu",   dayId: 3, warna: "bg-green-600",  border: "border-green-400",  text: "text-green-700",  singkat: "Rab" },
  { hari: "Kamis",  dayId: 4, warna: "bg-purple-600", border: "border-purple-400", text: "text-purple-700", singkat: "Kam" },
  { hari: "Jumat",  dayId: 5, warna: "bg-red-500",    border: "border-red-400",    text: "text-red-700",    singkat: "Jum" },
];

// Ambil 2 siswa per hari = 10 soal total (mudah dimainkan)
const SEMUA_SISWA = [
  { id: 1,  name: "Chieka Sharlie Wulandari",     dayId: 1 },
  { id: 2,  name: "Daniel Kurniawan",              dayId: 1 },
  { id: 3,  name: "Al'Fika Dwi Cahyani",           dayId: 2 },
  { id: 4,  name: "Fadlan Ahmad Jamil Al Ayubi",   dayId: 2 },
  { id: 5,  name: "Dervy Alita Wijaya",            dayId: 3 },
  { id: 6,  name: "Muhammad Naufal Alkahfi",       dayId: 3 },
  { id: 7,  name: "Adhwa Baihaqi",                 dayId: 4 },
  { id: 8,  name: "Danisha Aniq Ayasha Firgiansa", dayId: 4 },
  { id: 9,  name: "Alisya Zahwa Nurlatifah",       dayId: 5 },
  { id: 10, name: "Bagas Dizwar Asfas",            dayId: 5 },
];

// Acak urutan array (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SortingSampahGame() {
  const [items, setItems]           = useState<typeof SEMUA_SISWA>([]);
  const [selected, setSelected]     = useState<number | null>(null);        // id siswa
  const [done, setDone]             = useState<number[]>([]);               // id yang sudah benar
  const [wrong, setWrong]           = useState<number | null>(null);        // dayId yang salah diklik
  const [score, setScore]           = useState(0);
  const [attempts, setAttempts]     = useState(0);
  const [feedback, setFeedback]     = useState<{ msg: string; ok: boolean } | null>(null);
  const [mounted, setMounted]       = useState(false);

  const initGame = useCallback(() => {
    setItems(shuffle(SEMUA_SISWA));
    setSelected(null);
    setDone([]);
    setWrong(null);
    setScore(0);
    setAttempts(0);
    setFeedback(null);
  }, []);

  useEffect(() => { initGame(); setMounted(true); }, [initGame]);

  const remaining = items.filter(i => !done.includes(i.id));
  const gameComplete = mounted && done.length === SEMUA_SISWA.length;
  const accuracy = attempts > 0 ? Math.round((score / (attempts * 10)) * 100) : 0;

  const handleSelect = (id: number) => {
    setSelected(prev => prev === id ? null : id);
    setWrong(null);
  };

  const handleBin = (dayId: number) => {
    if (selected === null) return;
    const siswa = items.find(i => i.id === selected)!;
    const ok = siswa.dayId === dayId;
    setAttempts(p => p + 1);

    if (ok) {
      setScore(p => p + 10);
      setDone(p => [...p, siswa.id]);
      setFeedback({ msg: `✓ Benar! ${siswa.name} → ${JADWAL.find(h => h.dayId === dayId)?.hari}`, ok: true });
      setSelected(null);
    } else {
      setWrong(dayId);
      setFeedback({ msg: `✗ Salah! Coba hari lain.`, ok: false });
      // jangan hapus selected supaya user bisa coba lagi
    }
    setTimeout(() => { setFeedback(null); setWrong(null); }, 1800);
  };

  if (!mounted) {
    return (
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto h-72 bg-gray-100 rounded-2xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="w-full py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1 h-10 bg-yellow-500 rounded-full" />
          <div>
            <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Mini Game</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">Game Piket Kelas</h2>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-8 max-w-lg leading-relaxed">
          Pilih nama siswa di bawah, lalu klik hari piket yang tepat. Seberapa hafal kamu jadwal piket kelas?
        </p>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Skor",   value: score,          Icon: Trophy, color: "text-yellow-600 bg-yellow-50"  },
            { label: "Akurasi",value: `${accuracy}%`, Icon: Target, color: "text-blue-600   bg-blue-50"    },
            { label: "Sisa",   value: remaining.length,Icon: Users, color: "text-green-600  bg-green-50"   },
          ].map(({ label, value, Icon, color }, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl px-4 py-3 border border-gray-200 ${color.split(" ")[1]}`}>
              <Icon className={`w-5 h-5 flex-shrink-0 ${color.split(" ")[0]}`} />
              <div>
                <p className={`text-xl font-bold ${color.split(" ")[0]}`}>{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback Toast */}
        {feedback && (
          <div className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all ${
            feedback.ok
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50   border-red-200   text-red-800"
          }`}>
            {feedback.ok ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {feedback.msg}
          </div>
        )}

        {/* Game Complete Banner */}
        {gameComplete && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-800 mb-1">Selamat! Semua Berhasil Dicocokkan 🎉</h3>
            <p className="text-gray-600 text-sm mb-4">
              Akurasi akhirmu: <span className="font-bold text-green-700">{accuracy}%</span> &nbsp;·&nbsp; Total skor: <span className="font-bold text-yellow-700">{score}</span>
            </p>
            <button onClick={initGame} className="inline-flex items-center gap-2 bg-yellow-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-600 transition-colors">
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
          </div>
        )}

        {!gameComplete && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">

            {/* ── Daftar Siswa (cards grid, urutan diacak) ── */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              1 · Pilih nama siswa
            </p>
            <div className="flex flex-wrap gap-2 mb-8 min-h-[56px]">
              {remaining.map(siswa => {
                const isSelected = selected === siswa.id;
                return (
                  <button
                    key={siswa.id}
                    onClick={() => handleSelect(siswa.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-semibold shadow-sm transition-all duration-150 ${
                      isSelected
                        ? "bg-yellow-50 border-yellow-400 text-yellow-800 scale-105 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:shadow"
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
                    {siswa.name}
                  </button>
                );
              })}
              {remaining.length === 0 && !gameComplete && (
                <p className="text-gray-400 text-sm italic">Semua siswa sudah ditempatkan!</p>
              )}
            </div>

            {/* ── Bin Hari Piket ── */}
            <p className={`text-xs font-semibold uppercase tracking-wide mb-3 transition-colors ${
              selected !== null ? "text-yellow-600" : "text-gray-400"
            }`}>
              2 · Klik hari piket yang tepat {selected === null && "(pilih siswa dulu)"}
            </p>
            <div className="grid grid-cols-5 gap-3">
              {JADWAL.map(hari => {
                const isWrong    = wrong === hari.dayId;
                const solvedCount = done.filter(id => items.find(i => i.id === id)?.dayId === hari.dayId).length;
                return (
                  <button
                    key={hari.dayId}
                    onClick={() => handleBin(hari.dayId)}
                    disabled={selected === null}
                    className={`relative rounded-2xl border-2 py-5 text-center transition-all duration-150 ${
                      isWrong
                        ? "border-red-400 bg-red-50 animate-pulse"
                        : selected !== null
                        ? `${hari.border} bg-white hover:shadow-md hover:scale-105 cursor-pointer`
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className={`w-10 h-10 ${hari.warna} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                      <span className="text-white font-extrabold text-sm">{hari.singkat}</span>
                    </div>
                    <p className={`font-bold text-xs ${hari.text}`}>{hari.hari}</p>
                    {solvedCount > 0 && (
                      <span className={`absolute -top-2 -right-2 w-5 h-5 ${hari.warna} text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
                        {solvedCount}
                      </span>
                    )}
                    {selected !== null && !isWrong && (
                      <p className="text-[10px] text-gray-400 mt-1">Klik!</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tombol Ulang */}
        {!gameComplete && (
          <div className="text-center">
            <button
              onClick={initGame}
              className="inline-flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Mulai Ulang
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
