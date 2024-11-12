import Header from "@/features/checkin/components/header";
import MedicineCardHome from "@/components/home/medicine-card-home";
import useDailyTransactions from "@/hooks/useDailyTransaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { getDailyReminderMedicines } from "@/libs/reminder";
import { CalendarOff } from "lucide-react";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { isArrayEmpty } from "@/libs/util";
// import {
//   TMedicine,
//   DosageQty,
//   DosageForm,
//   ScheduleCategory,
//   DayOfWeek,
// } from "@/types/medicine";
import { nanoid } from "nanoid";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  const { dailyTransaction, isLoading } = useDailyTransactions();

  // const exampleMedicines: TMedicine[] = [
  //   {
  //     id: "1",
  //     name: "Ibuprofen",
  //     instruction: "Take as needed for pain. Do not exceed 6 doses per day.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Spray },
  //     schedule: {
  //       category: ScheduleCategory.TakeAsNeeded,
  //       details: { minTimeBetweenDoses: null },
  //     },
  //     duration: { startDate: "2024-10-01T00:00:00Z" },
  //   },
  //   {
  //     id: "2",
  //     name: "Vitamin D3",
  //     instruction: "Take daily in the morning after breakfast.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Capsules },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["06:00", "12:00", "18:00"] },
  //     },
  //     duration: {
  //       startDate: "2024-09-15T00:00:00Z",
  //       endDate: "2025-09-15T00:00:00Z",
  //     },
  //   },
  //   {
  //     id: "3",
  //     name: "Metformin",
  //     instruction: "Take twice daily with meals for blood sugar control.",
  //     status: "inactive",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Cream },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["08:00", "20:00"] },
  //     },
  //     duration: { startDate: "2024-01-01T00:00:00Z" },
  //   },
  //   {
  //     id: "4",
  //     name: "Albuterol Inhaler",
  //     instruction: "Use as needed for asthma symptoms.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Inhaler },
  //     schedule: {
  //       category: ScheduleCategory.TakeAsNeeded,
  //       details: { minTimeBetweenDoses: "03:00" },
  //     },
  //     duration: { startDate: "2024-06-01T00:00:00Z" },
  //   },
  //   {
  //     id: "5",
  //     name: "Amoxicillin",
  //     instruction:
  //       "Take every 8 hours for bacterial infection. Complete the full course.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Powder },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["08:00", "20:00"] },
  //     },
  //     duration: {
  //       startDate: "2024-10-01T00:00:00Z",
  //       endDate: "2024-10-10T00:00:00Z",
  //     },
  //   },
  //   {
  //     id: "6",
  //     name: "Fluoxetine",
  //     instruction: "Take daily in the morning.",
  //     status: "inactive",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Paste },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["08:00"] },
  //     },
  //     duration: {
  //       startDate: "2024-04-01T00:00:00Z",
  //       endDate: "2024-09-30T00:00:00Z",
  //     },
  //   },
  //   {
  //     id: "7",
  //     name: "Insulin",
  //     instruction: "Inject as directed based on blood sugar levels.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Injection },
  //     schedule: {
  //       category: ScheduleCategory.TakeAsNeeded,
  //       details: { minTimeBetweenDoses: "06:00" },
  //     },
  //     duration: { startDate: "2024-02-01T00:00:00Z" },
  //   },
  //   {
  //     id: "8",
  //     name: "Methotrexate",
  //     instruction:
  //       "Take once a week. Avoid alcohol on the day of and after taking.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Gel },
  //     schedule: {
  //       category: ScheduleCategory.SpecificDays,
  //       details: { days: [DayOfWeek.Mon, DayOfWeek.Thu], times: ["21:00"] },
  //     },
  //     duration: { startDate: "2024-03-01T00:00:00Z" },
  //   },
  //   {
  //     id: "9",
  //     name: "Prednisone",
  //     instruction: "Take for 5 days as directed.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Lozenge },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["09:00"] },
  //     },
  //     duration: {
  //       startDate: "2024-10-03T00:00:00Z",
  //       endDate: "2024-10-08T00:00:00Z",
  //     },
  //   },
  //   {
  //     id: "10",
  //     name: "Clarithromycin",
  //     instruction: "Take every 12 hours for 7 days.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Pills },
  //     schedule: {
  //       category: ScheduleCategory.DailyIntake,
  //       details: { times: ["07:00", "19:00"] },
  //     },
  //     duration: {
  //       startDate: "2024-10-05T00:00:00Z",
  //       endDate: "2024-10-12T00:00:00Z",
  //     },
  //   },
  //   {
  //     id: "11",
  //     name: "Example 1",
  //     instruction:
  //       "Take once a week. Avoid alcohol on the day of and after taking.",
  //     status: "active",
  //     dosage: { qty: DosageQty.Two, form: DosageForm.Tablets },
  //     schedule: {
  //       category: ScheduleCategory.SpecificDays,
  //       details: {
  //         days: [
  //           DayOfWeek.Mon,
  //           DayOfWeek.Tue,
  //           DayOfWeek.Wed,
  //           DayOfWeek.Thu,
  //           DayOfWeek.Fri,
  //           DayOfWeek.Sat,
  //           DayOfWeek.Sun,
  //         ],
  //         times: ["06:00", "12:00", "18:00"],
  //       },
  //     },
  //     duration: {
  //       startDate: "2024-04-01T00:00:00Z",
  //       // endDate: "2024-10-01T00:00:00Z",
  //     },
  //   },
  // ];

  type dummy = {
    id: string;
    name: string;
    time: string[];
  };

  const examplesData: dummy[] = [
    {
      id: nanoid(4),
      name: "test 1",
      time: ["06:00", "12:00"],
    },
    {
      id: nanoid(4),
      name: "test 2",
      time: ["06:00", "12:00"],
    },
    {
      id: nanoid(4),
      name: "test 3",
      time: ["10:00", "18:00"],
    },
  ];

  type extractTime = Omit<dummy, "time"> & { time: string };

  function extractTime(data: dummy[]) {
    return data
      .map((item) => item.time.map((time) => ({ ...item, time })))
      .flatMap((item) => item)
      .toSorted((a, b) => Number(a.time) - Number(b.time));
  }

  console.log(extractTime(examplesData));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (dailyTransaction.length > 0) {
    const { takeNow, comingUp, takeLater, takeAsNeeded } =
      getDailyReminderMedicines(dailyTransaction[0].medications);

    return (
      <>
        <Header />
        {!isArrayEmpty(takeNow) ? (
          <Section
            medications={takeNow}
            headerText="Take now"
            transaction={dailyTransaction}
          />
        ) : null}
        {!isArrayEmpty(comingUp) ? (
          <Section
            medications={comingUp}
            headerText="Coming up in"
            time={formatDistanceToNow(
              new Date().setHours(
                +comingUp[0].timeToConsume!.split(":")[0],
                +comingUp[0].timeToConsume!.split(":")[1],
              ),
            )}
            transaction={dailyTransaction}
          />
        ) : null}
        {!isArrayEmpty(takeLater) ? (
          <Section
            medications={takeLater}
            headerText="Take later"
            time="today"
            transaction={dailyTransaction}
          />
        ) : null}
        {!isArrayEmpty(takeAsNeeded) ? (
          <Section
            medications={takeAsNeeded}
            headerText="Take as needed"
            transaction={dailyTransaction}
          />
        ) : null}
        <Section
          medications={takeLater}
          headerText="Take later"
          time="today"
          transaction={dailyTransaction}
        />
        <Section
          medications={takeLater}
          headerText="Take later"
          time="today"
          transaction={dailyTransaction}
        />
        <Section
          medications={takeLater}
          headerText="Take later"
          time="today"
          transaction={dailyTransaction}
        />
        <Section
          medications={takeLater}
          headerText="Take later"
          time="today"
          transaction={dailyTransaction}
        />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <section
          id="empty-schedule"
          className="flex h-dvh flex-col items-center justify-center text-[#33302E]"
        >
          <div className="rounded-full bg-white/70 p-4">
            <CalendarOff size={24} className="text-[#FFD2A7]" />
          </div>
          <h2 className="text-xl font-medium">Your schedule is clear 🙌</h2>
          <p>Remember to rest or add new medication if necessary.</p>
        </section>
      </>
    );
  }
}

function Section({
  medications,
  headerText,
  time,
  transaction,
}: {
  medications: MedicineTransaction[];
  headerText: string;
  time?: string;
  transaction: TTransactionRecord[];
}) {
  return (
    <section id="take-now" className="space-y-2 px-4 py-2">
      <header className="flex items-center gap-2 font-medium text-slate-700">
        {time ? (
          `${headerText} ${time}`
        ) : (
          <>
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F96C00] opacity-50"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F96C00]"></span>
            </span>
            {headerText}
          </>
        )}
      </header>
      {medications.map((med, index) => (
        <MedicineCardHome
          key={index}
          medication={med}
          transaction={transaction}
        />
      ))}
    </section>
  );
}
