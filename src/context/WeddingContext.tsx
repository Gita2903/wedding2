"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  getWeddingData,
  saveWeddingData,
  updateWeddingBasicInfo,
  updateTaskStatus as updateTaskStatusAction,
  addTask as addTaskAction,
  regenerateTasks as regenerateTasksAction,
} from "@/actions/wedding";

// --- Types ---

export type Religion = "islam" | "kristen" | "katolik" | "hindu" | "buddha" | "konghucu";
export type TaskStatus = "Belum Mulai" | "Sedang Proses" | "Selesai" | "Terlewat";
export type VendorStatus = "Riset" | "Nego" | "Booked" | "DP" | "Lunas" | "Dibatalkan";
export type VendorCategory = "Venue" | "Catering" | "WO" | "Dekorasi" | "Fotografer" | "Videografer" | "MUA & Attire" | "Souvenir" | "Undangan" | "Entertainment" | "Transportasi" | "Cincin & Mahar" | "Lainnya";

export interface Task {
  id: string;
  title: string;
  phase: string;
  dueDate: string; // ISO string
  status: TaskStatus;
  lastEditedByName?: string | null;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contact: string;
  priceQuote: number;
  status: VendorStatus;
  notes: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  plannedAmount: number;
}

export interface Payment {
  id: string;
  vendorId: string;
  amount: number;
  date: string; // ISO string
  note: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "Belum" | "Sedang Urus" | "Selesai";
  deadline: string; // ISO string
}

export interface WeddingData {
  // Onboarding
  id: string;
  inviteCode: string;
  groomName: string;
  brideName: string;
  weddingDate: string | null;
  estimatedBudget: number;
  estimatedGuests: number;
  city: string;
  religion: Religion | "";
  customs: string[];
  onboardingComplete: boolean;

  // Core Data
  tasks: Task[];
  vendors: Vendor[];
  budgetAllocations: BudgetCategory[];
  payments: Payment[];
  documents: DocumentItem[];
}

export type OnboardingFormData = Pick<WeddingData,
  "groomName" | "brideName" | "weddingDate" | "estimatedBudget" | "estimatedGuests" | "city" | "religion" | "customs"
>;

// --- Default State ---
const defaultData: WeddingData = {
  id: "",
  inviteCode: "",
  groomName: "",
  brideName: "",
  weddingDate: null,
  estimatedBudget: 0,
  estimatedGuests: 0,
  city: "",
  religion: "",
  customs: [],
  onboardingComplete: false,
  tasks: [],
  vendors: [],
  budgetAllocations: [],
  payments: [],
  documents: [],
};

// Normalizers buat ngilangin type mismatch dari Prisma
type RawTask = {
  id: string;
  title: string;
  phase: string;
  dueDate: Date | string;
  status: string;
  lastEditedBy?: { name: string } | null;
};

function normalizeTasks(rawTasks: RawTask[] | undefined): Task[] {
  if (!rawTasks) return [];
  return rawTasks.map((t) => ({
    id: t.id,
    title: t.title,
    phase: t.phase,
    dueDate: t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate,
    status: t.status as TaskStatus,
    lastEditedByName: t.lastEditedBy?.name ?? null,
  }));
}

type RawVendor = Omit<Vendor, "category" | "status"> & {
  category: string;
  status: string;
};

function normalizeVendors(rawVendors: RawVendor[] | undefined): Vendor[] {
  if (!rawVendors) return [];
  return rawVendors.map((v) => ({
    id: v.id,
    name: v.name,
    category: v.category as VendorCategory,
    contact: v.contact,
    priceQuote: v.priceQuote,
    status: v.status as VendorStatus,
    notes: v.notes,
  }));
}

