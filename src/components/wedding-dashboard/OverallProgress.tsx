"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import { CheckCircleIcon } from "@/icons";

export default function OverallProgress() {
  const { data } = useWedding();

  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.status === "Selesai").length;
  const inProgressTasks = data.tasks.filter((t) => t.status === "Sedang Proses").length;
  const overdueTasks = data.tasks.filter((t) => t.status === "Terlewat").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const phases = [
    "12+ Bulan Sebelum",
    "6-12 Bulan Sebelum",
    "3-6 Bulan Sebelum",
    "1-3 Bulan Sebelum",
    "H-1 Minggu",
  ];

  const phaseStats = phases
    .map((phase) => {
      const phaseTasks = data.tasks.filter((t) => t.phase === phase);
      const done = phaseTasks.filter((t) => t.status === "Selesai").length;
      const total = phaseTasks.length;
      return { phase, done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    })
    .filter((p) => p.total > 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Progress Keseluruhan
        </h3>
        <Link href="/timeline" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Detail
        </Link>
      </div>

      {/* Progress ring */}
      <div className="mb-6 flex items-center justify-center gap-6">
        <div className="relative flex h-32 w-32 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              strokeWidth="8"
              className="stroke-gray-200 dark:stroke-gray-800"
            />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              strokeWidth="8"
              stroke="currentColor"
              className="text-brand-500 transition-all duration-700"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800 dark:text-white/90">{progressPercent}%</span>
            <span className="text-xs text-gray-500">Selesai</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-brand-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{completedTasks} Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-warning-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{inProgressTasks} Proses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{totalTasks - completedTasks - inProgressTasks - overdueTasks} Belum Mulai</span>
          </div>
          {overdueTasks > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-error-500"></div>
              <span className="text-sm text-error-600 dark:text-error-500">{overdueTasks} Terlewat</span>
            </div>
          )}
        </div>
      </div>

      {/* Per-phase breakdown */}
      {phaseStats.length > 0 && (
        <div className="mt-auto space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
          {phaseStats.map((ps) => (
            <div key={ps.phase}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">{ps.phase}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{ps.done}/{ps.total}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ps.percent === 100 ? "bg-success-500" : "bg-brand-500"
                  }`}
                  style={{ width: `${ps.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalTasks === 0 && (
        <div className="mt-auto flex flex-col items-center gap-3 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
          <CheckCircleIcon className="h-8 w-8 text-gray-300 dark:text-gray-700" />
          <p className="text-sm text-gray-500">Belum ada tugas tersimpan.</p>
        </div>
      )}
    </div>
  );
}
