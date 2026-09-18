"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { joinWedding } from "@/actions/wedding";

export default function OnboardingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "new" | "join">("choose");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await joinWedding(partnerEmail);
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Force reload to fetch the new wedding context
        window.location.href = "/";
      }
    } catch (err) {
      setError("Gagal bergabung. Pastikan email benar.");
      setLoading(false);
    }
  };

  if (mode === "new") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8 dark:bg-gray-900">
        <div className="w-full">
          <OnboardingWizard />
        </div>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8 dark:bg-gray-900">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gabung dengan Pasangan</h2>
          <p className="text-sm text-gray-500 mb-6">Masukkan email pasangan Anda yang sudah mendaftar dan membuat jadwal pernikahan.</p>
          
          {error && <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500">{error}</div>}

          <form onSubmit={handleJoin} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email Pasangan" 
              value={partnerEmail}
              onChange={(e) => setPartnerEmail(e.target.value)}
              required
            />
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setMode("choose")}>Batal</Button>
              <Button type="submit" disabled={loading}>{loading ? "Memproses..." : "Gabung"}</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8 dark:bg-gray-900">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Selamat Datang di Nol ke Nikah</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Apakah Anda akan membuat perencanaan baru atau bergabung dengan pasangan yang sudah mendaftar?</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button 
            onClick={() => setMode("new")}
            className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-gray-100 hover:border-brand-500 hover:bg-brand-50 transition-all dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
          >
            <div className="h-16 w-16 bg-brand-100 text-brand-500 rounded-full flex items-center justify-center mb-4 text-2xl">💍</div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Mulai Baru</h3>
            <p className="text-sm text-gray-500 mt-2">Buat rencana dan timeline pernikahan dari awal.</p>
          </button>

          <button 
            onClick={() => setMode("join")}
            className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-gray-100 hover:border-brand-500 hover:bg-brand-50 transition-all dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/10"
          >
            <div className="h-16 w-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 text-2xl">🤝</div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Gabung Pasangan</h3>
            <p className="text-sm text-gray-500 mt-2">Masuk ke rencana yang sudah dibuat pasangan Anda.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
