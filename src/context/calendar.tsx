// import { createContext, useState, ReactNode } from "react";
// import { IMedicine, IMedicineContext } from "@/types/medicine";
// import { getCurrentDate } from "@/libs/util";

// export const defaultMedicine: IMedicine = {
//   name: "",
//   instruction: "",
//   status: "active",
//   dosage: {
//     qty: "1",
//     form: "tablets",
//   },
//   schedule: {
//     type: undefined,
//     reminder: {
//       day: undefined,
//       time: undefined,
//     },
//   },
//   duration: {
//     startDate: getCurrentDate(),
//   },
// };

// const MedicineContext = createContext<IMedicineContext | undefined>(undefined);

// function MedicineProvider({ children }: { children: ReactNode }) {
//   const [medicine, setMedicine] = useState<IMedicine>(defaultMedicine);

//   function updateMedicine(updates: Partial<IMedicine>) {
//     setMedicine((prev) => ({ ...prev, ...updates }));
//   }

//   return (
//     <MedicineContext.Provider value={{ medicine, updateMedicine }}>
//       {children}
//     </MedicineContext.Provider>
//   );
// }

// export { MedicineContext, MedicineProvider };
