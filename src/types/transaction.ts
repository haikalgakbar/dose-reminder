import {
  AsNeededSchedule,
  DailySchedule,
  DayOfWeek,
  Dosage,
  DosageForm,
  DosageQty,
  Schedule,
  ScheduleCategory,
  SpecificDaysSchedule,
} from "@/types/medicine";

export type TTransactionRecord = {
  id: string; // ISO 8601 date string
  totalMedications: number; // Total number of medications for the day
  medicationsToBeConsumed: number; // Total medications that need to be consumed this day
  consumedMedications: number; // Number of medications consumed
  asNeededMedications: number; // Number of as-needed medications
  skippedMedications: number; // Number of medications skipped
  medications: MedicineTransaction[];
};

export type MedicineTransaction = {
  id: string; // Randomly generated ID
  medicineId: string; // Reference to Medicine.id
  name: string; // Name of the medicine
  instruction: string; // Instructions for the medicine
  dosage: Dosage; // Dosage details from the Medicine type
  schedule: Schedule; // Schedule details from the Medicine type
  timeToConsume: string | null; // Time to consume the medicine, if applicable
  consumedAt: string[]; // Array of times the medicine was consumed
  isSkip: boolean; // Whether the medication was skipped
};

export type ScheduledMedicine =
  | { category: ScheduleCategory.DailyIntake; details: DailySchedule }
  | {
      category: ScheduleCategory.SpecificDays;
      details: SpecificDaysSchedule;
    };

export type AsNeededMedicine = {
  category: ScheduleCategory.TakeAsNeeded;
  details: AsNeededSchedule;
};

export type MedicineTransactionWithSchedule = Omit<
  MedicineTransaction,
  "schedule"
> & {
  schedule: ScheduledMedicine;
};

export type MedicineTransactionAsNeeded = Omit<
  MedicineTransaction,
  "schedule"
> & {
  schedule: AsNeededMedicine;
};

export const exampleTransaction: TTransactionRecord[] = [
  {
    id: "2024-10-11T00:00:00Z",
    totalMedications: 3,
    medicationsToBeConsumed: 0,
    consumedMedications: 2,
    asNeededMedications: 1,
    skippedMedications: 1,
    medications: [
      {
        id: "1",
        medicineId: "1",
        name: "Ibuprofen",
        instruction:
          "Take as nee    ded for pain. Do not exceed 6 doses per day.",
        dosage: { qty: DosageQty.Eight, form: DosageForm.Capsules },
        schedule: {
          category: ScheduleCategory.TakeAsNeeded,
          details: { minTimeBetweenDoses: "04:00" },
        },
        timeToConsume: null,
        consumedAt: [],
        isSkip: false,
      },
      {
        id: "2",
        medicineId: "2",
        name: "Vitamin D3",
        instruction: "Take daily in the morning after breakfast.",
        dosage: { qty: DosageQty.Eight, form: DosageForm.Capsules },
        schedule: {
          category: ScheduleCategory.DailyIntake,
          details: { times: ["06:00", "12:00", "18:00"] },
        },
        timeToConsume: "06:00",
        consumedAt: [],
        isSkip: true,
      },
      {
        id: "3",
        medicineId: "3",
        name: "Methotrexate",
        instruction:
          "Take once a week. Avoid alcohol on the day of and after taking.",
        dosage: { qty: DosageQty.One, form: DosageForm.Capsules },
        schedule: {
          category: ScheduleCategory.SpecificDays,
          details: { days: [DayOfWeek.Mon, DayOfWeek.Tue], times: ["21:00"] },
        },
        timeToConsume: "21:00",
        consumedAt: [],
        isSkip: false,
      },
      {
        id: "4",
        medicineId: "2",
        name: "Vitamin D3",
        instruction: "Take daily in the morning after breakfast.",
        dosage: { qty: DosageQty.Three, form: DosageForm.Capsules },
        schedule: {
          category: ScheduleCategory.DailyIntake,
          details: { times: ["06:00", "12:00", "18:00"] },
        },
        timeToConsume: "18:00",
        consumedAt: [],
        isSkip: true,
      },
    ],
  },
];
