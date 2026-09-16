"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function KeluhanRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/contact");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-yellow-500 mb-3" />
      <p className="text-sm font-semibold text-slate-700">Mengalihkan ke Pusat Keluhan Rayon...</p>
    </div>
  );
}
