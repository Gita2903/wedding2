"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import Badge from "../ui/badge/Badge";
import { GroupIcon } from "@/icons";

const STATUS_COLORS: Record<string, "light" | "warning" | "success" | "error" | "primary" | "info"> = {
  Riset: "light",
  Nego: "warning",
  Booked: "info",
  DP: "primary",
  Lunas: "success",
  Dibatalkan: "error",
};

export default function VendorFollowUp() {
  const { data } = useWedding();

  const followUpVendors = data.vendors
    .filter((v) => v.status === "Riset" || v.status === "Nego")
    .sort((a, b) => {
      if (a.status === "Nego" && b.status !== "Nego") return -1;
      if (a.status !== "Nego" && b.status === "Nego") return 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 5);

  const bookedCount = data.vendors.filter((v) => v.status === "Booked" || v.status === "DP" || v.status === "Lunas").length;
  const totalVendors = data.vendors.length;
  const bookPercent = totalVendors > 0 ? Math.round((bookedCount / totalVendors) * 100) : 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GroupIcon className="h-5 w-5 text-brand-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Status Vendor
          </h3>
        </div>
        <Link href="/vendors" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Lihat Semua
        </Link>
      </div>

      {/* Summary bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">Vendor ter-book</span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">{bookedCount}/{totalVendors}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-success-500 transition-all duration-500"
            style={{ width: `${bookPercent}%` }}
          ></div>
        </div>
      </div>

      {followUpVendors.length > 0 ? (
        <div className="flex-grow space-y-2">
          <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            Perlu Follow-up
          </p>
          {followUpVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/30 dark:border-gray-800 dark:bg-white/5 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">{vendor.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500">{vendor.category}</span>
                  {vendor.contact && (
                    <>
                      <span className="text-gray-300 dark:text-gray-700">·</span>
                      <span className="text-xs text-gray-400">{vendor.contact}</span>
                    </>
                  )}
                </div>
              </div>
              <Badge
                color={STATUS_COLORS[vendor.status] || "light"}
                size="sm"
                variant="light"
              >
                {vendor.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50 dark:bg-success-500/10">
            <GroupIcon className="h-5 w-5 text-success-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Semua vendor aman!</p>
            <p className="mt-0.5 text-xs text-gray-400">Tidak ada vendor yang perlu follow-up.</p>
          </div>
        </div>
      )}
    </div>
  );
}
