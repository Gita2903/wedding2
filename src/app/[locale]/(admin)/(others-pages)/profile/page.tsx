import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DangerZone from "@/components/user-profile/DangerZone";
import Security from "@/components/user-profile/Security";
import WeddingInfoCard from "@/components/user-profile/WeddingInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil | Nol ke Nikah",
  description: "Kelola informasi akun dan data pernikahan kamu.",
};

export default function Profile() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Profil" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/3">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <WeddingInfoCard />
          <Security />
          <DangerZone />
        </div>
      </div>
    </div>
  );
}
