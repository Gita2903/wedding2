"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Selamat Datang Kembali</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Silakan masuk ke akun Anda untuk melanjutkan persiapan.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-error-50 p-4 text-sm text-error-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input 
            type="email" 
            placeholder="email@contoh.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Belum punya akun?{" "}
        <Link href="/signup" className="text-brand-500 hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}
