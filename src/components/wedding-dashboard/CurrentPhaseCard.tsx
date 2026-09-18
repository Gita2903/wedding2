"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import { Link } from "@/i18n/navigation";

export default function CurrentPhaseCard() {
  const { data } = useWedding();

  // Find the current phase based on date, or just show tasks that are overdue/in progress
  const urgentTasks = data.tasks
    .filter((t) => t.status !== "Selesai")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Tugas Mendesak
        </h3>
        <Link href="/timeline" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Lihat Semua
        </Link>
      </div>

      {urgentTasks.length > 0 ? (
        <ul className="flex flex-col gap-3 flex-grow">
          {urgentTasks.map((task) => {
            const isOverdue = task.status === "Terlewat" || new Date(task.dueDate) < new Date();
            return (
              <li
                key={task.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 dark:border-gray-800 dark:bg-white/5"
              >
                <div className="mt-0.5">
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      isOverdue ? "border-error-500" : "border-brand-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isOverdue ? "text-error-600" : "text-gray-800 dark:text-white/90"}`}>
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Deadline: {new Date(task.dueDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-grow items-center justify-center text-center text-gray-500">
          <p>Yeay! Tidak ada tugas mendesak.</p>
        </div>
      )}
    </div>
  );
}
