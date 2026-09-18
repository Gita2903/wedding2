"use client";

import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { PencilIcon } from "@/icons";
import { useWedding } from "@/context/WeddingContext";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

const religions = [
  { value: "", label: "Belum diisi" },
  { value: "islam", label: "Islam" },
  { value: "kristen", label: "Kristen Protestan" },
  { value: "katolik", label: "Katolik" },
  { value: "hindu", label: "Hindu" },
  { value: "buddha", label: "Buddha" },
  { value: "konghucu", label: "Konghucu" },
];

function religionLabel(value: string) {
  return religions.find((r) => r.value === value)?.label || "Belum diisi";
}

function formatDate(iso: string | null) {
  if (!iso) return "Belum ditentukan";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function WeddingInfoCard() {
  const { data, updateBasicInfo } = useWedding();
  const { isOpen, openModal, closeModal } = useModal();

  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [city, setCity] = useState("");
  const [religion, setReligion] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenModal = () => {
    setGroomName(data.groomName);
    setBrideName(data.brideName);
    setWeddingDate(data.weddingDate);
    setCity(data.city);
    setReligion(data.religion);
    openModal();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBasicInfo({
        groomName,
        brideName,
        weddingDate,
        city,
        religion,
      });
      closeModal();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
        <div className="flex flex-col gap-6 sm:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="mb-4 text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
              Data Pernikahan
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Mempelai Pria
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.groomName || "Belum diisi"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Mempelai Wanita
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.brideName || "Belum diisi"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Tanggal Pernikahan
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {formatDate(data.weddingDate)}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Kota
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.city || "Belum diisi"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Agama
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {religionLabel(data.religion)}
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleOpenModal}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
            >
              <PencilIcon className="size-5" />
              Edit
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[700px]">
        <div className="relative no-scrollbar w-full overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
          <div className="px-2 pe-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Data Pernikahan
            </h4>
            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Perbarui data pernikahan kamu. Ini juga dipakai buat hitung
              countdown dan checklist di dashboard.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar overflow-y-auto px-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Nama Mempelai Pria</Label>
                  <Input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Nama Mempelai Wanita</Label>
                  <Input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Tanggal Pernikahan</Label>
                  <input
                    type="date"
                    value={
                      weddingDate
                        ? new Date(weddingDate).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setWeddingDate(
                        e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null
                      )
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                <div>
                  <Label>Kota</Label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Agama</Label>
                  <select
                    value={religion}
                    onChange={(e) => setReligion(e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs outline-none transition focus:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    {religions.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button size="sm" disabled={isSaving} onClick={handleSave}>
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
