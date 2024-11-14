import { createContext, useState, ReactNode } from "react";
import {
  TMedicine,
  MedicineContextType,
  DosageForm,
  DosageQty,
  ScheduleCategory,
  Schedule,
} from "@/types/medicine";
import { getCurrentDate } from "@/libs/util";

export const defaultMedicine: Omit<TMedicine, "status" | "id"> = {
  name: "",
  instruction: "",
  dosage: {
    qty: DosageQty.One,
    form: DosageForm.Capsules,
  },
  schedule: {
    category: ScheduleCategory.DailyIntake,
    details: {
      times: ["00:00"],
    },
  },
  duration: {
    startDate: getCurrentDate(),
  },
};

const MedicineContext = createContext<MedicineContextType | undefined>(
  undefined,
);

function MedicineProvider({ children }: { children: ReactNode }) {
  const [medicine, setMedicine] =
    useState<Omit<TMedicine, "status" | "id">>(defaultMedicine);

  function updateMedicine(updates: Partial<Omit<TMedicine, "status" | "id">>) {
    setMedicine((prev) => ({ ...prev, ...updates }));
  }

  return (
    <MedicineContext.Provider value={{ medicine, updateMedicine }}>
      {children}
    </MedicineContext.Provider>
  );
}

export { MedicineContext, MedicineProvider };
