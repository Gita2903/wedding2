"use client";

import React, { useState } from "react";
import { useWedding, Payment } from "@/context/WeddingContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import BudgetOverview from "@/components/budget/BudgetOverview";
import PaymentModal from "@/components/budget/PaymentModal";

export default function BudgetPage() {
  const { data, updateData } = useWedding();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | undefined>();
  const [selectedVendorName, setSelectedVendorName] = useState<string | undefined>();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val).replace(",00", "");
  };

  const handleOpenPayment = (vendorId?: string, vendorName?: string) => {
    setSelectedVendorId(vendorId);
    setSelectedVendorName(vendorName);
    setIsPaymentModalOpen(true);
  };

  const handleSavePayment = (payment: Payment) => {
    updateData({ payments: [...data.payments, payment] });
    setIsPaymentModalOpen(false);
  };

  const handleDeletePayment = (paymentId: string) => {
    updateData({ payments: data.payments.filter(p => p.id !== paymentId) });
  };

  // Group payments by vendor to calculate remaining per vendor
  const vendorPayments = data.vendors.map(vendor => {
    const paid = data.payments
      .filter(p => p.vendorId === vendor.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      ...vendor,
      paid,
      remaining: vendor.priceQuote - paid
    };
  });

  return (
    <>
      <PageBreadcrumb pageTitle="Budget & Pembayaran" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-gray-800 dark:text-white/90">
            Tracking Keuangan
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pantau pengeluaran dan jadwal pelunasan vendor.
          </p>
        </div>
        <div>
          <Button onClick={() => handleOpenPayment()}>+ Catat Pengeluaran Lainnya</Button>
        </div>
      </div>

      <BudgetOverview />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Alokasi per Vendor */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="border-b border-gray-100 p-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Alokasi Vendor</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 text-gray-800 dark:bg-gray-800 dark:text-white/90">
                <tr>
                  <th className="px-5 py-3 font-medium">Vendor</th>
                  <th className="px-5 py-3 font-medium">Quote</th>
                  <th className="px-5 py-3 font-medium">Terbayar</th>
                  <th className="px-5 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {vendorPayments.length > 0 ? (
                  vendorPayments.map((vp) => (
                    <tr key={vp.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{vp.name} <span className="text-xs text-gray-400 font-normal block">{vp.category}</span></td>
                      <td className="px-5 py-4">{formatRupiah(vp.priceQuote)}</td>
                      <td className="px-5 py-4 text-success-500 font-medium">{formatRupiah(vp.paid)}</td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => handleOpenPayment(vp.id, vp.name)}
                          className="text-brand-500 hover:text-brand-600 font-medium"
                        >
                          Bayar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center">Belum ada data vendor.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Riwayat Pembayaran */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden flex flex-col">
          <div className="border-b border-gray-100 p-5 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Riwayat Pembayaran</h3>
          </div>
          <div className="p-5 flex-grow overflow-y-auto max-h-[500px]">
            {data.payments.length > 0 ? (
              <div className="space-y-4">
                {[...data.payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => {
                  const vendorName = data.vendors.find(v => v.id === payment.vendorId)?.name || "Lainnya";
                  return (
                    <div key={payment.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white/90">{payment.note || "Pembayaran"}</p>
                        <p className="text-xs text-gray-500">{vendorName} • {new Date(payment.date).toLocaleDateString("id-ID")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{formatRupiah(payment.amount)}</p>
                        <button 
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-xs text-error-500 hover:text-error-600 mt-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center text-gray-500">
                <p>Belum ada riwayat pembayaran.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSave={handleSavePayment}
        vendorId={selectedVendorId}
        vendorName={selectedVendorName}
      />
    </>
  );
}
