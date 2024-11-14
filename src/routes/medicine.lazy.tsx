import { createLazyFileRoute } from "@tanstack/react-router";
import { CalendarClock, CalendarX2, CalendarPlus } from "lucide-react";
import { MedicineProvider } from "@/context/medicine";
import AddMedication from "@/components/medicine/add-medication";
import { useEffect, useState } from "react";
import {
  exampleMedicines,
  MedicationStatus,
  MedicineByStatus,
  ScheduleCategory,
  TMedicine,
} from "@/types/medicine";
import { getDatas } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import Header from "@/features/medicine/components/header";

export const Route = createLazyFileRoute("/medicine")({
  component: Medicine,
});

type TMedicine = {
  status: MedicationStatus;
  medicines: TMedicine[];
};

function Medicine() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<undefined | TMedicine[]>(
    undefined,
  );

  useEffect(() => {
    if (!loading) setLoading(true);

    // function groupMedsByTime(data: TFilter[]) {
    //   const grouped = Map.groupBy(data, (item) => item.schedule.details.times[0]);

    //   return Array.from(grouped, ([key, value]) => ({
    //     time: key,
    //     data: value,
    //   }));
    // }

    async function getMedicines() {
      const medicines: TMedicine[] = await getDatas<TMedicine>(
        DB_NAME,
        MEDICINE_STORE,
      );

      const temp = Map.groupBy(medicines, (item) => item.status);
      const res: TMedicine[] = Array.from(temp, ([key, value]) => ({
        status: key,
        medicines: value,
      }));

      setMedicines(res);

      setLoading(false);
    }

    getMedicines();
  }, []);

  // const medicines = groupMedsByStatus(exampleMedicines) as MedicineByStatus[];

  console.log(medicines);

  if (loading) return <p>Loading...</p>;
  if (!medicines) return <p>No medicines found</p>;

  return (
    <main>
      {/* <Header meds={medicines} /> */}
      {/* {medicines.map((medicine) => (
        <section
          id="empty-schedule"
          className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24"
        >
          <header>
            <h2 className="text-xl font-medium">{medicine.status}</h2>
          </header>
          <div className="rounded-xl bg-[#262626]">
            {medicine.medicines.map((med) => (
              <article className="cursor-pointer border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40">
                <h3 className="font-medium">{med.name}</h3>
                <p className="line-clamp-1 text-[#A3A3A3]">{med.instruction}</p>
                <p className="text-[#A3A3A3]">
                  {med.schedule.category} ·{" "}
                  {med.schedule.category !== ScheduleCategory.TakeAsNeeded
                    ? med.schedule.details.times.length
                    : med.schedule.details.minTimeBetweenDoses}{" "}
                  times · {med.dosage.qty} {med.dosage.form}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))} */}
    </main>
  );
}

function groupMedsByStatus(data: TMedicine[]) {
  const grouped = Map.groupBy(data, (item) => item.status);

  return Array.from(grouped, ([key, value]) => ({
    status: key,
    medicines: value,
  }));
}
