import { MedicineByStatus } from "@/types/medicine";
import { Pill, X } from "lucide-react";
import AddMedication from "./add-medicine";
import { MedicineProvider } from "@/context/medicine";

export default function Header({ meds }: { meds: MedicineByStatus[] }) {
  return (
    <section className="flex flex-col gap-2 p-4 text-[#F5F5F5]">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Medicine</h2>
        <MedicineProvider>
          <AddMedication />
        </MedicineProvider>
      </header>
      <div className="flex gap-2">
        {meds.map((medicine) => (
          <article
            key={medicine.status}
            className="w-full rounded-xl bg-[#262626] p-4"
          >
            <div className="w-fit rounded-full bg-[#f5f5f5] p-3 text-[#262626]">
              {medicine.status === "active" ? (
                <Pill size={20} />
              ) : (
                <X size={20} />
              )}
            </div>
            <h3 className="text-2xl font-medium">
              {medicine.medicines.length}
            </h3>
            <p>{medicine.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}