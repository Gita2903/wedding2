"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import Badge from "../ui/badge/Badge";

export default function VendorFollowUp() {
  const { data } = useWedding();

  // Show vendors that are in "Riset" or "Nego" status
  const followUpVendors = data.vendors
    .filter((v) => v.status === "Riset" || v.status === "Nego")
    .slice(0, 4);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Vendor Perlu Follow-up
        </h3>
        <Link href="/vendors" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Lihat Semua
        </Link>
      </div>

      {followUpVendors.length > 0 ? (
        <div className="flex-grow space-y-4">
          {followUpVendors.map((vendor) => (
            <div key={vendor.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0 dark:border-gray-800">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{vendor.name}</p>
                <p className="text-xs text-gray-500">{vendor.category}</p>
              </div>
              <Badge color={vendor.status === "Riset" ? "light" : "warning"} size="sm">
                {vendor.status}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center text-center text-gray-500">
          <p>Semua vendor aman & sudah ter-booking!</p>
        </div>
      )}
    </div>
  );
}
