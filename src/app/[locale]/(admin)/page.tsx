"use client";

import { useEffect, useState } from "react";
import { useWedding } from "@/context/WeddingContext";
import { useRouter } from "@/i18n/navigation";
import WeddingCountdown from "@/components/wedding-dashboard/WeddingCountdown";
import OverallProgress from "@/components/wedding-dashboard/OverallProgress";
import CurrentPhaseCard from "@/components/wedding-dashboard/CurrentPhaseCard";
import BudgetSummaryCard from "@/components/wedding-dashboard/BudgetSummaryCard";
import VendorFollowUp from "@/components/wedding-dashboard/VendorFollowUp";
import QuickActions from "@/components/wedding-dashboard/QuickActions";

export default function WeddingDashboard() {
  const { data, isLoaded } = useWedding();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      if (!data.onboardingComplete) {
        router.push("/onboarding");
      } else {
        setShouldRender(true);
      }
    }
  }, [isLoaded, data.onboardingComplete, router]);

  if (!shouldRender) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
      {/* Top Row: Important Metrics */}
      <div className="col-span-1 xl:col-span-1">
        <WeddingCountdown />
      </div>
      <div className="col-span-1 xl:col-span-1">
        <OverallProgress />
      </div>
      <div className="col-span-1 sm:col-span-2 xl:col-span-1">
        <BudgetSummaryCard />
      </div>

      {/* Middle Row: Content */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-2">
        <CurrentPhaseCard />
      </div>
      <div className="col-span-1 sm:col-span-2 xl:col-span-1">
        <VendorFollowUp />
      </div>

      {/* Bottom Row: Actions */}
      <div className="col-span-1 sm:col-span-2 xl:col-span-3">
        <QuickActions />
      </div>
    </div>
  );
}
