"use client";

import React, { useState } from "react";
import { useWedding, Vendor, VendorCategory, VendorStatus } from "@/context/WeddingContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import VendorCard from "@/components/vendor/VendorCard";
import { generateVendors } from "@/components/vendor/VendorGenerator";
const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

const VENDOR_CATEGORIES: VendorCategory[] = [
  "Venue", "Catering", "WO", "Dekorasi", "Fotografer", "Videografer", 
  "MUA & Attire", "Souvenir", "Undangan", "Entertainment", "Transportasi", "Cincin & Mahar", "Lainnya"
];

export default function VendorsPage() {
  const { data, updateData } = useWedding();
  const [activeTab, setActiveTab] = useState<VendorCategory>("Venue");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Vendor>>({
    name: "", category: "Venue", contact: "", priceQuote: 0, status: "Riset", notes: ""
  });

  const filteredVendors = data.vendors.filter((v) => v.category === activeTab);

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData(vendor);
    } else {
      setEditingVendor(null);
      setFormData({ name: "", category: activeTab, contact: "", priceQuote: 0, status: "Riset", notes: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingVendor) {
      const updated = data.vendors.map(v => v.id === editingVendor.id ? { ...v, ...formData } as Vendor : v);
      updateData({ vendors: updated });
    } else {
      const newVendor: Vendor = {
        ...formData,
        id: uuidv4(),
      } as Vendor;
      updateData({ vendors: [...data.vendors, newVendor] });
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (editingVendor) {
      const updated = data.vendors.filter(v => v.id !== editingVendor.id);
      updateData({ vendors: updated });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Vendor Management" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-gray-800 dark:text-white/90">
            Daftar Vendor
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Catat, bandingkan, dan pantau status semua vendormu.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {
            const newVendors = generateVendors(data.estimatedBudget || 0);
            updateData({ vendors: newVendors });
          }}>
            Regenerate
          </Button>
          <Button onClick={() => handleOpenModal()}>+ Tambah Vendor</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 pb-2">
          {VENDOR_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === cat
                  ? "bg-brand-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onClick={handleOpenModal} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
          <p className="mb-4 text-gray-500">Belum ada vendor untuk kategori {activeTab}</p>
          <Button variant="outline" onClick={() => handleOpenModal()}>
            Tambah Vendor {activeTab}
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-md p-6">
        <h3 className="mb-5 text-xl font-bold text-gray-800 dark:text-white/90">
          {editingVendor ? "Edit Vendor" : "Tambah Vendor"}
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label>Nama Vendor</Label>
            <Input 
              type="text" 
              value={formData.name || ""} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Contoh: Gedung Wanita"
            />
          </div>
          
          <div>
            <Label>Kategori</Label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as VendorCategory})}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              {VENDOR_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <Label>Status</Label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as VendorStatus})}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              {["Riset", "Nego", "Booked", "DP", "Lunas", "Dibatalkan"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <Label>Harga (Quote)</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">Rp</span>
              <Input 
                type="number" 
                className="pl-12"
                value={formData.priceQuote || ""} 
                onChange={(e) => setFormData({...formData, priceQuote: Number(e.target.value)})} 
              />
            </div>
          </div>

          <div>
            <Label>Kontak (IG/WA)</Label>
            <Input 
              type="text" 
              value={formData.contact || ""} 
              onChange={(e) => setFormData({...formData, contact: e.target.value})} 
            />
          </div>

          <div>
            <Label>Catatan</Label>
            <textarea
              className="w-full rounded-lg border border-gray-300 bg-transparent px-5 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              rows={3}
              value={formData.notes || ""}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          {editingVendor ? (
            <button onClick={handleDelete} className="text-sm font-medium text-error-500 hover:text-error-600">
              Hapus
            </button>
          ) : <div></div>}
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} disabled={!formData.name}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
