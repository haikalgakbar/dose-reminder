import { Calendar } from "@/components/ui/calendar";
import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";
import { getDatas } from "@/libs/db";
import { getCurrentDate, isArrayEmpty } from "@/libs/util";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { createLazyFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ScheduleCategory } from "@/types/medicine";
import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const today = getCurrentDate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(today),
  );
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
    new Date(today),
  );

  const [selectedTransaction, setSelectedTransaction] = useState<
    TTransactionRecord[]
  >([]);
  // const [loading, setLoading] = useState(true);

  const handleTodayClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    setSelectedDate(today);
    setCurrentMonth(today);
  };

  function handleSelectDate(date: Date) {
    if (!date || (date && date !== date)) {
      setSelectedDate(date);
    }
  }

  // useEffect(() => {
  //   // let isMounted = true;
  //   async function getTransaction() {
  //     setLoading(true);
  //     const trx: TTransactionRecord[] = await getDatas<TTransactionRecord>(
  //       DB_NAME,
  //       TRANSACTION_STORE,
  //     );
  //     const formatDate = date?.toISOString();
  //     setSelectedTransaction(trx.filter((data) => data.id === formatDate));
  //     setLoading(false);
  //   }
  //   getTransaction();

  //   return () => {
  //     // isMounted = false;
  //   };
  // }, [date]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  console.log(currentMonth?.toISOString(), today);

  return (
    <>
      <section className="space-y-4 p-4 pb-2 text-neutral-200">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (!selectedDate || (date && date !== selectedDate)) {
              setSelectedDate(date);
            }
          }}
          month={currentMonth}
          className="rounded-md p-0"
          classNames={{
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
                    className={`h-fit rounded-lg px-4 py-2 text-base font-normal text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200 ${selectedDate?.toISOString() === today && currentMonth?.toISOString() === today && "hidden"}`}
                    onClick={handleTodayClick}
                  >
                    Today
                  </Button>
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg p-2 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200"
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev!.getFullYear(), prev!.getMonth() - 1),
                        )
                      }
                    >
                      <ChevronLeft className="h-4 w-4 shrink-0" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg p-2 text-neutral-200 hover:bg-neutral-800 hover:text-neutral-200"
                      onClick={() =>
                        setCurrentMonth(
                          (prev) =>
                            new Date(prev!.getFullYear(), prev!.getMonth() + 1),
                        )
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ),
            DayContent: ({ date }) => (
              <div className="flex flex-col items-center">
                {date.getDate()}
                {date <= new Date(today) && (
                  <div className="absolute bottom-4 h-1 w-1 rounded-full bg-[#FFD2A7]"></div>
                )}
              </div>
            ),
          }}
        />
      </section>
      {/* <section className="flex flex-col gap-2 p-4 pt-2 text-[#33302E]">
        <header>
          <h2 className="font-medium text-[#33302E]">
            {date?.getDate() === new Date(today).getDate()
              ? `Today, ${format(new Date(getCurrentDate()), "dd MMM yyyy")}`
              : format(date || "", "EEEE, dd MMM yyyy")}
          </h2>
        </header>
        {selectedTransaction[0].medications.map((medication) => (
          <HistoryCard key={medication.id} medication={medication} />
        ))}
      </section> */}
    </>
  );
}

function HistoryCard({ medication }: { medication: MedicineTransaction }) {
  const renderSchedule = () => {
    if (medication.schedule.category === ScheduleCategory.TakeAsNeeded) {
      return (
        <span className="text-[#7D7A78]">
          {medication.schedule.details.minTimeBetweenDoses
            ? "As needed"
            : `Every ${medication.schedule.details.minTimeBetweenDoses} hour(s)`}{" "}
          · {medication.dosage.qty} {medication.dosage.form}
        </span>
      );
    } else {
      return (
        <span className="text-[#7D7A78]">
          {medication.timeToConsume} · {medication.dosage.qty}{" "}
          {medication.dosage.form}
        </span>
      );
    }
  };

  const renderStatusIcon = () => {
    if (medication.isSkip) {
      return <X size={20} className="text-[#E3B5FA]" />;
    } else if (isArrayEmpty(medication.consumedAt)) {
      return null;
    } else {
      return <Check size={20} className="text-[#F96C00]/70" />;
    }
  };

  return (
    <div className="rounded-xl border-b-2 border-[#BBA5A0]/20 bg-white/70 p-4">
      <div className="flex items-center gap-2">
        <div className="w-full">
          <h2 className="text-lg font-medium">{medication.name}</h2>
          <p className="line-clamp-2">{medication.instruction}</p>
          {renderSchedule()}
        </div>
        <div
          className={`flex h-fit min-h-10 min-w-10 items-center justify-center rounded-full ${
            medication.isSkip
              ? "border border-[#E3B5FA]"
              : isArrayEmpty(medication.consumedAt)
                ? "border-2 border-dashed border-[#F4EFED]"
                : "bg-[#FEE5CE]"
          }`}
        >
          {renderStatusIcon()}
        </div>
      </div>
      {medication.consumedAt.length > 0 && (
        <div className="mt-2 border-t border-t-[#E3CBBC]/20 text-[#7D7A78]">
          {`Taken ${
            medication.schedule.category === ScheduleCategory.TakeAsNeeded
              ? `${medication.consumedAt.length} time(s)`
              : `${medication.consumedAt}`
          }`}
        </div>
      )}
    </div>
  );
}
