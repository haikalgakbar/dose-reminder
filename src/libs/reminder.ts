import { MedicineTransaction } from "@/types/transaction";
import { processMedicines } from "./util";

// export function getDailyReminderMedicines(medications: MedicineTransaction[]) {
//   const { takeNow, takeLater, takeAsNeeded, comingUp } =
//     processMedicines(medications);

//   const filteredTakeNow = takeNow.filter((med) => med.consumedAt.length === 0);
//   const filteredTakeLater = takeLater.filter(
//     (med) => med.consumedAt.length === 0,
//   );
//   const filteredComingUp = comingUp.filter(
//     (med) => med.consumedAt.length === 0,
//   );

//   return {
//     takeNow: filteredTakeNow,
//     takeLater: filteredTakeLater,
//     takeAsNeeded,
//     comingUp: filteredComingUp,
//   };
// }

export function getDailyReminderMedicines(medications: MedicineTransaction[]) {
  const { takeNow, takeLater, takeAsNeeded, comingUp } =
    processMedicines(medications);

  const filterUnconsumed = (medArray: MedicineTransaction[]) =>
    medArray.filter((med) => med.consumedAt.length === 0);

  return {
    takeNow: filterUnconsumed(takeNow),
    takeLater: filterUnconsumed(takeLater),
    takeAsNeeded,
    comingUp: filterUnconsumed(comingUp),
  };
}
