import { Task, WeddingData } from "@/context/WeddingContext";
const uuidv4 = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2);

// Default timeline structure
const TIMELINE_TEMPLATES = [
  {
    phase: "12+ Bulan Sebelum",
    offsetMonths: 12,
    tasks: [
      "Tentukan konsep & tema pernikahan",
      "Buat list tamu bayangan (draft 1)",
      "Tentukan estimasi budget awal",
      "Mulai riset venue",
      "Mulai riset Wedding Organizer (opsional)",
    ]
  },
  {
    phase: "6-12 Bulan Sebelum",
    offsetMonths: 6,
    tasks: [
      "Booking Venue & bayar DP",
      "Pilih & booking Catering",
      "Pilih & booking Fotografer/Videografer",
      "Booking MUA & Attire",
      "Pesan Cincin Kawin",
    ]
  },
  {
    phase: "3-6 Bulan Sebelum",
    offsetMonths: 3,
    tasks: [
      "Finalisasi list tamu",
      "Desain & cetak Undangan",
      "Pesan Souvenir",
      "Urus Dokumen Legal (KUA / Catatan Sipil)",
      "Pesan Seragam Keluarga/Bridesmaid",
      "Booking Entertainment/MC",
    ]
  },
  {
    phase: "1-3 Bulan Sebelum",
    offsetMonths: 1,
    tasks: [
      "Sebar Undangan",
      "Fitting baju final",
      "Test food Catering",
      "Technical Meeting dengan semua vendor",
      "Beli Seserahan/Mahar",
    ]
  },
  {
    phase: "H-1 Minggu",
    offsetMonths: 0,
    tasks: [
      "Gladi Resik",
      "Pelunasan semua vendor",
      "Istirahat yang cukup & perawatan tubuh",
      "Packing barang untuk hari H",
    ]
  }
];

export const generateTimeline = (data: WeddingData): Task[] => {
  const generatedTasks: Task[] = [];
  const weddingDate = data.weddingDate ? new Date(data.weddingDate) : new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // Default 1 year if unknown

  TIMELINE_TEMPLATES.forEach(template => {
    // Calculate due date based on offset
    const dueDate = new Date(weddingDate);
    dueDate.setMonth(dueDate.getMonth() - template.offsetMonths);
    
    // Ensure dueDate is not in the past
    if (dueDate < new Date()) {
       // If the wedding is very soon or task is overdue by default, just set the due date to tomorrow to avoid immediate overdue panic
       const tomorrow = new Date();
       tomorrow.setDate(tomorrow.getDate() + 1);
       dueDate.setTime(tomorrow.getTime());
    }

    template.tasks.forEach(taskTitle => {
      generatedTasks.push({
        id: uuidv4(),
        title: taskTitle,
        phase: template.phase,
        dueDate: dueDate.toISOString(),
        status: "Belum Mulai"
      });
    });
  });

  // Add Religion-specific tasks
  const docDueDate = new Date(weddingDate);
  docDueDate.setMonth(docDueDate.getMonth() - 3); // Usually documents are processed 3 months before

  if (docDueDate < new Date()) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      docDueDate.setTime(nextWeek.getTime()); // Give 1 week if urgent
  }

  if (data.religion === "islam") {
    generatedTasks.push({
      id: uuidv4(),
      title: "Urus Surat N1-N4 di Kelurahan",
      phase: "3-6 Bulan Sebelum",
      dueDate: docDueDate.toISOString(),
      status: "Belum Mulai"
    });
    generatedTasks.push({
      id: uuidv4(),
      title: "Daftar Nikah di KUA",
      phase: "3-6 Bulan Sebelum",
      dueDate: docDueDate.toISOString(),
      status: "Belum Mulai"
    });
  } else if (data.religion) {
    generatedTasks.push({
      id: uuidv4(),
      title: "Urus Surat Pengantar Agama & Catatan Sipil",
      phase: "3-6 Bulan Sebelum",
      dueDate: docDueDate.toISOString(),
      status: "Belum Mulai"
    });
  }

  return generatedTasks;
};
