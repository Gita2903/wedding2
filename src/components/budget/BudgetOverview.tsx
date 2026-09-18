"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";

export default function BudgetOverview() {
  const { data } = useWedding();

  const totalBudget = data.estimatedBudget;
  const totalSpent = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val).replace(",00", "");
  };

  const isOverBudget = remaining < 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
        <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">
          {formatRupiah(totalBudget)}
        </h4>
      </div>
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</p>
        <h4 className="mt-1 text-2xl font-bold text-brand-500">
          {formatRupiah(totalSpent)}
        </h4>
        <div className="mt-2 relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              isOverBudget ? "bg-error-500" : percentSpent > 80 ? "bg-warning-500" : "bg-brand-500"
            }`}
            style={{ width: `${percentSpent}%` }}
          ></div>
        </div>
      </div>

      <div className={`rounded-2xl border p-5 shadow-sm ${isOverBudget ? 'border-error-200 bg-error-50 dark:border-error-500/20 dark:bg-error-500/10' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">Sisa Budget</p>
        <h4 className={`mt-1 text-2xl font-bold ${isOverBudget ? 'text-error-600 dark:text-error-500' : 'text-gray-800 dark:text-white/90'}`}>
          {formatRupiah(Math.abs(remaining))} {isOverBudget ? "(Over)" : ""}
        </h4>
      </div>
    </div>
  );
}
