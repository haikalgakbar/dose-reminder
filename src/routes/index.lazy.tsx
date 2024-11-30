import Header from "@/features/checkin/components/header";
import { createLazyFileRoute } from "@tanstack/react-router";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { getCurrentDate, isArrayEmpty } from "@/libs/util";
import {
  TMedicine,
  ScheduleCategory,
  DailySchedule,
  SpecificDaysSchedule,
  AsNeededSchedule,
} from "@/types/medicine";
import { useEffect, useState } from "react";
import { getDatas } from "@/libs/db";
import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";
import { DetailMedicine } from "@/features/checkin/components/detail-medicine";
import { Apple } from "lucide-react";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

type MedicineWithTime = Omit<TMedicine, "schedule"> & {
  schedule:
    | { category: ScheduleCategory.DailyIntake; details: DailySchedule }
    | {
        category: ScheduleCategory.SpecificDays;
        details: SpecificDaysSchedule;
      };
};

type MedicineOptional = Omit<TMedicine, "schedule"> & {
  schedule: {
    category: ScheduleCategory.TakeAsNeeded;
    details: AsNeededSchedule;
  };
};

type MedicineTime = {
  time: string;
  data: MedicineWithTime[];
};

export type Medicine = {
  all: TTransactionRecord[];
  today: {
    withTime: MedicineTime[];
    optional: MedicineOptional[];
  };
};

function Home() {
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    async function fetchMedicines() {
      // Fetch the last 7 transaction records
      const response = (await getDatas(DB_NAME, TRANSACTION_STORE)).slice(
        -7,
      ) as TTransactionRecord[];

      if (isArrayEmpty(response)) {
        const emptyMedicines: Medicine = {
          all: [],
          today: {
            withTime: [],
            optional: [],
          },
        };
        setMedicines(emptyMedicines);
        setLoading(false);
        return;
      }

      // Filter today's medications based on the current date
      const todayMeds = response.filter((res) => res.id === getCurrentDate());
      const today = todayMeds[0];

      // Separate medications into those with a specific schedule and those taken as needed
      const withTime = today.medications.filter(
        (med) =>
          med.schedule.category !== ScheduleCategory.TakeAsNeeded &&
          med.consumedAt.length === 0,
      ) as unknown as MedicineWithTime[];

      const optional = today.medications.filter(
        (med) => med.schedule.category === ScheduleCategory.TakeAsNeeded,
      ) as unknown as MedicineOptional[];

      // Group medications by their scheduled time
      const withTimeMap = Map.groupBy(
        withTime,
        (item) => item.schedule.details.times[0],
      );

      // Convert the grouped medications into the desired format
      const medicineWithTime = Array.from(withTimeMap, ([key, value]) => ({
        time: key,
        data: value,
      })) as unknown as MedicineTime[];

      // Update the state with the new medication data
      setMedicines({
        all: response,
        today: {
          withTime: medicineWithTime,
          optional,
        },
      });

      setLoading(false);
    }
    fetchMedicines();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (
    medicines?.today.optional.length === 0 &&
    medicines?.today.withTime.length === 0
  )
    return (
      <main className="flex min-h-screen flex-col">
        <Header transactions={medicines!.all} />
        <section className="flex flex-1 flex-col items-center justify-center gap-2 pb-48 text-neutral-400">
          <div className="h-full w-fit rounded-full bg-neutral-800 p-4">
            <Apple className="text-white" />
          </div>
          <h2 className="text-2xl font-medium text-neutral-200">
            Your schedule is clear
          </h2>
          <p>Remember to rest or add new medication if necessary.</p>
        </section>
      </main>
    );

  return (
    <main>
      <Header transactions={medicines!.all} />
      {medicines?.today.withTime.map((item, index) => (
        <section
          key={index}
          className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24"
        >
          <header>
            <h2 className="text-xl font-medium">{item.time}</h2>
          </header>
          <div className="rounded-xl bg-[#262626]">
            {item.data.map((med, index) => (
              <DetailMedicine
                key={med.id}
                medicine={med as unknown as MedicineTransaction}
                setMedicine={setMedicines}
                transaction={medicines.all[index]}
              />
            ))}
          </div>
        </section>
      ))}
      {medicines?.today.optional.length ? (
        <section className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24">
          <header>
            <h2 className="text-xl font-medium">Take as needed</h2>
          </header>
          <div className="rounded-xl bg-[#262626]">
            {medicines?.today.optional.map((med) => (
              <DetailMedicine
                key={med.id}
                medicine={med as unknown as MedicineTransaction}
                setMedicine={setMedicines}
                transaction={medicines.all[6]}
              />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}