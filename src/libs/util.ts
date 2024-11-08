import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  startOfISOWeek,
  endOfISOWeek,
  eachDayOfInterval,
  format,
} from "date-fns";
import { DayOfWeek, MedicationStatus, TMedicine } from "@/types/medicine";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { getDatas, saveToDB, updateData } from "./db";
import { DB_NAME, MEDICINE_STORE, TRANSACTION_STORE } from "@/constant/db";
import { LAST_LOGIN } from "@/constant/localstorage";
import { nanoid } from "nanoid";
import { ScheduleCategory } from "@/types/medicine";

export const DAYS_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentDate() {
  const time = new Date();
  time.setHours(0, 0, 0, 0);

  return time.toISOString();
}

export function getDaysOfInterval(start: string, end: string) {
  return eachDayOfInterval({
    start,
    end,
  });
}

export function isArrayEmpty(arr: unknown[]): boolean {
  return arr.every((item) => {
    if (typeof item === "object" && item !== null) {
      return Object.keys(item).length === 0;
    }
    return false;
  });
}

export function capitalize(str: string) {
  return str.slice(0, 1).toLocaleUpperCase() + str.slice(1);
}

export function getDaysInCurrentWeek(start: Date, end: Date) {
  return eachDayOfInterval({
    start: startOfISOWeek(start),
    end: endOfISOWeek(end),
  });
}

export function saveToLocalStorage<T>(key: string, item: T) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemFromLocalStorage(key: string): string {
  return JSON.parse(localStorage.getItem(key) ?? "");
}

export function sortDays(arr: string[]) {
  return arr.sort((a, b) => {
    const aIndex = DAYS_ORDER.indexOf(a.toLowerCase());
    const bIndex = DAYS_ORDER.indexOf(b.toLowerCase());
    return aIndex - bIndex;
  });
}

export function getMedicineBasedOnTimeToConsume(
  date: string,
  medicine: TMedicine,
  type: "new" | "daily",
): MedicineTransaction[] {
  const { schedule } = medicine;
  const isToday = date === getCurrentDate();
  const currentDay = new Date(getCurrentDate())
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLocaleLowerCase();
  const isFuture = date > getCurrentDate();

  const createTransaction = (
    timeToConsume: string | null,
  ): MedicineTransaction => ({
    id: nanoid(8),
    medicineId: medicine.id,
    name: medicine.name,
    instruction: medicine.instruction,
    dosage: medicine.dosage,
    schedule: medicine.schedule,
    timeToConsume,
    consumedAt:
      isToday || isFuture
        ? []
        : type === "new"
          ? [timeToConsume as string]
          : [],
    isSkip: isToday || isFuture ? false : type !== "new",
  });

  switch (schedule.category) {
    case "takeAsNeeded":
      return [createTransaction(null)];
    case "dailyIntake":
      return schedule.details.times.map(createTransaction);
    case "specificDays":
      if (schedule.details.days.includes(currentDay as DayOfWeek)) {
        return schedule.details.times.map(createTransaction);
      }
      return [];
    default:
      return [];
  }
}

export function processTransaction(
  id: string,
  medications: MedicineTransaction[],
): TTransactionRecord {
  // const { medications } = transaction[0];
  const totalMedications = medications.length;
  let medicationsToBeConsumed = 0;
  let consumedMedications = 0;
  let asNeededMedications = 0;
  let skippedMedications = 0;

  medications.forEach((med) => {
    const isTakeAsNeeded = med.schedule.category === "takeAsNeeded";
    const isConsumed = !isArrayEmpty(med.consumedAt);

    if (!isTakeAsNeeded) {
      medicationsToBeConsumed++;
      if (isConsumed) {
        consumedMedications++;
      }
    } else {
      asNeededMedications++;
    }

    if (med.isSkip) {
      skippedMedications++;
    }
  });

  return {
    id: id,
    totalMedications,
    medicationsToBeConsumed,
    consumedMedications,
    asNeededMedications,
    skippedMedications,
    medications,
  };
}

export function changeMedicineStatus(
  medicine: TMedicine,
  changeTo: MedicationStatus,
) {
  updateData(DB_NAME, MEDICINE_STORE, { status: changeTo }, medicine.id);
}

export function isMedicineValid(medicine: TMedicine, date: string): boolean {
  const endDate = medicine.duration?.endDate;

  if (!endDate) {
    return true;
  }

  if (medicine.status === "inactive") {
    return false;
  }

  if (date >= endDate) {
    changeMedicineStatus(medicine, "inactive");
    return false;
  }

  return true;
}

export async function createDailyTransaction() {
  const dates = eachDayOfInterval({
    start: getItemFromLocalStorage(LAST_LOGIN),
    end: getCurrentDate(),
  });

  let previousDate: string | undefined;

  for (const date of dates) {
    if (previousDate) {
      await updatePreviousTransaction(previousDate);
    }

    const medications = await getDatas<TMedicine>(DB_NAME, MEDICINE_STORE);
    for (const medication of medications) {
      if (isMedicineValid(medication, date.toISOString())) {
        await processMedicationsForDate(date, medication);
      }
    }

    previousDate = date.toISOString();
    saveToLocalStorage(LAST_LOGIN, getCurrentDate());
  }
}

// export async function createDailyTransaction() {
//   const dates = eachDayOfInterval({
//     start: getItemFromLocalStorage(LAST_LOGIN),
//     end: getCurrentDate(),
//   });

//   let previousDate: string | undefined;

//   for (const date of dates) {
//     if (previousDate) {
//       await updatePreviousTransaction(previousDate);
//     }

