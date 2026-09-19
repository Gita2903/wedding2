"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";
import { CheckCircleIcon, CalenderIcon, TaskIcon } from "@/icons";

const STATUS_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
  "Belum Mulai": { dot: "bg-gray-400", badge: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", label: "Belum Mulai" },
  "Sedang Proses": { dot: "bg-warning-500", badge: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400", label: "Proses" },
  Selesai: { dot: "bg-success-500", badge: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500", label: "Selesai" },
  Terlewat: { dot: "bg-error-500", badge: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500", label: "Terlewat" },
};

export default function CurrentPhaseCard() {
  const { data } = useWedding();

  const urgentTasks = data.tasks
    .filter((t) => t.status !== "Selesai")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const now = new Date();

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: `${Math.abs(diffDays)} hari lalu`, overdue: true };
    if (diffDays === 0) return { text: "Hari ini", overdue: false };
    if (diffDays === 1) return { text: "Besok", overdue: false };
    if (diffDays <= 7) return { text: `${diffDays} hari lagi`, overdue: false };
    return { text: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }), overdue: false };
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TaskIcon className="h-5 w-5 text-brand-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Tugas Mendesak
          </h3>
        </div>
        <Link href="/timeline" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Lihat Semua
        </Link>
      </div>

      {urgentTasks.length > 0 ? (
        <ul className="flex flex-col gap-2.5 flex-grow">
          {urgentTasks.map((task) => {
            const rel = formatRelativeDate(task.dueDate);
            const isOverdue = task.status === "Terlewat" || rel.overdue;
            const styles = STATUS_STYLES[task.status] || STATUS_STYLES["Belum Mulai"];

            return (
              <li
                key={task.id}
                className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:border-brand-200 hover:bg-brand-50/30 dark:border-gray-800 dark:bg-white/5 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/5"
              >
                <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${styles.badge}`}>
                  <div className={`h-2 w-2 rounded-full ${styles.dot}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`truncate text-sm font-medium ${isOverdue ? "text-error-600 dark:text-error-500" : "text-gray-800 dark:text-white/90"}`}>
                    {task.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs text-gray-500">{task.phase}</span>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${isOverdue ? "text-error-600 dark:text-error-500" : "text-gray-500"}`}>
                      <CalenderIcon className="h-3 w-3" />
                      {rel.text}
                    </span>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                  {styles.label}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center gap-3 text-center">
          <CheckCircleIcon className="h-10 w-10 text-success-500/40" />
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yeay! Semua tugas selesai!</p>
            <p className="mt-1 text-xs text-gray-400">Tidak ada tugas mendesak saat ini.</p>
          </div>
        </div>
      )}
    </div>
  );
}
