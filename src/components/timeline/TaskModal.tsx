"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Task, TaskStatus } from "@/context/WeddingContext";

const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  phases: string[];
}

export default function TaskModal({ isOpen, onClose, onSave, phases }: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "",
    phase: phases[0] || "",
    dueDate: new Date().toISOString().split('T')[0],
    status: "Belum Mulai",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.phase || !formData.dueDate) return;
    
    onSave({
      id: uuidv4(),
      title: formData.title,
      phase: formData.phase,
      dueDate: formData.dueDate,
      status: formData.status as TaskStatus,
    });
    setFormData({ title: "", phase: phases[0] || "", dueDate: new Date().toISOString().split('T')[0], status: "Belum Mulai" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] p-6">
      <h3 className="mb-5 text-lg font-bold text-gray-800 dark:text-white/90">
        Tambah Tugas Baru
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nama Tugas</Label>
          <Input 
            type="text" 
            placeholder="Contoh: DP Gedung"
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required 
          />
        </div>
        
        <div>
          <Label>Fase (Kapan harus selesai?)</Label>
          <select 
            value={formData.phase}
            onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            required
          >
            {phases.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <Label>Tenggat Waktu (Due Date)</Label>
          <input
            type="date"
            value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ""}
            onChange={(e) => {
              if (e.target.value) {
                setFormData({ ...formData, dueDate: new Date(e.target.value).toISOString() });
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            Simpan Tugas
          </Button>
        </div>
      </form>
    </Modal>
  );
}
