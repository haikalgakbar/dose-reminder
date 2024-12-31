import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MedicineByStatus,
  ScheduleCategory,
  TMedicine,
} from "@/types/medicine";
import { getDatas } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import Header from "@/features/medicine/components/header";
import { isArrayEmpty } from "@/libs/util";
import { Pill, Plus } from "lucide-react";
import { MedicineProvider } from "@/context/medicine";
import AddMedication from "@/features/medicine/components/add-medicine";
import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/medicine/")({
  component: Medicine,
});

function Medicine() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<undefined | MedicineByStatus[]>(
    undefined,
  );

  useEffect(() => {
    if (!loading) setLoading(true);

    async function getMedicines() {
      const medicines: TMedicine[] = await getDatas<TMedicine>(
        DB_NAME,
        MEDICINE_STORE,
      );

      if (isArrayEmpty(medicines)) {
        setMedicines(undefined);
        setLoading(false);
        return;
      }

      const temp = Map.groupBy(medicines, (item) => item.status);

      const res = Array.from(temp, ([key, value]) => ({
        status: key,
        medicines: value,
      })) as MedicineByStatus[];

      if (!res.some((item) => item.status === "inactive")) {
        res.push({ status: "inactive", medicines: [] });
      }

      setMedicines(res);

      setLoading(false);
    }

    getMedicines();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!medicines) return <EmptyMedication />;

  return (
    <main>
      <Header meds={medicines} />
      {medicines.map(
        (medicine) =>
          medicine.medicines.length >= 1 && (
            <section
              key={medicine.status}
              id="empty-schedule"
              className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24"
            >
              <header>
                <h2 className="ms-4 text-xl font-medium">{medicine.status}</h2>
              </header>
              <div className="rounded-xl bg-[#262626]">
                {medicine.medicines.map((med) => (
                  <Link to={`/medicine/${med.id}`} key={med.id}>
                    <article
                      key={med.id}
                      className="cursor-pointer border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40"
                    >
                      <h3 className="font-medium">{med.name}</h3>
                      <p className="line-clamp-1 text-[#A3A3A3]">
                        {med.instruction}
                      </p>
                      <p className="text-[#A3A3A3]">
                        {med.schedule.category} ·{" "}
                        {med.schedule.category !== ScheduleCategory.TakeAsNeeded
                          ? med.schedule.details.times.length
                          : med.schedule.details.minTimeBetweenDoses}{" "}
                        times · {med.dosage.qty} {med.dosage.form}
                      </p>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          ),
      )}
    </main>
  );
}

function EmptyMedication() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <section className="flex flex-col items-center p-4 text-neutral-200">
        <div className="relative w-fit rounded-full bg-neutral-800 p-4">
          <Pill className="text-neutral-200" />
          <div className="absolute bottom-0 right-0 rounded-full bg-neutral-200 p-1 text-neutral-800">
            <Plus size={16} />
          </div>
        </div>
        <header className="mt-4">
          <h2 className="text-2xl font-medium">
            Your medication list is empty
          </h2>
        </header>
        <p className="mb-4 mt-2 text-center">
          Easily manage your health by adding your first medication.
        </p>
        <MedicineProvider>
          <AddMedication>
            <Button
              aria-hidden="true"
              variant="default"
              className="flex items-center bg-neutral-200 p-4 text-neutral-900 hover:bg-neutral-400"
            >
              Add medication
            </Button>
          </AddMedication>
        </MedicineProvider>
      </section>
    </main>
  );
}