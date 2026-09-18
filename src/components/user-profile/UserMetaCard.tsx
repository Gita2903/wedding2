"use client";
import { PencilIcon } from "@/icons";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { updateUserProfile } from "@/actions/profile";

export default function UserMetaCard() {
  const { data: session, update } = useSession();
  const { isOpen, openModal, closeModal } = useModal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const currentName = session?.user?.name || "Pengguna";
  const currentEmail = session?.user?.email || "";

  const handleOpenModal = () => {
    setName(currentName === "Pengguna" ? "" : currentName);
    setEmail(currentEmail);
    setError("");
    openModal();
  };

  const handleSave = async () => {
    setError("");
    setIsSaving(true);
    try {
      const res = await updateUserProfile({ name, email });
      if (res?.error) {
        setError(res.error);
        return;
      }
      // Refresh next-auth session so the new name/email show up right away
      await update({ name: res?.user?.name, email: res?.user?.email });
      closeModal();
    } catch {
      setError("Gagal menyimpan perubahan. Coba lagi ya.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6 rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
        <div className="flex flex-col gap-5 sm:flex-row xl:gap-10">
          <div className="flex-1">
            <div className="mb-4 flex flex-col gap-5 sm:flex-row lg:mb-6 xl:items-center xl:justify-between">
              <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center lg:gap-6">
                <div className="overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
                  <Image
                    src={
                      currentName
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            currentName
                          )}&background=ffb6c1&color=fff`
                        : "/images/user/owner.png"
                    }
                    width={80}
                    height={80}
                    className="size-20"
                    alt="user"
                  />
                </div>
                <div className="text-start">
                  <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                    {currentName}
                  </h4>
                  <div className="flex items-center gap-1 sm:gap-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentEmail || "Belum ada email"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="w-full">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Nama Lengkap
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {currentName}
                </p>
              </div>
              <div className="w-full">
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Alamat Email
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {currentEmail}
                </p>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleOpenModal}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
            >
              <PencilIcon className="size-5" />
              Edit
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[600px]">
        <div className="relative no-scrollbar w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 lg:p-11 dark:bg-gray-900">
          <div className="px-2 pe-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Informasi Akun
            </h4>
            <p className="mb-6 text-sm text-gray-500 lg:mb-7 dark:text-gray-400">
              Perbarui nama dan email akun kamu.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
              {error && (
                <div className="mb-4 rounded-lg bg-error-50 p-3 text-sm text-error-500 dark:bg-error-500/15">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Nama Lengkap</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
              >
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
