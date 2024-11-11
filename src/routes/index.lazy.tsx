import Header from "@/features/checkin/components/header";
import MedicineCardHome from "@/components/home/medicine-card-home";
import useDailyTransactions from "@/hooks/useDailyTransaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { getDailyReminderMedicines } from "@/libs/reminder";
import { CalendarOff } from "lucide-react";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { isArrayEmpty } from "@/libs/util";

export const Route = createLazyFileRoute("/")({
  component: Home,
});

function Home() {
  const { dailyTransaction, isLoading } = useDailyTransactions();

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
