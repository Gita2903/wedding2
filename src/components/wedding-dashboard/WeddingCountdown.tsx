"use client";

import React, { useEffect, useState } from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import Button from "../ui/button/Button";

export default function WeddingCountdown() {
  const { data } = useWedding();
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!data.weddingDate) return;

    const targetDate = new Date(data.weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }

      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data.weddingDate]);

  if (!data.weddingDate) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">
          Belum Ada Tanggal Pasti?
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Tetapkan tanggal pernikahan untuk mengaktifkan countdown dan reminder otomatis.
        </p>
        <Link href="/onboarding">
          <Button>Set Tanggal Nikah</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand-500/10 blur-2xl"></div>
      
      <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
        Menuju Hari H
      </h3>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {new Date(data.weddingDate).toLocaleDateString("id-ID", {
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })}
      </p>

      {timeLeft ? (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-brand-50 py-3 dark:bg-brand-500/10">
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{timeLeft.d}</span>
            <span className="text-xs font-medium text-gray-500">Hari</span>
          </div>
          <span className="text-xl font-bold text-gray-300">:</span>
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-brand-50 py-3 dark:bg-brand-500/10">
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{timeLeft.h}</span>
            <span className="text-xs font-medium text-gray-500">Jam</span>
          </div>
          <span className="text-xl font-bold text-gray-300">:</span>
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-brand-50 py-3 dark:bg-brand-500/10">
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{timeLeft.m}</span>
            <span className="text-xs font-medium text-gray-500">Menit</span>
          </div>
          <span className="text-xl font-bold text-gray-300 hidden sm:block">:</span>
          <div className="hidden sm:flex flex-1 flex-col items-center justify-center rounded-xl bg-brand-50 py-3 dark:bg-brand-500/10">
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{timeLeft.s}</span>
            <span className="text-xs font-medium text-gray-500">Detik</span>
          </div>
        </div>
      ) : (
        <div className="h-[76px] animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"></div>
      )}
    </div>
  );
}
