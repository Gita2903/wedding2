"use client";

import React, { useState } from "react";
import { OnboardingFormData } from "@/context/WeddingContext";
import Button from "../../ui/button/Button";

interface StepProps {
  data: OnboardingFormData;
  prevStep: () => void;
  finishWizard: () => void;
}

export default function StepConfirmation({ data, prevStep, finishWizard }: StepProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFinish = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      finishWizard();
    }, 1500);
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] animate-in fade-in duration-500">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
        <h3 className="mt-6 text-xl font-bold text-gray-800 dark:text-white/90">
          Menyusun Roadmap Pernikahan...
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-sm">
          Kami sedang membuat timeline, alokasi budget, dan checklist dokumen khusus untuk kalian.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
          {/* Diganti Pake Inline SVG Biar Aman Gak Bakal Undefined / Crash */}
          <svg
            className="h-8 w-8 text-success-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Yeay, Data Lengkap!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Pastikan informasinya benar sebelum kami buatkan roadmapnya.
        </p>
      </div>

      <div className="flex-grow">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-white/5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Pasangan</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                {data?.groomName || "-"} & {data?.brideName || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tanggal</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                {data?.weddingDate ? new Date(data.weddingDate).toLocaleDateString("id-ID", {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }) : "Belum ditentukan"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Budget</dt>
              <dd className="mt-1 text-base font-semibold text-brand-500">{formatRupiah(data?.estimatedBudget)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tamu & Lokasi</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                {data?.estimatedGuests || 0} orang di {data?.city || "-"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Agama & Adat</dt>
              <dd className="mt-1 text-base font-semibold text-gray-900 dark:text-white capitalize">
                {data?.religion || "-"} {data?.customs?.length > 0 ? `— ${data.customs.join(", ")}` : ""}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Kembali
        </Button>
        <Button onClick={handleFinish}>
          Generate Roadmap Saya
        </Button>
      </div>
    </div>
  );
}