//     const medications = await getDatas<TMedicine>(DB_NAME, MEDICINE_STORE);
//     for (const medication of medications) {
//       if (isMedicineValid(medication, date.toISOString())) {
//         await processMedicationsForDate(date, medication);
//       }
//     }

//     previousDate = date.toISOString();
//     saveToLocalStorage(LAST_LOGIN, getCurrentDate());
//   }
// }

async function updatePreviousTransaction(previousDate: string) {
  const trx = await getDatas<TTransactionRecord>(DB_NAME, TRANSACTION_STORE);
  const prevTrx = trx.filter((item) => item.id === previousDate);

  if (prevTrx.length > 0) {
    const updatedTransaction = prevTrx.map((trx) => {
      const medications = trx.medications.map((med) => {
        if (
          med.schedule.category !== ScheduleCategory.TakeAsNeeded &&
          isArrayEmpty(med.consumedAt)
        ) {
          return {
            ...med,
            isSkip: true,
          };
        }
        return med;
      });
      return {
        ...trx,
        medications,
      };
    });

    const newTransaction = processTransaction(
      updatedTransaction[0].id,
      updatedTransaction[0].medications,
    );
    updateData(DB_NAME, TRANSACTION_STORE, newTransaction);
  }
}

async function processMedicationsForDate(date: Date, medication: TMedicine) {
  const trx = await getDatas<TTransactionRecord>(DB_NAME, TRANSACTION_STORE);
  const todayTrx = trx.filter((item) => item.id === date.toISOString());

  if (isArrayEmpty(todayTrx)) {
    await createNewTransaction(date, medication);
  } else {
    await updateExistingTransaction(todayTrx[0], date, medication);
  }
}

async function createNewTransaction(date: Date, medication: TMedicine) {
  const medications = getMedicineBasedOnTimeToConsume(
    date.toISOString(),
    medication,
    "daily",
  );
  const newTransaction = processTransaction(date.toISOString(), medications);
  saveToDB(DB_NAME, TRANSACTION_STORE, newTransaction);
}

export async function updateExistingTransaction(
  existingTransaction: TTransactionRecord,
  date: Date,
  medication: TMedicine,
) {
  const { medications } = existingTransaction;
  const duplicateMed = medications.find(
    (med) => med.medicineId === medication.id,
  );

  if (!duplicateMed) {
    const extractedMeds = getMedicineBasedOnTimeToConsume(
      date.toISOString(),
      medication,
      "daily",
    );
    medications.push(...extractedMeds);
    const processedTransaction = processTransaction(
      existingTransaction.id,
      medications,
    );
    updateData(DB_NAME, TRANSACTION_STORE, processedTransaction);
  }
}

export type MedicineWithTime = Omit<MedicineTransaction, "schedule"> & {
  schedule: {
    category: "dailyIntake" | "specificDays";
    details: {
      times: string[];
    };
  };
};

export function sortMeds(meds: MedicineTransaction[]) {
  const filter = meds.filter(
    (med) => med.schedule.category !== "takeAsNeeded",
  ) as MedicineWithTime[];

  return filter.sort((a, b) => {
    const timeA = a.schedule.details.times[0];
    const timeB = b.schedule.details.times[0];
    return timeA.localeCompare(timeB);
  });
}

function getTakeNowMeds(medicine: MedicineWithTime[]): MedicineWithTime[] {
  const currentTime = format(new Date(), "kk:mm");

  return medicine.filter((med) => (med.timeToConsume as string) <= currentTime);
}

export function getUpcomingMeds(
  medicine: MedicineWithTime[],
): MedicineWithTime[] {
  // Get the next scheduled time
  const nextMed = getNextMeds(medicine);

  if (!nextMed) return [];

  const nextTime = nextMed.timeToConsume;

  // Find all medicines that match the next scheduled time
  return medicine.filter((med) => med.timeToConsume === nextTime);
}

function getNextMeds(medicine: MedicineWithTime[]) {
  const currentTime = format(new Date(), "kk:mm");

  // Get the next scheduled time
  return medicine.find((med) => (med.timeToConsume as string) > currentTime);
}

export function getTakeLaterMeds(
  medicine: MedicineWithTime[],
): MedicineWithTime[] {
  // Get the next scheduled time
  const nextMed = getNextMeds(medicine);

  if (!nextMed) return [];

  const nextTime = nextMed.schedule.details.times[0];

  // Get all medicines that come after the next scheduled time
  return medicine.filter((med) => med.schedule.details.times[0] > nextTime);
}

function categorizeMedsByTime(medications: MedicineTransaction[]) {
  const sortedMeds = sortMeds(medications);
  const takeNow = getTakeNowMeds(sortedMeds);
  const comingUp = getUpcomingMeds(sortedMeds);
  const takeLater = getTakeLaterMeds(sortedMeds);

  return {
    takeNow,
    comingUp,
    takeLater,
  };
}

export function processMedicines(medicines: MedicineTransaction[]) {
  const sortedCategorizedMeds = categorizeMedsByTime(medicines);
  // const sortedCategorizedMeds = categorizeMedsByTime(medicines[0].medications);

  return {
    takeNow: sortedCategorizedMeds.takeNow as MedicineTransaction[],
    comingUp: sortedCategorizedMeds.comingUp as MedicineTransaction[],
    takeLater: sortedCategorizedMeds.takeLater as MedicineTransaction[],
    takeAsNeeded: medicines.filter(
      (med) => med.schedule.category === "takeAsNeeded",
    ),
  };
}
