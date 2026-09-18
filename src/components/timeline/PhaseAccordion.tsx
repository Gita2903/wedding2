"use client";

import React, { useState } from "react";
import { Task } from "@/context/WeddingContext";
import TaskCard from "./TaskCard";
import { ChevronDownIcon } from "@/icons";

interface PhaseAccordionProps {
  phaseName: string;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  defaultOpen?: boolean;
}

export default function PhaseAccordion({ phaseName, tasks, onStatusChange, defaultOpen = false }: PhaseAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const completedCount = tasks.filter((t) => t.status === "Selesai").length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (totalCount === 0) return null;

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-gray-900">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {phaseName}
          </h3>
          <div className="mt-2 flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {completedCount} / {totalCount} Selesai
            </div>
            <div className="h-1.5 w-32 rounded-full bg-gray-100 dark:bg-gray-800 hidden sm:block">
              <div
                className="h-full rounded-full bg-brand-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-transform duration-300 dark:bg-gray-800 dark:text-gray-400 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 p-5 space-y-3 dark:border-gray-800">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
          ))}
        </div>
      </div>
    </div>
  );
}
