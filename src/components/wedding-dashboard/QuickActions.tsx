"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { GroupIcon, DollarLineIcon, CalenderIcon, DocsIcon, ArrowRightIcon } from "@/icons";

export default function QuickActions() {
  const actions = [
    {
      name: "Tambah Vendor",
      desc: "Kelola daftar vendor",
      icon: GroupIcon,
      path: "/vendors",
      iconBg: "bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/10",
      border: "hover:border-blue-light-200 dark:hover:border-blue-light-500/30",
    },
    {
      name: "Catat Pengeluaran",
      desc: "Update pembayaran",
      icon: DollarLineIcon,
      path: "/budget",
      iconBg: "bg-success-50 text-success-500 dark:bg-success-500/10",
      border: "hover:border-success-200 dark:hover:border-success-500/30",
    },
    {
      name: "Update Timeline",
      desc: "Atur roadmap persiapan",
      icon: CalenderIcon,
      path: "/timeline",
      iconBg: "bg-brand-50 text-brand-500 dark:bg-brand-500/10",
      border: "hover:border-brand-200 dark:hover:border-brand-500/30",
    },
    {
      name: "Cek Dokumen",
      desc: "Pantau dokumen pernikahan",
      icon: DocsIcon,
      path: "/documents",
      iconBg: "bg-orange-50 text-orange-500 dark:bg-orange-500/10",
      border: "hover:border-orange-200 dark:hover:border-orange-500/30",
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Aksi Cepat
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.path}
              className={`group flex flex-col items-start rounded-xl border border-gray-100 p-4 transition-all hover:shadow-sm dark:border-gray-800 ${action.border} hover:bg-gray-50/50 dark:hover:bg-white/5`}
            >
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg} transition-transform group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex w-full items-center justify-between gap-1">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {action.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {action.desc}
                  </p>
                </div>
                <ArrowRightIcon className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500 dark:text-gray-600" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
