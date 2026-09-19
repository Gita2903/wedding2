"use client";

import React from "react";
import { OnboardingFormData, Religion } from "@/context/WeddingContext";
import Label from "../../form/Label";
import Button from "../../ui/button/Button";

interface StepProps {
  data: OnboardingFormData;
  updateData: (data: Partial<OnboardingFormData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepReligionCustoms({ data, updateData, nextStep, prevStep }: StepProps) {
  const isValid = data.religion !== "";

  const religions = [
    { value: "", label: "Pilih Agama" },
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen Protestan" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "buddha", label: "Buddha" },
    { value: "konghucu", label: "Konghucu" },
  ];

  const commonCustoms = ["Jawa", "Sunda", "Batak", "Minang", "Bugis", "Bali", "Betawi", "Internasional / Nasional (Tanpa Adat Khusus)"];

  const toggleCustom = (custom: string) => {
    if (data.customs.includes(custom)) {
      updateData({ customs: data.customs.filter((c: string) => c !== custom) });
    } else {
      updateData({ customs: [...data.customs, custom] });
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Agama & Adat Istiadat
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Sangat penting untuk generate checklist dokumen legal.
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <Label>Agama (Legalitas)</Label>
          <select
            value={data.religion}
            onChange={(e) => updateData({ religion: e.target.value as Religion | "" })}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            {religions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Rencana Adat (Boleh pilih &gt; 1)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonCustoms.map((custom) => {
              const isSelected = data.customs.includes(custom);
              return (
                <button
                  key={custom}
                  onClick={() => toggleCustom(custom)}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {custom}
                </button>
              );
            })}
          </div>
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
