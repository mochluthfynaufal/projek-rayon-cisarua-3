// Helper untuk mengelola kata sandi pengguna Rayon Cisarua 3
// Menyimpan kata sandi yang telah diubah pengguna agar login selalu berhasil

const LOCAL_STORAGE_PASSWORDS_KEY = "rayon_cisarua_3_user_passwords";

interface StoredPasswords {
  [key: string]: string; // key: email atau NIS (lowercase), value: password
}

/**
 * Mengambil kata sandi khusus pengguna jika sudah pernah diubah.
 */
export function getCustomPassword(identifier: string): string | null {
  if (typeof window === "undefined" || !identifier) return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PASSWORDS_KEY);
    if (!raw) return null;
    const map: StoredPasswords = JSON.parse(raw);
    const key = identifier.trim().toLowerCase();
    const cleanKey = key.replace(/[^a-z0-9]/g, "");
    return map[key] || map[cleanKey] || null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan kata sandi baru untuk pengguna berdasarkan email & NIS.
 */
export function saveCustomPassword(
  email: string | null | undefined,
  nis: string | null | undefined,
  newPassword: string,
  nama?: string | null | undefined
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PASSWORDS_KEY);
    const map: StoredPasswords = raw ? JSON.parse(raw) : {};

    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      map[cleanEmail] = newPassword;
      const username = cleanEmail.split("@")[0];
      if (username) {
        map[username] = newPassword;
        map[username.replace(/[^a-z0-9]/g, "")] = newPassword;
      }
    }
    if (nis) {
      const cleanNis = nis.trim().toLowerCase();
      map[cleanNis] = newPassword;
    }
    if (nama) {
      const cleanNama = nama.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleanNama) map[cleanNama] = newPassword;
    }

    localStorage.setItem(LOCAL_STORAGE_PASSWORDS_KEY, JSON.stringify(map));
  } catch (err) {
    console.error("Gagal menyimpan kata sandi:", err);
  }
}

/**
 * Memverifikasi apakah kata sandi yang dimasukkan cocok
 * dengan kata sandi kustom yang telah diubah, atau kata sandi default (NIS / psrayoncisarua).
 */
export function verifyUserPassword(
  inputPass: string,
  options: {
    email?: string | null;
    nis?: string | null;
    defaultPassword?: string;
  }
): boolean {
  const { email, nis, defaultPassword } = options;

  // 1. Cek apakah ada custom password tersimpan
  const customPass =
    (email ? getCustomPassword(email) : null) ||
    (nis ? getCustomPassword(nis) : null);

  if (customPass) {
    return inputPass === customPass;
  }

  // 2. Jika belum pernah diubah, cocokkan dengan password default
  if (defaultPassword && inputPass === defaultPassword) {
    return true;
  }
  if (nis && inputPass === nis) {
    return true;
  }

  return false;
}
