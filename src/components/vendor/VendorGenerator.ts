import { Vendor, VendorCategory } from "@/context/WeddingContext";

const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);

export const generateVendors = (estimatedBudget: number): Vendor[] => {
  // Typical Indonesian wedding budget allocation percentages
  const allocations: { category: VendorCategory; name: string; percentage: number }[] = [
    { category: "Venue", name: "Venue / Gedung", percentage: 0.15 },
    { category: "Catering", name: "Catering (Makanan & Minuman)", percentage: 0.35 },
    { category: "Dekorasi", name: "Dekorasi Pelaminan & Area", percentage: 0.15 },
    { category: "MUA & Attire", name: "Rias, Busana Pengantin & Keluarga", percentage: 0.10 },
    { category: "Fotografer", name: "Dokumentasi (Foto & Video)", percentage: 0.08 },
    { category: "WO", name: "Wedding Organizer / Planner", percentage: 0.05 },
    { category: "Entertainment", name: "MC & Hiburan/Musik", percentage: 0.05 },
    { category: "Souvenir", name: "Undangan & Souvenir", percentage: 0.04 },
    { category: "Cincin & Mahar", name: "Cincin Kawin & Seserahan", percentage: 0.03 }
  ];

  return allocations.map(alloc => ({
    id: uuidv4(),
    category: alloc.category,
    name: alloc.name,
    contact: "",
    priceQuote: Math.round(estimatedBudget * alloc.percentage),
    status: "Riset",
    notes: "Dibuat otomatis dari template budget."
  }));
};
