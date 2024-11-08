import { MedicineTransaction } from "@/types/transaction";
import { isArrayEmpty } from "@/libs/util";

export default function MedicineCardTriggerHome({
  medicine,
}: {
  medicine: MedicineTransaction;
}) {
  const { schedule, name, instruction, dosage, consumedAt } = medicine;

  return (
    <>
      <h2 className="w-full text-lg font-medium">{name}</h2>
      <p className="line-clamp-2 w-full">{instruction}</p>
      {schedule.category === "takeAsNeeded" ? (
        <>
          <span className="flex w-full items-center gap-1 text-[#7D7A78]">
            {schedule.details.minTimeBetweenDoses ? (
              <p>Every {schedule.details.minTimeBetweenDoses} hour(s)</p>
            ) : (
              <p>As needed</p>
            )}
            · {dosage.qty} {dosage.form}
          </span>
          {!isArrayEmpty(consumedAt) && (
            <>
              <div className="my-1 h-[1px] w-full bg-[#E3CBBC]/20"></div>
              <p className="w-full text-left text-[#7D7A78]">
                Taken {consumedAt.length} time(s)
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <span className="flex w-full items-center gap-1 text-[#7D7A78]">
            {medicine.timeToConsume} · {dosage.qty} {dosage.form}
          </span>
        </>
      )}
    </>
  );
}

// export default function MedicineCardTriggerHome({
//   medicine,
// }: {
//   medicine: MedicineTransaction;
// }) {
//   const { schedule, name, instruction, dosage, consumedAt } = medicine;

//   return (
//     <Button
//       variant="ghost"
//       className="flex h-fit w-full cursor-pointer flex-col gap-1 whitespace-pre-line rounded-xl border-b-2 border-[#BBA5A0]/20 bg-white p-4 text-left text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
//     >
//       <h2 className="w-full text-lg font-medium">{name}</h2>
//       <p className="line-clamp-2 w-full">{instruction}</p>
//       {schedule.category === "takeAsNeeded" ? (
//         <>
//           <span className="flex w-full items-center gap-1 text-[#7D7A78]">
//             {schedule.details.minTimeBetweenDoses ? (
//               <p>Every {schedule.details.minTimeBetweenDoses} hour(s)</p>
//             ) : (
//               <p>As needed</p>
//             )}
//             · {dosage.qty} {dosage.form}
//           </span>
//           {!isArrayEmpty(consumedAt) && (
//             <>
//               <div className="my-1 h-[1px] w-full bg-[#E3CBBC]/20"></div>
//               <p className="w-full text-left text-[#7D7A78]">
//                 Taken {consumedAt.length} time(s)
//               </p>
//             </>
//           )}
//         </>
//       ) : (
//         <>
//           <span className="flex w-full items-center gap-1 text-[#7D7A78]">
//             {medicine.timeToConsume} · {dosage.qty} {dosage.form}
//           </span>
//         </>
//       )}
//     </Button>
//   );
// }
