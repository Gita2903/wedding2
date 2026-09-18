"use client";

import { Religion, useWedding } from "@/context/WeddingContext";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import StepCoupleName from "./steps/StepCoupleName";
import StepWeddingDate from "./steps/StepWeddingDate";
import StepBudget from "./steps/StepBudget";
import StepGuestsLocation from "./steps/StepGuestsLocation";
import StepReligionCustoms from "./steps/StepReligionCustoms";
import StepConfirmation from "./steps/StepConfirmation";

export default function OnboardingWizard() {
  const router = useRouter();
  const { data, updateData } = useWedding();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Temporary state for the wizard so we don't pollute global state until finish
  const [wizardData, setWizardData] = useState<{
    groomName: string;
    brideName: string;
    weddingDate: string | null;
    estimatedBudget: number;
    estimatedGuests: number;
    city: string;
    religion: Religion | "";
    customs: string[];
  }>({
    groomName: data.groomName || "",
    brideName: data.brideName || "",
    weddingDate: data.weddingDate || null,
    estimatedBudget: data.estimatedBudget || 0,
    estimatedGuests: data.estimatedGuests || 0,
    city: data.city || "",
    religion: data.religion || "",
    customs: data.customs || [],
  });

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const finishWizard = () => {
    updateData({ ...wizardData, onboardingComplete: true });
    // Note: Timeline generation would happen here
    router.push("/");
  };

  const updateWizardData = (newData: Partial<typeof wizardData>) => {
    setWizardData({ ...wizardData, ...newData });
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-sm sm:p-10 dark:bg-gray-900">
      <div className="mb-8">
        {/* Progress Bar */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -z-10 w-full -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div
            className="absolute left-0 top-1/2 -z-10 h-1 -translate-y-1/2 bg-brand-500 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>

          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
                i + 1 <= currentStep
                  ? "bg-brand-500 text-white shadow-brand-500/30 shadow-lg"
                  : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <StepCoupleName data={wizardData} updateData={updateWizardData} nextStep={nextStep} />
        )}
        {currentStep === 2 && (
          <StepWeddingDate data={wizardData} updateData={updateWizardData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 3 && (
          <StepBudget data={wizardData} updateData={updateWizardData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 4 && (
          <StepGuestsLocation data={wizardData} updateData={updateWizardData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 5 && (
          <StepReligionCustoms data={wizardData} updateData={updateWizardData} nextStep={nextStep} prevStep={prevStep} />
        )}
        {currentStep === 6 && (
          <StepConfirmation data={wizardData} prevStep={prevStep} finishWizard={finishWizard} />
        )}
      </div>
    </div>
  );
}
