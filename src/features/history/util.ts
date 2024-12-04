import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";
import { getDatas } from "@/libs/db";
import { getCurrentDate, isArrayEmpty } from "@/libs/util";
import { TTransactionRecord } from "@/types/transaction";
import { SetStateAction, Dispatch } from "react";

export async function getTransactions() {
  const trx: TTransactionRecord[] = await getDatas<TTransactionRecord>(
    DB_NAME,
    TRANSACTION_STORE,
  );

  return trx;
}

export function handleDisabled(
  transactions: TTransactionRecord[],
  selectedMonth: Date,
  type: "prev" | "next",
) {
  if (isArrayEmpty(transactions)) return true;

  if (type === "prev") {
    return (
      new Date(transactions[0].id).getMonth() === selectedMonth?.getMonth()
    );
  } else {
    return new Date(getCurrentDate()).getMonth() === selectedMonth?.getMonth();
  }
}

export function handleMonthNavigation(
  setSelectedMonth: Dispatch<SetStateAction<Date>>,
  type: "prev" | "next",
) {
  if (type === "prev") {
    setSelectedMonth(
      (prev) => new Date(prev!.getFullYear(), prev!.getMonth() - 1),
    );
  } else {
    setSelectedMonth(
      (prev) => new Date(prev!.getFullYear(), prev!.getMonth() + 1),
    );
  }
}

export function handleTodayClick(
  setSelectedDate: Dispatch<SetStateAction<Date>>,
  setSelectedMonth: Dispatch<SetStateAction<Date>>,
) {
  setSelectedDate(new Date(getCurrentDate()));
  setSelectedMonth(new Date(getCurrentDate()));
}

export function handleDateSelection(
  date: Date,
  setSelectedDate: Dispatch<SetStateAction<Date>>,
  selectedDate: Date,
) {
  if (!selectedDate || (date && date !== selectedDate)) {
    setSelectedDate(date);
  }
}

export function handleSelectedTransaction(
  date: Date,
  transactions: TTransactionRecord[],
  setTransaction: Dispatch<SetStateAction<TTransactionRecord | undefined>>,
) {
  if (date) {
    const trx = transactions.find((trx) => trx.id === date.toISOString());
    // console.log(date.toISOString(), trx?.id);

    setTransaction(trx);
  }
  return undefined;
}