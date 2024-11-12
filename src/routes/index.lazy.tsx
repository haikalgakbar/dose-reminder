import Header from "@/features/checkin/components/header";
import MedicineCardHome from "@/components/home/medicine-card-home";
import useDailyTransactions from "@/hooks/useDailyTransaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { getDailyReminderMedicines } from "@/libs/reminder";
import { CalendarOff } from "lucide-react";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { isArrayEmpty } from "@/libs/util";
import {
  TMedicine,
  DosageQty,
  DosageForm,
  ScheduleCategory,
  DayOfWeek,
  DailySchedule,
  SpecificDaysSchedule,
} from "@/types/medicine";
import { nanoid } from "nanoid";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

type TFilter = Omit<TMedicine, "schedule"> & {
  schedule:
    | { category: ScheduleCategory.DailyIntake; details: DailySchedule }
    | {
        category: ScheduleCategory.SpecificDays;
        details: SpecificDaysSchedule;
      };
};

function Home() {
  // const { dailyTransaction, isLoading } = useDailyTransactions();

  const exampleMedicines: TMedicine[] = [
    {
      id: "1",
      name: "Ibuprofen",
      instruction: "Take as needed for pain. Do not exceed 6 doses per day.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Spray },
      schedule: {
        category: ScheduleCategory.TakeAsNeeded,
        details: { minTimeBetweenDoses: null },
      },
      duration: { startDate: "2024-10-01T00:00:00Z" },
    },
    {
      id: "2",
      name: "Vitamin D3",
      instruction: "Take daily in the morning after breakfast.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Capsules },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["06:00", "12:00", "18:00"] },
      },
      duration: {
        startDate: "2024-09-15T00:00:00Z",
        endDate: "2025-09-15T00:00:00Z",
      },
    },
    {
      id: "3",
      name: "Metformin",
      instruction: "Take twice daily with meals for blood sugar control.",
      status: "inactive",
      dosage: { qty: DosageQty.Two, form: DosageForm.Cream },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["08:00", "20:00"] },
      },
      duration: { startDate: "2024-01-01T00:00:00Z" },
    },
    {
      id: "4",
      name: "Albuterol Inhaler",
      instruction: "Use as needed for asthma symptoms.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Inhaler },
      schedule: {
        category: ScheduleCategory.TakeAsNeeded,
        details: { minTimeBetweenDoses: "03:00" },
      },
      duration: { startDate: "2024-06-01T00:00:00Z" },
    },
    {
      id: "5",
      name: "Amoxicillin",
      instruction:
        "Take every 8 hours for bacterial infection. Complete the full course.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Powder },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["08:00", "20:00"] },
      },
      duration: {
        startDate: "2024-10-01T00:00:00Z",
        endDate: "2024-10-10T00:00:00Z",
      },
    },
    {
      id: "6",
      name: "Fluoxetine",
      instruction: "Take daily in the morning.",
      status: "inactive",
      dosage: { qty: DosageQty.Two, form: DosageForm.Paste },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["08:00"] },
      },
      duration: {
        startDate: "2024-04-01T00:00:00Z",
        endDate: "2024-09-30T00:00:00Z",
      },
    },
    {
      id: "7",
      name: "Insulin",
      instruction: "Inject as directed based on blood sugar levels.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Injection },
      schedule: {
        category: ScheduleCategory.TakeAsNeeded,
        details: { minTimeBetweenDoses: "06:00" },
      },
      duration: { startDate: "2024-02-01T00:00:00Z" },
    },
    {
      id: "8",
      name: "Methotrexate",
      instruction:
        "Take once a week. Avoid alcohol on the day of and after taking.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Gel },
      schedule: {
        category: ScheduleCategory.SpecificDays,
        details: { days: [DayOfWeek.Mon, DayOfWeek.Thu], times: ["21:00"] },
      },
      duration: { startDate: "2024-03-01T00:00:00Z" },
    },
    {
      id: "9",
      name: "Prednisone",
      instruction: "Take for 5 days as directed.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Lozenge },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["09:00"] },
      },
      duration: {
        startDate: "2024-10-03T00:00:00Z",
        endDate: "2024-10-08T00:00:00Z",
      },
    },
    {
      id: "10",
      name: "Clarithromycin",
      instruction: "Take every 12 hours for 7 days.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Pills },
      schedule: {
        category: ScheduleCategory.DailyIntake,
        details: { times: ["07:00", "19:00"] },
      },
      duration: {
        startDate: "2024-10-05T00:00:00Z",
        endDate: "2024-10-12T00:00:00Z",
      },
    },
    {
      id: "11",
      name: "Example 1",
      instruction:
        "Take once a week. Avoid alcohol on the day of and after taking.",
      status: "active",
      dosage: { qty: DosageQty.Two, form: DosageForm.Tablets },
      schedule: {
        category: ScheduleCategory.SpecificDays,
        details: {
          days: [
            DayOfWeek.Mon,
            DayOfWeek.Tue,
            DayOfWeek.Wed,
            DayOfWeek.Thu,
            DayOfWeek.Fri,
            DayOfWeek.Sat,
            DayOfWeek.Sun,
          ],
          times: ["06:00", "12:00", "18:00"],
        },
      },
      duration: {
        startDate: "2024-04-01T00:00:00Z",
        // endDate: "2024-10-01T00:00:00Z",
      },
    },
  ];

  function filterActiveMedicines(data: TMedicine[]) {
    return data.filter((med) => med.status === "active");
  }

  function extractTime(data: TMedicine[]) {
    const filter = data.filter(
      (med) => med.schedule.category !== ScheduleCategory.TakeAsNeeded,
    ) as TFilter[];

    return filter
      .map((item) =>
        item.schedule.details.times.map((time) => ({
          ...item,
          schedule: {
            ...item.schedule,
            details: { ...item.schedule.details, times: [time] },
          },
        })),
      )
      .flatMap((item) => item)
      .toSorted((a, b) =>
        a.schedule.details.times[0].localeCompare(b.schedule.details.times[0]),
      );
  }

  function groupMedsByTime(data: TFilter[]) {
    const grouped = Map.groupBy(data, (item) => item.schedule.details.times[0]);

    return Array.from(grouped, ([key, value]) => ({
      time: key,
      data: value,
    }));
  }

  const filteredMeds = filterActiveMedicines(exampleMedicines);
  const dum = extractTime(filteredMeds) as TFilter[];
  const group = groupMedsByTime(dum);

  return (
    <main>
      <Header />
      {group.map((item) => (
        <section
          id="empty-schedule"
          className="flex flex-col gap-2 p-4 text-[#F5F5F5] last:mb-24"
        >
          <header>
            <h2 className="text-xl font-medium">{item.time}</h2>
          </header>
          <div className="rounded-xl bg-[#262626]">
            {item.data.map((med) => (
              <article className="cursor-pointer border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40">
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
    </main>
  );
}
