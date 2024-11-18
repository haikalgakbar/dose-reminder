import Header from "@/features/checkin/components/header";
import MedicineCardHome from "@/components/home/medicine-card-home";
import useDailyTransactions from "@/hooks/useDailyTransaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  endOfISOWeek,
  format,
  formatDistanceToNow,
  startOfISOWeek,
} from "date-fns";
import { getDailyReminderMedicines } from "@/libs/reminder";
import { CalendarOff } from "lucide-react";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { getCurrentDate, getDaysOfInterval, isArrayEmpty } from "@/libs/util";
import {
  TMedicine,
  DosageQty,
  DosageForm,
  ScheduleCategory,
  DayOfWeek,
  DailySchedule,
  SpecificDaysSchedule,
  AsNeededSchedule,
} from "@/types/medicine";
import { useEffect, useState } from "react";
import { getDatas } from "@/libs/db";
import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";

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

type Medicine = {
  all: TTransactionRecord[];
  today: {
    withTime: MedicineTime[];
    optional: MedicineOptional[];
  };
};

function Home() {
  // const { dailyTransaction, isLoading } = useDailyTransactions();

  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<Medicine | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    async function fetchMedicines() {
      // Fetch the last 7 transaction records
      const response = (await getDatas(DB_NAME, TRANSACTION_STORE)).slice(
        -7,
      ) as TTransactionRecord[];

      // Filter today's medications based on the current date
      const todayMeds = response.filter((res) => res.id === getCurrentDate());
      const today = todayMeds[0];

      // Separate medications into those with a specific schedule and those taken as needed
      const withTime = today.medications.filter(
        (med) => med.schedule.category !== ScheduleCategory.TakeAsNeeded,
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
    medicines?.today.optional.length === 0 ||
    medicines?.today.withTime.length === 0
  )
    return <div>No medicines found</div>;

  console.log(medicines);

  return (
    <main>
      <Header />
      {medicines?.today.withTime.map((item, index) => (
        <section
          key={index}
          className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24"
        >
          <header>
            <h2 className="text-xl font-medium">{item.time}</h2>
          </header>
          <div className="rounded-xl bg-[#262626]">
            {item.data.map((med) => (
              <article
                key={med.id}
                className="cursor-pointer border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40"
              >
                <h3 className="font-medium">{med.name}</h3>
                <p className="line-clamp-1 text-[#A3A3A3]">{med.instruction}</p>
                <p className="text-[#A3A3A3]">
                  {med.dosage.qty} {med.dosage.form}
                </p>
              </article>
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
              <article
                key={med.id}
                className="cursor-pointer border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40"
              >
                <h3 className="font-medium">{med.name}</h3>
                <p className="line-clamp-1 text-[#A3A3A3]">{med.instruction}</p>
                <p className="text-[#A3A3A3]">
                  {med.dosage.qty} {med.dosage.form}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
