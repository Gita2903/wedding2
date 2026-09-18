"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";

export default function BudgetSummaryCard() {
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
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ringkasan Budget
        </h3>
        <Link href="/budget" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Detail
        </Link>
      </div>

      <div className="mb-6 flex-grow">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Terpakai</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {formatRupiah(totalSpent)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatRupiah(totalBudget)}
            </p>
          </div>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`absolute left-0 top-0 h-full rounded-full ${
              isOverBudget ? "bg-error-500" : percentSpent > 80 ? "bg-warning-500" : "bg-brand-500"
            }`}
            style={{ width: `${percentSpent}%` }}
          ></div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500">{percentSpent}% terpakai</span>
          <span className={isOverBudget ? "font-medium text-error-500" : "font-medium text-success-500"}>
            {isOverBudget ? "Over Budget" : `Sisa ${formatRupiah(remaining)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
