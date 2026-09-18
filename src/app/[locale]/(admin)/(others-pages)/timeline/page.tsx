"use client";

import React, { useEffect, useState } from "react";
import { useWedding, Task } from "@/context/WeddingContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PhaseAccordion from "@/components/timeline/PhaseAccordion";
import { generateTimeline } from "@/components/timeline/TimelineGenerator";
import Button from "@/components/ui/button/Button";
import TaskModal from "@/components/timeline/TaskModal";

export default function TimelinePage() {
  const { data, updateData } = useWedding();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-generate if empty
  useEffect(() => {
    if (data.onboardingComplete && data.tasks.length === 0) {
      const newTasks = generateTimeline(data);
      updateData({ tasks: newTasks });
    }
  }, [data, updateData]);

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    const updatedTasks = data.tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    updateData({ tasks: updatedTasks });
  };

  const handleAddTask = (newTask: Task) => {
    updateData({ tasks: [...data.tasks, newTask] });
  };

  // Group tasks by phase
  const phases = [
    "12+ Bulan Sebelum",
    "6-12 Bulan Sebelum",
    "3-6 Bulan Sebelum",
    "1-3 Bulan Sebelum",
    "H-1 Minggu",
  ];

  if (!data.onboardingComplete) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Selesaikan Onboarding Dulu</h2>
        <p className="text-gray-500 mb-6">Kami butuh data pernikahanmu untuk membuat timeline.</p>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Timeline & Roadmap" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-gray-800 dark:text-white/90">
            Roadmap Persiapan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Ikuti panduan ini langkah demi langkah agar persiapanmu terarah.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const newTasks = generateTimeline(data);
            updateData({ tasks: newTasks });
          }}>
            Regenerate
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>+ Tambah Tugas</Button>
        </div>
      </div>

      <div className="space-y-2">
        {phases.map((phase, index) => {
          const phaseTasks = data.tasks.filter((t) => t.phase === phase);
          return (
            <PhaseAccordion
              key={phase}
              phaseName={phase}
              tasks={phaseTasks}
              onStatusChange={handleStatusChange}
              defaultOpen={index === 0 || phaseTasks.some((t) => t.status !== "Selesai" && new Date(t.dueDate) < new Date())}
            />
          );
        })}
      </div>
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTask}
        phases={phases}
      />
    </>
  );
}
