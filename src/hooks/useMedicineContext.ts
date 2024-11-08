import { MedicineContext } from "@/context/medicine";
import { useContext } from "react";

export default function useMedicineContext() {
  const context = useContext(MedicineContext);

  if (context === undefined) {
    throw new Error(
      "useMedicineContext must be used within a MedicineProvider",
    );
  }

  return context;
}