// --- Context & Provider ---
interface WeddingContextType {
  data: WeddingData;
  updateData: (newData: Partial<WeddingData>) => void;
  updateBasicInfo: (fields: {
    groomName: string;
    brideName: string;
    weddingDate: string | null;
    city: string;
    religion: Religion | "";
  }) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  addTask: (task: { title: string; phase: string; dueDate: string; status: TaskStatus }) => Promise<void>;
  regenerateTasks: (tasks: { title: string; phase: string; dueDate: string; status: TaskStatus }[]) => Promise<void>;
  refreshFromServer: () => Promise<void>;
  resetData: () => void;
  isLoaded: boolean;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { update: updateSession } = useSession();
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  const refreshFromServer = useCallback(async () => {
    try {
      const fresh = await getWeddingData();
      if (fresh) {
        setData((prev) => ({
          ...prev,
          ...fresh,
          religion: (fresh.religion as Religion | "") ?? "",
          tasks: normalizeTasks(fresh.tasks),
          vendors: normalizeVendors(fresh.vendors),
          weddingDate: fresh.weddingDate ? new Date(fresh.weddingDate).toISOString() : null,
          onboardingComplete: true,
        }));
      }
    } catch (e) {
      console.error("Failed to refresh wedding data", e);
    }
  }, []);

  // Load from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const dbData = await getWeddingData();
        if (dbData) {
          setData((prev) => ({
            ...prev,
            ...dbData,
            religion: (dbData.religion as Religion | "") ?? "",
            tasks: normalizeTasks(dbData.tasks),
            vendors: normalizeVendors(dbData.vendors),
            weddingDate: dbData.weddingDate ? new Date(dbData.weddingDate).toISOString() : null,
            onboardingComplete: true,
          }));
        } else {
          const savedData = localStorage.getItem("wedding_data_fallback");
          if (savedData) {
            setData(JSON.parse(savedData));
          }
        }
      } catch (e) {
        console.error("Failed to load wedding data", e);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded || !dataRef.current.onboardingComplete) return;

    const POLL_MS = 20000;
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        refreshFromServer();
      }
    }, POLL_MS);

    const handleVisible = () => {
      if (document.visibilityState === "visible") {
        refreshFromServer();
      }
    };
    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleVisible);
    };
  }, [isLoaded, data.onboardingComplete, refreshFromServer]);

  const updateData = useCallback(async (newData: Partial<WeddingData>) => {
    const updated = { ...dataRef.current, ...newData };
    setData(updated);
    localStorage.setItem("wedding_data_fallback", JSON.stringify(updated));

    if (updated.onboardingComplete) {
      try {
        const result = await saveWeddingData(updated);
        // If a new wedding was just created (or an existing one updated),
        // refresh the next-auth session so the JWT picks up the latest
        // weddingId. Without this, server actions that check
        // session.user.weddingId will still see null and throw
        // "Belum punya data pernikahan."
        if (result?.weddingId) {
          await updateSession({ weddingId: result.weddingId });
          await refreshFromServer();
        }
      } catch (e) {
        console.error("Failed to save to DB", e);
      }
    }
  }, [updateSession, refreshFromServer]);

  const updateBasicInfo = useCallback(
    async (fields: {
      groomName: string;
      brideName: string;
      weddingDate: string | null;
      city: string;
      religion: Religion | "";
    }) => {
      await updateWeddingBasicInfo(fields);
      await refreshFromServer();
    },
    [refreshFromServer]
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      setData((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
      }));
      try {
        await updateTaskStatusAction(taskId, status);
      } catch (e) {
        console.error("Failed to update task status", e);
      }
      await refreshFromServer();
    },
    [refreshFromServer]
  );

  const addTask = useCallback(
    async (task: { title: string; phase: string; dueDate: string; status: TaskStatus }) => {
      try {
        await addTaskAction(task);
      } catch (e) {
        console.error("Failed to add task", e);
      }
      await refreshFromServer();
    },
    [refreshFromServer]
  );

  const regenerateTasks = useCallback(
    async (tasks: { title: string; phase: string; dueDate: string; status: TaskStatus }[]) => {
      try {
        await regenerateTasksAction(tasks);
      } catch (e) {
        console.error("Failed to regenerate tasks", e);
      }
      await refreshFromServer();
    },
    [refreshFromServer]
  );

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem("wedding_data_fallback");
  };

  return (
    <WeddingContext.Provider
      value={{
        data,
        updateData,
        updateBasicInfo,
        updateTaskStatus,
        addTask,
        regenerateTasks,
        refreshFromServer,
        resetData,
        isLoaded,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error("useWedding must be used within a WeddingProvider");
  }
  return context;
};
