import { Calendar } from "@/components/ui/calendar";
import { getCurrentDate } from "@/libs/util";
import {
  MedicineTransactionAsNeeded,
  MedicineTransactionWithSchedule,
  TTransactionRecord,
} from "@/types/transaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import { format, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getTransactions,
  handleMonthNavigation,
  handleDisabled,
  handleTodayClick,
  handleDateSelection,
  handleSelectedTransaction,
} from "@/features/history/util";
import { CalendarItem } from "@/features/history/calendar-status";
import { ScheduledCard } from "@/features/history/scheduled-card";
import { ScheduleCategory } from "@/types/medicine";
import { AsNeededCard } from "@/features/history/asneeded-card";

export const Route = createLazyFileRoute("/history")({
  component: History,
});

function getDateTransaction(date: Date, transactions: TTransactionRecord[]) {
  const result = transactions.find((transaction) =>
    isSameDay(parseISO(transaction.id), date),
  );

  return result;
}

function History() {
  const today = getCurrentDate();

  const [isMounted, setIsMounted] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(today));
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(today));
  const [transactions, setTransactions] = useState<TTransactionRecord[] | []>(
    [],
  );
  const [selectedTransaction, setSelectedTransaction] = useState<
    TTransactionRecord | undefined
  >(undefined);

  useEffect(() => {
    getTransactions().then((res) => {
      if (isMounted) {
        setTransactions(res);
        handleSelectedTransaction(selectedDate, res, setSelectedTransaction);
      }
    });

    return () => {
      setIsMounted(false);
    };
  }, []);

  if (isMounted) return <div>Loading...</div>;

  console.log(selectedTransaction);

  return (
    <main className="flex min-h-screen w-full max-w-xl flex-col">
      <section className="w-full space-y-4 p-4 pb-2 text-neutral-200">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            handleDateSelection(date as Date, setSelectedDate, selectedDate);
            handleSelectedTransaction(
              date as Date,
              transactions,
              setSelectedTransaction,
            );
          }}
          month={selectedMonth}
          className="w-full rounded-md p-0"
          classNames={{
            months: "sm:flex-col",
            day_today: "border border-neutral-200",
            row: "flex w-full mt-1 gap-1",
            cell: "w-full p-0 relative [&:has([aria-selected].day-outside)]:bg-accent/50 focus-within:relative focus-within:z-20 rounded-xl aspect-square justify-center flex items-center [&:has([aria-selected])]:bg-neutral-200",
            head_row: "flex gap-1",
            head_cell:
              "text-neutral-400 w-full font-normal text-sm bg-neutral-800 rounded-full",
            day: "w-full h-full p-0 font-normal aria-selected:opacity-90 bg-neutral-800 rounded-xl hover:bg-neutral-700 hover:text-white aria-selected:text-neutral-900 aria-selected:bg-neutral-200",
            day_selected: "bg-neutral-200 text-neutral-900",
          }}
          weekStartsOn={1}
          showOutsideDays={false}
          formatters={{
            formatWeekdayName: (date, options) => format(date, "EEE", options),
            formatCaption: (date, options) =>
              format(date, "MMM  yyyy", options),
          }}
          components={{
            Caption: ({ displayMonth }) => (
              <div className="flex w-full items-center justify-between">
                <div className="text-lg font-medium text-[#f5f5f5]">
                  {displayMonth.toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-fit rounded-lg px-4 py-2 text-base font-normal text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200 ${selectedDate?.toISOString() === today && selectedMonth?.toISOString() === today && "hidden"}`}
                    onClick={() =>
                      handleTodayClick(setSelectedDate, setSelectedMonth)
                    }
                  >
                    Today
                  </Button>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg p-2 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200"
                      onClick={() =>
                        handleMonthNavigation(setSelectedMonth, "prev")
                      }
                      disabled={handleDisabled(
                        transactions,
                        selectedMonth,
                        "prev",
                      )}
                    >
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg p-2 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200"
                      onClick={() =>
                        handleMonthNavigation(setSelectedMonth, "next")
                      }
                      disabled={handleDisabled(
                        transactions,
                        selectedMonth,
                        "next",
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ),
            DayContent: ({ date }) => (
              <div className="flex flex-col items-center">
                {date <= new Date(today) && (
                  <CalendarItem
                    key={date.toISOString()}
                    transaction={getDateTransaction(date, transactions)}
                  />
                )}
                {date.getDate()}
              </div>
            ),
          }}
        />
      </section>
      <section className="flex h-full flex-col gap-2 p-4 text-neutral-200">
        <header>
          <h2 className="font-medium">
            {selectedDate?.getDate() === new Date(today).getDate()
              ? `Today, ${format(new Date(getCurrentDate()), "dd MMM yyyy")}`
              : format(selectedDate || "", "EEEE, dd MMM yyyy")}
          </h2>
        </header>
        {selectedTransaction ? (
          selectedTransaction.medications.map((medicine, index) =>
            medicine.schedule.category === ScheduleCategory.TakeAsNeeded ? (
              <AsNeededCard
                key={index}
                date={selectedTransaction.id}
                medicine={medicine as MedicineTransactionAsNeeded}
                transaction={selectedTransaction}
              />
            ) : (
              <ScheduledCard
                key={index}
                date={selectedTransaction.id}
                medicine={medicine as MedicineTransactionWithSchedule}
                transaction={selectedTransaction}
              />
            ),
          )
        ) : (
          <EmptyHistory />
        )}
      </section>
    </main>
  );
}

function EmptyHistory() {
  return (
    <article className="flex flex-col items-center justify-center gap-2 pb-48 text-neutral-400">
      <div className="mt-20 w-fit rounded-full bg-neutral-800 p-4">
        <CalendarCheck2 className="text-white" />
      </div>
      <h2 className="text-2xl font-medium text-neutral-200">
        No medication today
      </h2>
      <p>You have no medications scheduled for today.</p>
    </article>
  );
}
