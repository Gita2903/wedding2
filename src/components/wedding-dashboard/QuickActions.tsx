"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { GroupIcon, DollarLineIcon, CalenderIcon, DocsIcon } from "@/icons";

export default function QuickActions() {
  const actions = [
    { name: "Tambah Vendor", icon: <GroupIcon className="h-6 w-6" />, path: "/vendors", bg: "bg-blue-50 text-blue-500 dark:bg-blue-500/10" },
    { name: "Catat Pengeluaran", icon: <DollarLineIcon className="h-6 w-6" />, path: "/budget", bg: "bg-success-50 text-success-500 dark:bg-success-500/10" },
    { name: "Update Timeline", icon: <CalenderIcon className="h-6 w-6" />, path: "/timeline", bg: "bg-brand-50 text-brand-500 dark:bg-brand-500/10" },
    { name: "Cek Dokumen", icon: <DocsIcon className="h-6 w-6" />, path: "/documents", bg: "bg-orange-50 text-orange-500 dark:bg-orange-500/10" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Aksi Cepat
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            href={action.path}
            className="flex flex-col items-center justify-center rounded-xl border border-gray-100 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50/50 dark:border-gray-800 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${action.bg}`}>
              {action.icon}
            </div>
            <span className="text-center text-xs font-medium text-gray-700 dark:text-gray-300">
              {action.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
