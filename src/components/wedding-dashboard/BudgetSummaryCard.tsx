"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import { DollarLineIcon } from "@/icons";

export default function BudgetSummaryCard() {
  const { data } = useWedding();

  const totalBudget = data.estimatedBudget;
  const totalSpent = data.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;
  const isOverBudget = remaining < 0;

  const formatRupiah = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}jt`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}rb`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Spending per vendor category
  const vendorSpending = data.vendors
    .map((v) => ({
      name: v.name,
      category: v.category,
      quote: v.priceQuote,
      paid: data.payments
        .filter((p) => p.vendorId === v.id)
        .reduce((sum, p) => sum + p.amount, 0),
      status: v.status,
    }))
    .filter((v) => v.quote > 0)
    .sort((a, b) => b.quote - a.quote)
    .slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Ringkasan Budget
        </h3>
        <Link href="/budget" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Detail
        </Link>
      </div>

      {/* Main budget display */}
      <div className="mb-5">
        <div className="mb-2 flex items-end justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Terpakai</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white/90">
              {formatRupiah(totalSpent)}
            </p>
          </div>
          <div className="text-end">
            <p className="text-xs text-gray-500 dark:text-gray-400">Dari Budget</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatRupiah(totalBudget)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className={`absolute inset-y-0 start-0 rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-error-500"
                : percentSpent > 80
                ? "bg-warning-500"
                : "bg-brand-500"
            }`}
            style={{ width: `${Math.max(percentSpent, 3)}%` }}
          ></div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs">
          <span className="text-gray-500 dark:text-gray-400">{percentSpent}% terpakai</span>
          <span className={`font-semibold ${isOverBudget ? "text-error-600 dark:text-error-500" : "text-success-600 dark:text-success-500"}`}>
            {isOverBudget ? "Over Budget!" : `Sisa ${formatRupiah(remaining)}`}
          </span>
        </div>
      </div>

      {/* Vendor spending breakdown */}
      {vendorSpending.length > 0 && (
        <div className="mt-auto space-y-3 border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <DollarLineIcon className="h-4 w-4 text-gray-400" />
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pengeluaran Terbesar</p>
          </div>
          {vendorSpending.map((v) => {
            const payPercent = v.quote > 0 ? Math.min(100, Math.round((v.paid / v.quote) * 100)) : 0;
            return (
              <div key={v.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{v.name}</span>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-400">{v.category}</span>
                  </div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">{formatRupiah(v.quote)}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className="h-full rounded-full bg-success-500 transition-all duration-500"
                    style={{ width: `${payPercent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalBudget === 0 && vendorSpending.length === 0 && (
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
          <DollarLineIcon className="h-8 w-8 text-gray-300 dark:text-gray-700" />
          <p className="text-sm text-gray-500">Belum ada budget tercatat.</p>
        </div>
      )}
    </div>
  );
}
