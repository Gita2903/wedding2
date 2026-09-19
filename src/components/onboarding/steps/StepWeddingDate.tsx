"use client";

import React from "react";
import { OnboardingFormData } from "@/context/WeddingContext";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";

interface StepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepWeddingDate({ data, updateData, nextStep, prevStep }: StepProps) {
  const isUnknown = data.weddingDate === null;
  const isValid = data.weddingDate !== "" || isUnknown;

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Kapan Hari Bahagianya?
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Untuk membantu kami menyusun timeline persiapanmu.
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <Label>Tanggal Pernikahan (Estimasi)</Label>
          <div className="relative">
            <input
              type="date"
              value={data.weddingDate ? new Date(data.weddingDate).toISOString().split('T')[0] : ""}
              onChange={(e) => {
                if (e.target.value) {
                  updateData({ weddingDate: new Date(e.target.value).toISOString() });
                }
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 disabled:cursor-default disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-500"
              disabled={isUnknown}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="unknownDate"
            checked={isUnknown}
            onChange={(e) => {
              if (e.target.checked) {
                updateData({ weddingDate: null });
              } else {
                updateData({ weddingDate: new Date().toISOString() });
              }
            }}
            className="w-5 h-5 text-brand-500 rounded border-gray-300 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-brand-500"
          />
          <label htmlFor="unknownDate" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Masih belum tau tanggal pastinya
          </label>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Kembali
        </Button>
        <Button onClick={nextStep} disabled={!isValid}>
          Lanjut
        </Button>
      </div>
    </div>
  );
}
