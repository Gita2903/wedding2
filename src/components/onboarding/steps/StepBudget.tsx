"use client";

import React from "react";
import { OnboardingFormData } from "@/context/WeddingContext";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface StepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepBudget({ data, updateData, nextStep, prevStep }: StepProps) {
  const isValid = data.estimatedBudget > 0;

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    updateData({ estimatedBudget: Number(val) });
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Berapa Budget Kasarnya?
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Tenang, ini cuma estimasi awal. Nanti bisa diubah lagi kok.
        </p>
      </div>

      <div className="space-y-8 flex-grow">
        <div>
          <Label>Estimasi Total Budget</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
            <Input
              type="text"
              className="pl-12"
              placeholder="0"
              value={data.estimatedBudget === 0 ? "" : data.estimatedBudget.toLocaleString("id-ID")}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[50000000, 100000000, 250000000, 500000000].map((amount) => (
            <button
              key={amount}
              onClick={() => updateData({ estimatedBudget: amount })}
              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                data.estimatedBudget === amount
                  ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              {formatRupiah(amount).replace(",00", "")}
            </button>
          ))}
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
