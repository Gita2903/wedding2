"use client";

import React, { useState } from "react";
import { CheckCircleIcon } from "@/icons";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  requiredFor: "Semua" | "Islam" | "Non-Islam";
  checked: boolean;
}

interface DocumentChecklistProps {
  documents: DocumentItem[];
  onToggle: (id: string) => void;
}

export default function DocumentChecklist({ documents, onToggle }: DocumentChecklistProps) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div 
          key={doc.id}
          className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
            doc.checked 
              ? "border-brand-200 bg-brand-50/30 dark:border-brand-500/30 dark:bg-brand-500/5" 
              : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800/50"
          }`}
          onClick={() => onToggle(doc.id)}
        >
          <div className="mt-0.5 cursor-pointer">
            <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
              doc.checked 
                ? "border-brand-500 bg-brand-500" 
                : "border-gray-300 dark:border-gray-600"
            }`}>
              {doc.checked && <CheckCircleIcon className="h-4 w-4 text-white" />}
            </div>
          </div>
          
          <div className="flex-1 cursor-pointer">
            <h4 className={`text-sm font-medium ${
              doc.checked ? "text-gray-500 line-through dark:text-gray-400" : "text-gray-800 dark:text-white/90"
            }`}>
              {doc.title}
            </h4>
            <p className="mt-1 text-xs text-gray-500">
              {doc.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
