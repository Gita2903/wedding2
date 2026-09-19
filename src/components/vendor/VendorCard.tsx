"use client";

import React from "react";
import { Vendor } from "@/context/WeddingContext";
import Badge from "../ui/badge/Badge";

interface VendorCardProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
}

export default function VendorCard({ vendor, onClick }: VendorCardProps) {
  const getStatusColor = (status: Vendor["status"]) => {
    switch (status) {
      case "Riset": return "light";
      case "Nego": return "warning";
      case "Booked": return "info";
      case "DP": return "primary";
      case "Lunas": return "success";
      case "Dibatalkan": return "error";
      default: return "light";
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val).replace(",00", "");
  };

  return (
    <div 
      onClick={() => onClick(vendor)}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-500/50"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {vendor.name}
          </h4>
          <p className="mt-0.5 text-xs text-gray-500">{vendor.category}</p>
        </div>
        <Badge color={getStatusColor(vendor.status)} size="sm">
          {vendor.status}
        </Badge>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {vendor.priceQuote > 0 ? formatRupiah(vendor.priceQuote) : "Harga belum di-set"}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
        <p className="line-clamp-2 text-xs text-gray-500">
          {vendor.notes || "Belum ada catatan."}
        </p>
      </div>
    </div>
  );
}
