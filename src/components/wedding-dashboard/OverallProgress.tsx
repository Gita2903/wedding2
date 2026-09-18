"use client";

import React from "react";
import { useWedding } from "@/context/WeddingContext";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import apexcharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OverallProgress() {
  const { data } = useWedding();

  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((t) => t.status === "Selesai").length;
  
  // Calculate percentage, default to 0 if no tasks
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      fontFamily: "inherit",
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e4e7ec", // gray-200
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 0,
            fontSize: "24px",
            fontWeight: 700,
            color: "#1d2939", // gray-800
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    colors: ["#e11d48"], // brand-500 (rose)
    stroke: {
      lineCap: "round",
    },
  };

  // Adjust colors for dark mode context
  // Note: ApexCharts customization is often handled via CSS overrides in TailAdmin globals.css,
  // but we can pass basic hex colors directly.

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Progress Keseluruhan
      </h3>
      
      <div className="flex items-center justify-center min-h-[140px]">
        {totalTasks > 0 ? (
          <ReactApexChart
            options={options}
            series={[progressPercent]}
            type="radialBar"
            height={200}
          />
        ) : (
          <div className="text-center text-gray-500">
            <p>Belum ada task.</p>
            <p className="text-sm">Set timeline terlebih dahulu.</p>
          </div>
        )}
      </div>

      <div className="mt-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
        {completedTasks} dari {totalTasks} tugas selesai
      </div>
    </div>
  );
}
