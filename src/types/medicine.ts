export enum DayOfWeek {
  Mon = "mon",
  Tue = "tue",
  Wed = "wed",
  Thu = "thu",
  Fri = "fri",
  Sat = "sat",
  Sun = "sun",
}

export enum DosageForm {
  Capsules = "capsules",
  Tablets = "tablets",
  Pills = "pills",
  Injection = "injection",
  Vial = "vial",
  Ampul = "ampul",
  Puff = "puff",
  Inhaler = "inhaler",
  Suppository = "suppository",
  Patch = "patch",
  Ointment = "ointment",
  Tablespoon = "tablespoon",
  Teaspoon = "teaspoon",
  Cream = "cream",
  Gel = "gel",
  Powder = "powder",
  Lozenge = "lozenge",
  Spray = "spray",
  Foam = "foam",
  Emulsion = "emulsion",
  Paste = "paste",
}

export enum DosageQty {
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
}

export enum ScheduleCategory {
  DailyIntake = "dailyIntake",
  SpecificDays = "specificDays",
  TakeAsNeeded = "takeAsNeeded",
}

export type MedicationStatus = "active" | "inactive";

export type AsNeededSchedule = {
  minTimeBetweenDoses: string | null; // in hours
};

export type DailySchedule = {
  times: string[];
};

export type SpecificDaysSchedule = {
  days: DayOfWeek[];
  times: string[];
};

export type Schedule =
  | { category: ScheduleCategory.TakeAsNeeded; details: AsNeededSchedule }
  | { category: ScheduleCategory.DailyIntake; details: DailySchedule }
  | {
      category: ScheduleCategory.SpecificDays;
      details: SpecificDaysSchedule;
    };

export type Dosage = {
  qty: DosageQty;
  form: DosageForm;
};

export type Duration = {
  startDate: string; // ISO 8601 date string
  endDate?: string;
};

export type TMedicine = {
  id: string;
  name: string;
  instruction: string;
  status: MedicationStatus;
  dosage: Dosage;
  schedule: Schedule;
  duration: Duration;
};

export type MedicineContextType = {
  medicine: Omit<TMedicine, "status" | "id">;
  updateMedicine: (update: Partial<Omit<TMedicine, "status" | "id">>) => void;
};

export const exampleMedicines: TMedicine[] = [
  {
    id: "1",
    name: "Ibuprofen",
    instruction: "Take as needed for pain. Do not exceed 6 doses per day.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Spray },
    schedule: {
      category: ScheduleCategory.TakeAsNeeded,
      details: { minTimeBetweenDoses: null },
    },
    duration: { startDate: "2024-10-01T00:00:00Z" },
  },
  {
    id: "2",
    name: "Vitamin D3",
    instruction: "Take daily in the morning after breakfast.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Capsules },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["06:00", "12:00", "18:00"] },
    },
    duration: {
      startDate: "2024-09-15T00:00:00Z",
      endDate: "2025-09-15T00:00:00Z",
    },
  },
  {
    id: "3",
    name: "Metformin",
    instruction: "Take twice daily with meals for blood sugar control.",
    status: "inactive",
    dosage: { qty: DosageQty.Two, form: DosageForm.Cream },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["08:00", "20:00"] },
    },
    duration: { startDate: "2024-01-01T00:00:00Z" },
  },
  {
    id: "4",
    name: "Albuterol Inhaler",
    instruction: "Use as needed for asthma symptoms.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Inhaler },
    schedule: {
      category: ScheduleCategory.TakeAsNeeded,
      details: { minTimeBetweenDoses: "03:00" },
    },
    duration: { startDate: "2024-06-01T00:00:00Z" },
  },
  {
    id: "5",
    name: "Amoxicillin",
    instruction:
      "Take every 8 hours for bacterial infection. Complete the full course.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Powder },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["08:00", "20:00"] },
    },
    duration: {
      startDate: "2024-10-01T00:00:00Z",
      endDate: "2024-10-10T00:00:00Z",
    },
  },
  {
    id: "6",
    name: "Fluoxetine",
    instruction: "Take daily in the morning.",
    status: "inactive",
    dosage: { qty: DosageQty.Two, form: DosageForm.Paste },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["08:00"] },
    },
    duration: {
      startDate: "2024-04-01T00:00:00Z",
      endDate: "2024-09-30T00:00:00Z",
    },
  },
  {
    id: "7",
    name: "Insulin",
    instruction: "Inject as directed based on blood sugar levels.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Injection },
    schedule: {
      category: ScheduleCategory.TakeAsNeeded,
      details: { minTimeBetweenDoses: "06:00" },
    },
    duration: { startDate: "2024-02-01T00:00:00Z" },
  },
  {
    id: "8",
    name: "Methotrexate",
    instruction:
      "Take once a week. Avoid alcohol on the day of and after taking.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Gel },
    schedule: {
      category: ScheduleCategory.SpecificDays,
      details: { days: [DayOfWeek.Mon, DayOfWeek.Thu], times: ["21:00"] },
    },
    duration: { startDate: "2024-03-01T00:00:00Z" },
  },
  {
    id: "9",
    name: "Prednisone",
    instruction: "Take for 5 days as directed.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Lozenge },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["09:00"] },
    },
    duration: {
      startDate: "2024-10-03T00:00:00Z",
      endDate: "2024-10-08T00:00:00Z",
    },
  },
  {
    id: "10",
    name: "Clarithromycin",
    instruction: "Take every 12 hours for 7 days.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Pills },
    schedule: {
      category: ScheduleCategory.DailyIntake,
      details: { times: ["07:00", "19:00"] },
    },
    duration: {
      startDate: "2024-10-05T00:00:00Z",
      endDate: "2024-10-12T00:00:00Z",
    },
  },
  {
    id: "11",
    name: "Example 1",
    instruction:
      "Take once a week. Avoid alcohol on the day of and after taking.",
    status: "active",
    dosage: { qty: DosageQty.Two, form: DosageForm.Tablets },
    schedule: {
      category: ScheduleCategory.SpecificDays,
      details: {
        days: [
          DayOfWeek.Mon,
          DayOfWeek.Tue,
          DayOfWeek.Wed,
          DayOfWeek.Thu,
          DayOfWeek.Fri,
          DayOfWeek.Sat,
          DayOfWeek.Sun,
        ],
        times: ["06:00", "12:00", "18:00"],
      },
    },
    duration: {
      startDate: "2024-04-01T00:00:00Z",
      // endDate: "2024-10-01T00:00:00Z",
    },
  },
];
