import { useMemo } from "react";
import { getCurrentDate, getDaysOfInterval } from "@/libs/util";
import {
  endOfISOWeek,
  format,
  isSameDay,
  parseISO,
  startOfISOWeek,
} from "date-fns";
import { Check, X } from "lucide-react";
import { TTransactionRecord } from "@/types/transaction";

interface CalendarItemProps {
  date: string;
  transaction?: TTransactionRecord;
  type: "past" | "today" | "future";
}

interface CalendarStatusProps {
  type: "check" | "uncheck" | "pre" | "empty";
}

const CheckIcon = () => (
  <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
    <Check size={16} className="text-[#262626]" />
  </span>
);

const XIcon = () => (
  <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
    <X size={16} className="text-[#262626]" />
  </span>
);

const PreIcon = () => (
  <span className="my-1 h-6 w-6 rounded-full border border-dashed border-[#f5f5f5]" />
);

const EmptyIcon = () => (
  <span className="my-1 h-6 w-6 rounded-full border border-neutral-700" />
);

const FutureIcon = () => (
  <span className="my-1 h-6 w-6 rounded-full bg-neutral-800" />
);

const CalendarStatus = ({ type }: CalendarStatusProps) => {
  const statusMap = {
    check: CheckIcon,
    uncheck: XIcon,
    pre: PreIcon,
    empty: EmptyIcon,
  };

  const StatusComponent = statusMap[type];
  return StatusComponent ? <StatusComponent /> : null;
};

const CalendarItem = ({ date, transaction, type }: CalendarItemProps) => {
  const getCalendarType = (transaction?: TTransactionRecord) => {
    if (!transaction) return "empty";
    if (transaction.consumedMedications === transaction.medicationsToBeConsumed)
      return "check";
    if (transaction.skippedMedications > 0) return "uncheck";
    if (transaction.totalMedications === 0) return "empty";
    if (transaction.totalMedications > 0) return "pre";
    return "empty";
  };

  return (
    <div
      className={`flex flex-1 flex-col items-center rounded-2xl p-2 ${
        type === "today" ? "bg-neutral-800" : ""
      }`}
    >
      <p className="text-sm text-[#D4D4D4]">{format(date, "EEEEEE")}</p>
      <p className="text-xl font-medium text-[#F5F5F5]">{format(date, "dd")}</p>
      {type === "future" ? (
        <FutureIcon />
      ) : (
        <CalendarStatus type={getCalendarType(transaction)} />
      )}
    </div>
  );
};

export default function Header({
  transactions,
}: {
  transactions: TTransactionRecord[];
}) {
  const { currentMonth, currentWeek, matchedTransactions, currentDate } =
    useMemo(() => {
      const currentDate = getCurrentDate();
      const week = getDaysOfInterval(
        startOfISOWeek(currentDate).toISOString(),
        endOfISOWeek(currentDate).toISOString(),
      );

      // Match transactions with their corresponding dates
      const matchedTransactions = week.map((weekDay) => {
        return transactions.find((transaction) =>
          isSameDay(parseISO(transaction.id), weekDay),
        );
      });

      return {
        currentMonth: format(currentDate, "MMM, yyyy").split(","),
        currentWeek: week,
        matchedTransactions,
        currentDate,
      };
    }, [transactions]);

  // console.log("render header");

  return (
    <header className="flex select-none flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-[#F5F5F5]">Daily check</h2>
        <span className="text-[#D4D4D4]">{currentMonth}</span>
      </div>
      <div className="flex gap-2">
        {currentWeek.map((week, index) => (
          <CalendarItem
            key={week.toISOString()}
            date={week.toISOString()}
            transaction={matchedTransactions[index]}
            type={
              week.toISOString() < currentDate
                ? "past"
                : week.toISOString() === currentDate
                  ? "today"
                  : "future"
            }
          />
        ))}
      </div>
    </header>
  );
}
