import { DB_NAME, MEDICINE_STORE, TRANSACTION_STORE } from "@/constant/db";
import { TMedicine } from "@/types/medicine";
import { getDatas, saveToDB, updateData } from "@/libs/db";
import { eachDayOfInterval, format } from "date-fns";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import {
  getCurrentDate,
  getMedicineBasedOnTimeToConsume,
  isArrayEmpty,
  processTransaction,
} from "@/libs/util";

export async function addMedicine(medicine: TMedicine) {
  // Save to medicine DB
  saveToDB(DB_NAME, MEDICINE_STORE, medicine);

  // Generate dates within the interval
  const dates = eachDayOfInterval({
    start: medicine.duration.startDate,
    end: getCurrentDate(),
    // end: "2024-10-12T05:19:30.000Z",
  });

  // Process each date
  for (const date of dates) {
    const dateString = date.toISOString();

    // Get transaction data for the date
    const data = await getDatas<TTransactionRecord>(DB_NAME, TRANSACTION_STORE);
    const savedData = data.filter((val) => val.id === dateString);

    if (isArrayEmpty(savedData)) {
      // No transaction for this date
      const medications = getMedicineBasedOnTimeToConsume(
        date.toISOString(),
        medicine,
        "new",
      );
      const newTransaction = processTransaction(dateString, medications);

      // Create new transaction with medicine data
      saveToDB(DB_NAME, TRANSACTION_STORE, newTransaction);
    } else {
      // Transaction exists for this date
      const existingTransaction = savedData[0];
      const { medications } = existingTransaction;
      const duplicateMed = medications.find(
        (med) => med.medicineId === medicine.id,
      );

      if (!duplicateMed) {
        // Add new medication if not a duplicate
        const extractedMeds = getMedicineBasedOnTimeToConsume(
          date.toISOString(),
          medicine,
          "new",
        );
        medications.push(...extractedMeds);

        const processedTransaction = processTransaction(
          existingTransaction.id,
          medications,
        );
        updateData(DB_NAME, TRANSACTION_STORE, processedTransaction);
      }
    }
  }
}

export default function handleTakeMedicine(
  medication: MedicineTransaction,
  transaction: TTransactionRecord,
) {
  const updatedTransaction = {
    ...transaction,
    medications: transaction.medications.map((med) => {
      if (med.medicineId === medication.medicineId) {
        return {
          ...med,
          consumedAt: [...med.consumedAt, format(new Date(), "HH:mm")],
        };
      }
      return med;
    }),
  };

  const newTransaction = processTransaction(
    updatedTransaction.id,
    updatedTransaction.medications,
  );

  updateData(DB_NAME, TRANSACTION_STORE, newTransaction);
}
