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

export default function StepGuestsLocation({ data, updateData, nextStep, prevStep }: StepProps) {
  const isValid = data.estimatedGuests > 0 && data.city.trim() !== "";

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Skala Acara & Lokasi
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Untuk membantu alokasi budget venue dan catering.
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <Label>Estimasi Jumlah Tamu (Orang)</Label>
          <Input
            type="number"
            placeholder="Contoh: 500"
            value={data.estimatedGuests === 0 ? "" : data.estimatedGuests}
            onChange={(e) => updateData({ estimatedGuests: Number(e.target.value) })}
          />
        </div>

        <div>
          <Label>Kota Penyelenggaraan</Label>
          <Input
            type="text"
            placeholder="Contoh: Jakarta Selatan"
            value={data.city}
            onChange={(e) => updateData({ city: e.target.value })}
          />
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
