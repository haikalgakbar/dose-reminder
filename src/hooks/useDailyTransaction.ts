import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";
import { getDatas } from "@/libs/db";
import { getCurrentDate } from "@/libs/util";
import { TTransactionRecord } from "@/types/transaction";
import { useState, useEffect } from "react";

export default function useDailyTransactions() {
  const [dailyTransaction, setDailyTransaction] = useState<
    TTransactionRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getDailyTransaction() {
      setIsLoading(true);
      const trx: TTransactionRecord[] = await getDatas<TTransactionRecord>(
        DB_NAME,
        TRANSACTION_STORE,
      );

      const todayTrx = trx.filter((data) => data.id === getCurrentDate());

      setDailyTransaction(todayTrx);
      setIsLoading(false);
    }

    getDailyTransaction();
  }, []);

  return {
    dailyTransaction,
    isLoading,
  };
}
