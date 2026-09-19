"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (isLoaded && !data?.onboardingComplete) {
      router.push("/onboarding");
    }
  }, [isLoaded, data, router]);

  if (!isLoaded || !data.onboardingComplete) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {data.inviteCode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 dark:border-brand-500/30 dark:bg-brand-500/10">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Kode undangan pasangan</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Bagikan kode ini agar pasangan dapat bergabung.</p>
          </div>
          <code className="rounded-md bg-white px-3 py-2 text-sm font-semibold tracking-wide text-brand-700 dark:bg-gray-800 dark:text-brand-300">
            {data.inviteCode}
          </code>
        </div>
      )}

      {/* Row 1: Hero cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
        <WeddingCountdown />
        <OverallProgress />
        <BudgetSummaryCard />
      </div>

      {/* Row 2: Content cards */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-3">
        {/* CurrentPhaseCard takes 2 columns */}
        <div className="xl:col-span-2">
          <CurrentPhaseCard />
        </div>
        {/* VendorFollowUp takes 1 column */}
        <VendorFollowUp />
      </div>

      {/* Row 3: Quick actions full width */}
      <QuickActions />
    </div>
  );
}
