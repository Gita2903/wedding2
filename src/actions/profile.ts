"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type SessionUser = { id: string };

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as SessionUser).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  return user;
}

export async function updateUserProfile(data: { name: string; email: string }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as SessionUser).id;
  const name = data.name?.trim();
  const email = data.email?.trim();

  if (!name) {
    return { error: "Nama tidak boleh kosong." };
  }
  if (!email) {
    return { error: "Email tidak boleh kosong." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== userId) {
    return { error: "Email tersebut sudah dipakai akun lain." };
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { name, email },
    select: { id: true, name: true, email: true },
  });

  return { success: true, user: updated };
}
