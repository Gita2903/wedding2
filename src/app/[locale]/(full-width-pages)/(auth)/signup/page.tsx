"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal mendaftar");
        setLoading(false);
        return;
      }

      // Auto login after register
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        setError(signInRes.error);
        setLoading(false);
      } else {
        router.push("/onboarding");
        router.refresh();
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Akun</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Buat akun untuk memulai perjalanan Anda menuju hari bahagia.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-error-50 p-4 text-sm text-error-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nama Lengkap</Label>
          <Input 
            type="text" 
            placeholder="Contoh: Budi" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
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
            placeholder="Minimal 6 karakter" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
        </div>
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Memproses..." : "Daftar"}
        </Button>
      </form>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Sudah punya akun?{" "}
        <a href="/signin" className="text-brand-500 hover:underline">
          Masuk di sini
        </a>
      </p>
    </div>
  );
}
