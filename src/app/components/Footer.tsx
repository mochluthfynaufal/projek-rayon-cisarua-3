"use client";
import Link from "next/link";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-slate-950 text-white py-16 px-4 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-[#FF6600] to-[#CC5200] p-2 rounded-full shadow-md shadow-[#FF6600]/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl bg-gradient-to-r from-[#FF6600] to-[#CC5200] bg-clip-text text-transparent">
                Cisarua 3
              </span>
            </div>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">
              Platform resmi informasi, struktur rayon, piket, serta apresiasi prestasi siswa Rayon Cisarua 3 SMK Wikrama Bogor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Navigasi Cepat</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/belajar"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Rayon & Struktur
                </Link>
              </li>
              <li>
                <Link
                  href="/galeri"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Galeri & Prestasi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#FF6600] transition-colors"
                >
                  Keluhan & Aspirasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white">Kontak & Lokasi</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#FF6600]" />
                <span>rayoncisarua3@smkwikrama.sch.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#FF6600]" />
                <span>+62 812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#FF6600]" />
                <span>SMK Wikrama Bogor, Jawa Barat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 text-center text-xs text-gray-500 space-y-1">
          <p>
            &copy; {new Date().getFullYear()} Rayon Cisarua 3 &middot; SMK Wikrama Bogor. All rights reserved.
          </p>
          <p className="text-gray-400">
            Dikelola bersama oleh Pembimbing Siswa & Pengurus Rayon Cisarua 3
          </p>
        </div>
      </div>
    </footer>
  );
}
