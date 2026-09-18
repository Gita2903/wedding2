"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
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
  // Name of whoever last created/changed this task (e.g. a partner).
  // Undefined/null means no edit has been tracked for it yet.
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

// --- Default State ---
const defaultData: WeddingData = {
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

// Turns the raw rows Prisma returns (Date objects, a nested `lastEditedBy`
// relation) into the flat shape the rest of the app expects.
function normalizeTasks(rawTasks: any[] | undefined): Task[] {
  if (!rawTasks) return [];
  return rawTasks.map((t) => ({
    id: t.id,
    title: t.title,
    phase: t.phase,
    dueDate: t.dueDate instanceof Date ? t.dueDate.toISOString() : t.dueDate,
    status: t.status,
    lastEditedByName: t.lastEditedBy?.name ?? null,
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
    religion: string;
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
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  // Pulls the latest wedding from the DB and merges it in. Used on mount,
  // after every task/wedding-info mutation, and by the polling/focus refresh
  // below — this is what keeps two partners' browsers roughly in sync
  // without needing a websocket.
  const refreshFromServer = useCallback(async () => {
    try {
      const fresh = await getWeddingData();
      if (fresh) {
        setData((prev) => ({
          ...prev,
          ...fresh,
          tasks: normalizeTasks((fresh as any).tasks),
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
            tasks: normalizeTasks((dbData as any).tasks),
            weddingDate: dbData.weddingDate ? new Date(dbData.weddingDate).toISOString() : null,
            onboardingComplete: true
          }));
        } else {
          // If no db data, try local storage fallback or just stay default
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

  // Keep two partners' browsers roughly in sync: re-pull from the DB
  // periodically while the tab is visible, and immediately whenever the tab
  // regains focus/visibility. This is deliberately simple polling rather
  // than a websocket — good enough for "did my partner just tick something
  // off" without adding realtime infra.
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
        await saveWeddingData(updated);
      } catch (e) {
        console.error("Failed to save to DB", e);
      }
    }
  }, []);

  // Updates ONLY the basic wedding fields (couple names, date, city, religion)
  // via a scoped server action that never touches tasks/vendors. After saving,
  // it re-fetches the wedding from DB so this browser also picks up any
  // task/vendor changes a partner made elsewhere — instead of `updateData`,
  // which would push this browser's possibly-stale local tasks/vendors and
  // silently overwrite the partner's progress.
  const updateBasicInfo = useCallback(
    async (fields: {
      groomName: string;
      brideName: string;
      weddingDate: string | null;
      city: string;
      religion: string;
    }) => {
      await updateWeddingBasicInfo(fields);
      await refreshFromServer();
    },
    [refreshFromServer]
  );

  // Changes a single task's status. Optimistic-updates the local list first
  // so the click feels instant, then confirms with the server and refreshes
  // so any change a partner made elsewhere also shows up.
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

  // Full roadmap reset — replaces every task. Scoped to tasks only, unlike
  // saveWeddingData's version which would also drag along (and overwrite)
  // whatever vendors happen to be in this browser's local state.
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
