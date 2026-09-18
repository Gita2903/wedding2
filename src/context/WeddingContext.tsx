"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getWeddingData, saveWeddingData, updateWeddingBasicInfo } from "@/actions/wedding";

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
  resetData: () => void;
  isLoaded: boolean;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<WeddingData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from DB on mount
  useEffect(() => {
    async function loadData() {
      try {
        const dbData = await getWeddingData();
        if (dbData) {
          setData((prev) => ({
            ...prev,
            ...dbData,
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

  const updateData = useCallback(async (newData: Partial<WeddingData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem("wedding_data_fallback", JSON.stringify(updated));

    if (updated.onboardingComplete) {
      try {
        await saveWeddingData(updated);
      } catch (e) {
        console.error("Failed to save to DB", e);
      }
    }
  }, [data]);

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

      const fresh = await getWeddingData();
      if (fresh) {
        setData((prev) => ({
          ...prev,
          ...fresh,
          weddingDate: fresh.weddingDate
            ? new Date(fresh.weddingDate).toISOString()
            : null,
          onboardingComplete: true,
        }));
      }
    },
    []
  );

  const resetData = () => {
    setData(defaultData);
    localStorage.removeItem("wedding_data_fallback");
  };

  return (
    <WeddingContext.Provider
      value={{ data, updateData, updateBasicInfo, resetData, isLoaded }}
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
