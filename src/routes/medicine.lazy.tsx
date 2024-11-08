import { createLazyFileRoute } from "@tanstack/react-router";
import { CalendarClock, CalendarX2, CalendarPlus } from "lucide-react";
import { MedicineProvider } from "@/context/medicine";
// import { TMedicine } from "@/types/medicine";
// import {
//   getCurrentDate,
//   getMedicineBasedOnTimeToConsume,
//   isArrayEmpty,
//   processTransaction,
// } from "@/libs/util";
// import { eachDayOfInterval } from "date-fns";
// import { getData, getDatas, saveToDB, updateData } from "@/libs/db";
// import { DB_NAME, MEDICINE_STORE, TRANSACTION_STORE } from "@/constant/db";
// import { nanoid } from "nanoid";
// import { useEffect } from "react";
// import { TTransactionRecord } from "@/types/transaction";
import AddMedication from "@/components/medicine/add-medication";
import { useEffect, useState } from "react";
import { ScheduleCategory, TMedicine } from "@/types/medicine";
import { getDatas } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";

export const Route = createLazyFileRoute("/medicine")({
  component: Medicine,
});

function Medicine() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<{
    scheduled: TMedicine[];
    asNeeded: TMedicine[];
    suspended: TMedicine[];
  }>({
    scheduled: [],
    asNeeded: [],
    suspended: [],
  });

  useEffect(() => {
    async function getMedicines() {
      const medicines: TMedicine[] = await getDatas<TMedicine>(
        DB_NAME,
        MEDICINE_STORE,
      );

      const scheduledMeds = medicines.filter(
        (med) =>
          med.status === "active" &&
          med.schedule.category !== ScheduleCategory.TakeAsNeeded,
      );
      const asNeededMeds = medicines.filter(
        (med) =>
          med.status === "active" &&
          med.schedule.category === ScheduleCategory.TakeAsNeeded,
      );
      const suspendedMeds = medicines.filter(
        (med) => med.status === "inactive",
      );

      setMedicines({
        scheduled: scheduledMeds,
        asNeeded: asNeededMeds,
        suspended: suspendedMeds,
      });

      setLoading(false);
    }

    getMedicines();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="m-4 flex flex-col gap-4 rounded-xl border-b-2 border-b-[#BBA5A0]/20 bg-white p-4 text-[#33302E]">
        <header className="text-xl font-medium">My Meds</header>
        <div className="flex justify-between">
          <div>
            <div className="flex gap-2">
              <CalendarClock />
              <p>{medicines.scheduled.length}</p>
            </div>
            <h3>Scheduled</h3>
          </div>
          <div>
            <div className="flex gap-2">
              <CalendarX2 />
              <p>{medicines.asNeeded.length}</p>
            </div>
            <h3>As needed</h3>
          </div>
          <div>
            <div className="flex gap-2">
              <CalendarPlus />
              <p>{medicines.suspended.length}</p>
            </div>
            <h3>Suspended</h3>
          </div>
        </div>
        <MedicineProvider>
          <AddMedication />
        </MedicineProvider>
      </section>
      {medicines.scheduled.length > 0 && (
        <section className="px-4 py-2 text-[#33302E]">
          <header>Scheduled</header>
          {medicines.scheduled.map((med) => (
            <MedicineCard key={med.id} medication={med} />
          ))}
        </section>
      )}
      {medicines.asNeeded.length > 0 && (
        <section className="px-4 py-2 text-[#33302E]">
          <header>As needed</header>
          {medicines.asNeeded.map((med) => (
            <MedicineCard key={med.id} medication={med} />
          ))}
        </section>
      )}
      {medicines.suspended.length > 0 && (
        <section className="px-4 py-2 text-[#33302E]">
          <header>Suspended</header>
          {medicines.suspended.map((med) => (
            <MedicineCard key={med.id} medication={med} />
          ))}
        </section>
      )}
    </>
  );
}

function MedicineCard({ medication }: { medication: TMedicine }) {
  return (
    <div className="rounded-xl border-b-2 border-[#BBA5A0]/20 bg-white/70 p-4">
      <h2 className="text-lg font-medium">{medication.name}</h2>
      <p className="line-clamp-2">{medication.instruction}</p>
      <span>
        {medication.schedule.category === ScheduleCategory.DailyIntake
          ? "Daily"
          : medication.schedule.category === ScheduleCategory.SpecificDays
            ? "Specific day"
            : medication.schedule.details.minTimeBetweenDoses
              ? `${medication.schedule.details.minTimeBetweenDoses} hour interval`
              : "As needed"}{" "}
        ·{" "}
        {medication.schedule.category !== ScheduleCategory.TakeAsNeeded
          ? `${medication.schedule.details.times.length} time(s)`
          : null}{" "}
        · {medication.dosage.qty} {medication.dosage.form}
      </span>
    </div>
  );
}
