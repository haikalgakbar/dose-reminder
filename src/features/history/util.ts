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
  selectedMonth: Date | undefined,
  type: "prev" | "next",
) {
  if (isArrayEmpty(transactions)) return true;

  console.log(
    new Date(transactions[0].id).getMonth(),
    selectedMonth?.getMonth(),
  );

  if (type === "prev") {
    console.log(
      "prev",
      new Date(transactions[0].id).getMonth() === selectedMonth?.getMonth(),
    );

    return (
      new Date(transactions[0].id).getMonth() === selectedMonth?.getMonth()
    );
  } else {
    console.log(
      "next",
      new Date(getCurrentDate()).getMonth() === selectedMonth?.getMonth(),
    );

    return new Date(getCurrentDate()).getMonth() === selectedMonth?.getMonth();
  }
}

export function handleMonthNavigation(
  setSelectedMonth: Dispatch<SetStateAction<Date | undefined>>,
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
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>,
  setSelectedMonth: Dispatch<SetStateAction<Date | undefined>>,
) {
  setSelectedDate(new Date(getCurrentDate()));
  setSelectedMonth(new Date(getCurrentDate()));
}

// export function handle
