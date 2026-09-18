"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function saveWeddingData(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;
  const weddingId = (session.user as any).weddingId;

  if (weddingId) {
    // Update existing wedding
    await prisma.wedding.update({
      where: { id: weddingId },
      data: {
        groomName: data.groomName || "",
        brideName: data.brideName || "",
        weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
        estimatedBudget: data.estimatedBudget || 0,
        estimatedGuests: data.estimatedGuests || 0,
        city: data.city || "",
        religion: data.religion || "",
      }
    });

    if (data.tasks) {
      await prisma.task.deleteMany({ where: { weddingId } });
      await prisma.task.createMany({
        data: data.tasks.map((t: any) => ({
          title: t.title,
          phase: t.phase,
          dueDate: new Date(t.dueDate),
          status: t.status,
          weddingId
        }))
      });
    }

    if (data.vendors) {
      await prisma.vendor.deleteMany({ where: { weddingId } });
      await prisma.vendor.createMany({
        data: data.vendors.map((v: any) => ({
          name: v.name,
          category: v.category,
          contact: v.contact || "",
          priceQuote: v.priceQuote || 0,
          status: v.status,
          notes: v.notes || "",
          weddingId
        }))
      });
    }

    return { success: true, weddingId };
  } else {
    // Create new wedding and link user
    const wedding = await prisma.wedding.create({
      data: {
        groomName: data.groomName || "",
        brideName: data.brideName || "",
        weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
        estimatedBudget: data.estimatedBudget || 0,
        estimatedGuests: data.estimatedGuests || 0,
        city: data.city || "",
        religion: data.religion || "",
        users: {
          connect: { id: userId }
        }
      }
    });

    if (data.tasks) {
      await prisma.task.createMany({
        data: data.tasks.map((t: any) => ({
          title: t.title,
          phase: t.phase,
          dueDate: new Date(t.dueDate),
          status: t.status,
          weddingId: wedding.id
        }))
      });
    }

    if (data.vendors) {
      await prisma.vendor.createMany({
        data: data.vendors.map((v: any) => ({
          name: v.name,
          category: v.category,
          contact: v.contact || "",
          priceQuote: v.priceQuote || 0,
          status: v.status,
          notes: v.notes || "",
          weddingId: wedding.id
        }))
      });
    }

    return { success: true, weddingId: wedding.id };
  }
}

// Updates ONLY the wedding's basic scalar fields. Deliberately does NOT touch
// tasks or vendors, so partners editing their profile can't clobber each
// other's task/vendor progress with a stale local snapshot (see saveWeddingData,
// which does a full delete+recreate of tasks/vendors whenever they're present
// in the payload).
export async function updateWeddingBasicInfo(data: {
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  city: string;
  religion: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = (session.user as any).id;
  const weddingId = (session.user as any).weddingId;

  const basicFields = {
    groomName: data.groomName?.trim() || "",
    brideName: data.brideName?.trim() || "",
    weddingDate: data.weddingDate ? new Date(data.weddingDate) : null,
    city: data.city?.trim() || "",
    religion: data.religion || "",
  };

  if (weddingId) {
    const wedding = await prisma.wedding.update({
      where: { id: weddingId },
      data: basicFields,
    });
    return { success: true, wedding };
  }

  // No wedding yet for this user — create one and link it, without
  // touching tasks/vendors since there aren't any yet.
  const wedding = await prisma.wedding.create({
    data: {
      ...basicFields,
      estimatedBudget: 0,
      estimatedGuests: 0,
      users: { connect: { id: userId } },
    },
  });

  return { success: true, wedding };
}

// --- Task-scoped actions ---
// These touch ONLY the Task table (never the wedding's scalar fields or the
// vendors table), and always record who made the change, so:
//  1. Two partners editing different things at the same time can't clobber
//     each other's task list (unlike saveWeddingData's full delete+recreate).
//  2. The UI can show "diedit oleh <nama>" per task.

export async function updateTaskStatus(taskId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const weddingId = (session.user as any).weddingId;
  if (!weddingId) throw new Error("Belum punya data pernikahan.");

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task || task.weddingId !== weddingId) {
    throw new Error("Tugas tidak ditemukan.");
  }

  const updated = await prisma.task.update({
    where: { id: taskId },
    data: { status, lastEditedById: userId },
    include: { lastEditedBy: { select: { name: true } } },
  });

  return { success: true, task: updated };
}

export async function addTask(task: {
  title: string;
  phase: string;
  dueDate: string;
  status: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const weddingId = (session.user as any).weddingId;
  if (!weddingId) throw new Error("Belum punya data pernikahan.");

  const created = await prisma.task.create({
    data: {
      title: task.title,
      phase: task.phase,
      dueDate: new Date(task.dueDate),
      status: task.status,
      weddingId,
      lastEditedById: userId,
    },
    include: { lastEditedBy: { select: { name: true } } },
  });

  return { success: true, task: created };
}

// Full reset of the roadmap — this one intentionally replaces every task
// (that's the point of "Regenerate"), but it's scoped to tasks only, so it
// never touches vendors like saveWeddingData's version does.
export async function regenerateTasks(
  tasks: { title: string; phase: string; dueDate: string; status: string }[]
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const weddingId = (session.user as any).weddingId;
  if (!weddingId) throw new Error("Belum punya data pernikahan.");

  await prisma.task.deleteMany({ where: { weddingId } });
  await prisma.task.createMany({
    data: tasks.map((t) => ({
      title: t.title,
      phase: t.phase,
      dueDate: new Date(t.dueDate),
      status: t.status,
      weddingId,
      lastEditedById: userId,
    })),
  });

  return { success: true };
}

export async function joinWedding(emailToJoin: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  
  const userId = (session.user as any).id;

  const partner = await prisma.user.findUnique({
    where: { email: emailToJoin }
  });

  if (!partner || !partner.weddingId) {
    return { error: "Pasangan tidak ditemukan atau belum membuat data pernikahan." };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { weddingId: partner.weddingId }
  });

  return { success: true };
}

export async function getWeddingData() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return null;
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wedding: {
        include: {
          tasks: {
            include: { lastEditedBy: { select: { name: true } } },
            orderBy: { createdAt: "asc" },
          },
          vendors: true,
        }
      }
    }
  });

  if (!user || !user.wedding) {
    return null;
  }

  return user.wedding;
}
