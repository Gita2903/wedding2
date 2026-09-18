import React from "react";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Button from "../../ui/button/Button";

interface StepProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function StepCoupleName({ data, updateData, nextStep }: StepProps) {
  const isValid = data.groomName.trim() !== "" && data.brideName.trim() !== "";

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-title-md font-bold text-gray-800 dark:text-white/90 mb-2">
          Kenalan Dulu Yuk!
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Siapa nama pasangan berbahagia ini?
        </p>
      </div>

      <div className="space-y-6 flex-grow">
        <div>
          <Label>Nama Mempelai Pria</Label>
          <Input
            type="text"
            placeholder="Contoh: Romeo"
            value={data.groomName}
            onChange={(e) => updateData({ groomName: e.target.value })}
          />
        </div>
        <div>
          <Label>Nama Mempelai Wanita</Label>
          <Input
            type="text"
            placeholder="Contoh: Juliet"
            value={data.brideName}
            onChange={(e) => updateData({ brideName: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={nextStep} disabled={!isValid}>
          Lanjut
        </Button>
      </div>
    </div>
  );
}
