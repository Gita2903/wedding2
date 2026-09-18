"use client";

import React, { useState, useEffect } from "react";
import { useWedding } from "@/context/WeddingContext";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DocumentChecklist from "@/components/documents/DocumentChecklist";

export default function DocumentsPage() {
  const { data } = useWedding();
  const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
  const isIslam = data.religion === "islam";

  // Load from local storage directly for this specific component to keep it simple,
  // or we could add it to WeddingContext, but let's just use local component state synced to localStorage for now.
  useEffect(() => {
    const saved = localStorage.getItem("wedding_docs_checked");
    if (saved) {
      setCheckedDocs(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (id: string) => {
    const newChecked = checkedDocs.includes(id)
      ? checkedDocs.filter(dId => dId !== id)
      : [...checkedDocs, id];
    
    setCheckedDocs(newChecked);
    localStorage.setItem("wedding_docs_checked", JSON.stringify(newChecked));
  };

  const allDocuments = [
    // General
    { id: "fc_ktp", title: "Fotokopi KTP CPW & CPP", description: "Masing-masing 4 lembar (tergantung daerah).", requiredFor: "Semua" },
    { id: "fc_kk", title: "Fotokopi KK CPW & CPP", description: "Masing-masing 4 lembar.", requiredFor: "Semua" },
    { id: "fc_akta", title: "Fotokopi Akta Kelahiran", description: "Masing-masing 4 lembar.", requiredFor: "Semua" },
    { id: "pasfoto_2x3", title: "Pas Foto 2x3 (Background Biru/Merah)", description: "Masing-masing 5 lembar.", requiredFor: "Semua" },
    { id: "pasfoto_3x4", title: "Pas Foto 3x4 (Background Biru/Merah)", description: "Masing-masing 5 lembar.", requiredFor: "Semua" },
    { id: "surat_kesehatan", title: "Surat Keterangan Sehat (Puskesmas)", description: "Termasuk tes kesehatan pranikah & sertifikat Elsimil.", requiredFor: "Semua" },
    
    // Islam Specific (KUA)
    { id: "n1", title: "Surat Pengantar Nikah (N1)", description: "Didapat dari Kelurahan.", requiredFor: "Islam" },
    { id: "n3", title: "Surat Persetujuan Mempelai (N3)", description: "Didapat dari Kelurahan.", requiredFor: "Islam" },
    { id: "n4", title: "Surat Izin Orang Tua (N4)", description: "Jika calon pengantin berusia di bawah 21 tahun.", requiredFor: "Islam" },
    { id: "rekomendasi_nikah", title: "Surat Rekomendasi Nikah", description: "Hanya jika numpang nikah di kecamatan lain.", requiredFor: "Islam" },
    
    // Non-Islam Specific (Catatan Sipil)
    { id: "surat_pengantar_agama", title: "Surat Keterangan / Pemberkatan dari Agama", description: "Dari Gereja/Vihara/Pura.", requiredFor: "Non-Islam" },
    { id: "surat_n1_non", title: "Surat Keterangan N1 - N4", description: "Dari Kelurahan untuk Catatan Sipil.", requiredFor: "Non-Islam" },
    { id: "pencatatan_sipil", title: "Formulir Pencatatan Sipil", description: "Diisi saat pendaftaran di Disdukcapil.", requiredFor: "Non-Islam" },
  ];

  const filteredDocs = allDocuments.filter(doc => 
    doc.requiredFor === "Semua" || 
    (isIslam && doc.requiredFor === "Islam") || 
    (!isIslam && doc.requiredFor === "Non-Islam")
  ).map(doc => ({
    ...doc,
    checked: checkedDocs.includes(doc.id)
  }) as any);

  const completedCount = filteredDocs.filter(d => d.checked).length;
  const progressPercent = Math.round((completedCount / filteredDocs.length) * 100);

  return (
    <>
      <PageBreadcrumb pageTitle="Dokumen Legal" />

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-md2 font-bold text-gray-800 dark:text-white/90">
            Checklist Dokumen
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Disesuaikan dengan agamamu ({data.religion ? data.religion.charAt(0).toUpperCase() + data.religion.slice(1) : "Belum diisi"}).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Progress Dokumen
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-gray-100 dark:border-gray-800">
                <span className="text-xl font-bold text-brand-500">{progressPercent}%</span>
                {/* Simulated circle progress */}
                <svg className="absolute left-[-4px] top-[-4px] h-24 w-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-brand-500"
                    strokeDasharray="276"
                    strokeDashoffset={276 - (276 * progressPercent) / 100}
                    strokeLinecap="round"
                  ></circle>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {completedCount} dari {filteredDocs.length} Selesai
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Ayo lengkapi sebelum batas waktu pendaftaran!
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 p-6 dark:border-brand-500/20 dark:bg-brand-500/5">
            <h4 className="font-semibold text-brand-600 dark:text-brand-400 mb-2">Tips Pengurusan</h4>
            <ul className="list-inside list-disc text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <li>Mulai urus dokumen dari RT/RW setempat.</li>
              <li>Pastikan nama di KTP, KK, dan Ijazah sama.</li>
              <li>Buat jadwal tes kesehatan di Puskesmas minimal H-3 bulan.</li>
            </ul>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <DocumentChecklist documents={filteredDocs} onToggle={handleToggle} />
          </div>
        </div>
      </div>
    </>
  );
}
