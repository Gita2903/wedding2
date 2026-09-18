"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Payment } from "@/context/WeddingContext";
const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: Payment) => void;
  vendorId?: string;
  vendorName?: string;
}

export default function PaymentModal({ isOpen, onClose, onSave, vendorId, vendorName }: PaymentModalProps) {
  const [formData, setFormData] = useState<Partial<Payment>>({
    amount: 0,
    date: new Date().toISOString(),
    note: "",
    vendorId: vendorId,
  });

  const handleSave = () => {
    if (formData.amount! > 0) {
      onSave({
        ...formData,
        id: uuidv4(),
      } as Payment);
      setFormData({ amount: 0, date: new Date().toISOString(), note: "", vendorId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h3 className="mb-5 text-xl font-bold text-gray-800 dark:text-white/90">
        Catat Pembayaran {vendorName ? `untuk ${vendorName}` : ""}
      </h3>
      
      <div className="space-y-4">
        <div>
          <Label>Nominal (Rp)</Label>
          <Input 
            type="number" 
            value={formData.amount || ""} 
            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} 
          />
        </div>
        
        <div>
          <Label>Tanggal Pembayaran</Label>
          <input
            type="date"
            value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
            onChange={(e) => {
              if (e.target.value) {
                setFormData({ ...formData, date: new Date(e.target.value).toISOString() });
              }
            }}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>

        <div>
          <Label>Keterangan (Contoh: DP 1, Pelunasan)</Label>
          <Input 
            type="text" 
            value={formData.note || ""} 
            onChange={(e) => setFormData({...formData, note: e.target.value})} 
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={handleSave} disabled={!formData.amount || formData.amount <= 0}>Simpan</Button>
      </div>
    </Modal>
  );
}
