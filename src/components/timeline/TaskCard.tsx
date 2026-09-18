"use client";

import React from "react";
import { Task } from "@/context/WeddingContext";
import Badge from "../ui/badge/Badge";
import { CalenderIcon, CheckCircleIcon, TimeIcon } from "@/icons";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isOverdue = task.status !== "Selesai" && new Date(task.dueDate) < new Date();

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "Selesai": return "success";
      case "Sedang Proses": return "warning";
      case "Terlewat": return "error";
      default: return "light";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "Selesai": return <CheckCircleIcon className="mr-1 h-3 w-3" />;
      case "Sedang Proses": return <TimeIcon className="mr-1 h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${
      task.status === "Selesai" 
        ? "bg-gray-50 border-gray-100 dark:bg-white/5 dark:border-gray-800" 
        : isOverdue 
          ? "bg-error-50/50 border-error-100 dark:bg-error-500/5 dark:border-error-500/20"
          : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800"
    }`}>
      
      <div className="flex-1 mb-3 sm:mb-0">
        <h4 className={`text-sm font-medium ${
          task.status === "Selesai" ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-800 dark:text-white/90"
        }`}>
          {task.title}
        </h4>
        <div className="mt-1 flex items-center text-xs text-gray-500 gap-2">
          <span className="flex items-center">
            <CalenderIcon className="mr-1 h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {isOverdue && <span className="text-error-500 font-medium">(Terlewat)</span>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge color={isOverdue ? "error" : getStatusColor(task.status)} size="sm" variant={task.status === "Selesai" ? "light" : "solid"}>
          {getStatusIcon(task.status)}
          {isOverdue ? "Terlewat" : task.status}
        </Badge>
        
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
          className="text-xs rounded-lg border border-gray-300 bg-transparent px-2 py-1 outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
        >
          <option value="Belum Mulai">Belum Mulai</option>
          <option value="Sedang Proses">Sedang Proses</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>
    </div>
  );
}
