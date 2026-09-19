"use client";

import React, { useEffect, useState } from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import { CalenderIcon } from "@/icons";

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
      <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-500/10">
          <CalenderIcon className="h-6 w-6 text-brand-500" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-white/90">
          Belum Ada Tanggal Pasti?
        </h3>
        <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
          Tetapkan tanggal pernikahan untuk mengaktifkan countdown dan reminder otomatis.
        </p>
        <Link
          href="/onboarding"
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          Set Tanggal Nikah
        </Link>
      </div>
    );
  }

  const groom = data.groomName || "Groom";
  const bride = data.brideName || "Bride";
  const formattedDate = new Date(data.weddingDate).toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-6 text-white shadow-md dark:from-brand-700 dark:via-brand-600 dark:to-brand-900">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
      <div className="pointer-events-none absolute -start-8 -bottom-12 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
      <div className="pointer-events-none absolute end-4 top-4 text-6xl font-bold text-white/10 select-none">&</div>

      <div className="relative">
        <p className="mb-1 text-sm font-medium text-white/80">
          Menuju Hari Bahagia
        </p>
        <h3 className="mb-1 text-xl font-bold">
          {groom} <span className="font-light text-white/70">&amp;</span> {bride}
        </h3>
        <p className="mb-5 text-sm text-white/70">
          {formattedDate}
        </p>

        {timeLeft ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/15 py-2.5 backdrop-blur-sm">
              <span className="text-2xl font-bold tabular-nums">{timeLeft.d}</span>
              <span className="text-xs font-medium text-white/70">Hari</span>
            </div>
            <span className="text-lg font-bold text-white/40">:</span>
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/15 py-2.5 backdrop-blur-sm">
              <span className="text-2xl font-bold tabular-nums">{timeLeft.h}</span>
              <span className="text-xs font-medium text-white/70">Jam</span>
            </div>
            <span className="text-lg font-bold text-white/40">:</span>
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-white/15 py-2.5 backdrop-blur-sm">
              <span className="text-2xl font-bold tabular-nums">{timeLeft.m}</span>
              <span className="text-xs font-medium text-white/70">Menit</span>
            </div>
            <span className="hidden text-lg font-bold text-white/40 sm:block">:</span>
            <div className="hidden flex-1 flex-col items-center justify-center rounded-xl bg-white/15 py-2.5 backdrop-blur-sm sm:flex">
              <span className="text-2xl font-bold tabular-nums">{timeLeft.s}</span>
              <span className="text-xs font-medium text-white/70">Detik</span>
            </div>
          </div>
        ) : (
          <div className="h-[68px] animate-pulse rounded-xl bg-white/10"></div>
        )}
      </div>
    </div>
  );
}
