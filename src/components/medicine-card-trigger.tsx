import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { MedicineTransaction } from "@/types/transaction";
import { isArrayEmpty } from "@/libs/util";

export default function MedicineCardTrigger({
  medicine,
  type,
}: {
  medicine: MedicineTransaction;
  type: "home" | "medicine" | "history";
}) {
  switch (type) {
    case "home":
      return (
        <Button
          variant="ghost"
          className="flex h-fit w-full cursor-pointer flex-col gap-2 whitespace-pre-line rounded-xl border-b-2 border-none border-[#BBA5A0]/20 bg-white p-4 text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
        >
          <div className="flex w-full items-center gap-2 text-start">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-slate-700">
                {medicine.name}
              </h2>
              <p className="line-clamp-2 w-full">{medicine.instruction}</p>
              <div>
                <p className="text-[#7D7A78]">
                  {medicine.schedule.category} · timeToConsume · dosage
                </p>
              </div>
            </div>
            <div className="rounded-full bg-[#FEE5CE]/50 p-2">
              <Check size={18} className="text-[#F96C00]/70" />
            </div>
          </div>
          {medicine.schedule.category === "takeAsNeeded" &&
            !isArrayEmpty(medicine.consumedAt) && (
              <p className="w-full gap-4 border-t border-t-slate-200 pt-2 text-left text-[#7D7A78]">
                Taken {medicine.consumedAt} time(s)
              </p>
            )}
        </Button>
      );
    case "medicine":
      return (
        <Button
          variant="ghost"
          className="flex h-fit w-full cursor-pointer flex-col gap-2 whitespace-pre-line rounded-xl border-b-2 border-none border-[#BBA5A0]/20 bg-white p-4 text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
        >
          <div className="flex w-full items-center gap-2 text-start">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-slate-700">
                {medicine.name}
              </h2>
              <p className="line-clamp-2 w-full">{medicine.instruction}</p>
              <div>
                <p className="text-[#7D7A78]">
                  {medicine.schedule.category} · timeToConsume · dosage
                </p>
              </div>
            </div>
            <div className="rounded-full bg-[#FEE5CE]/50 p-2">
              <Check size={18} className="text-[#F96C00]/70" />
            </div>
          </div>
          <p className="w-full gap-4 border-t border-t-slate-200 pt-2 text-left text-[#7D7A78]">
            Taken time
          </p>
        </Button>
      );
    case "history":
      return (
        <Button
          variant="ghost"
          className="flex h-fit w-full cursor-pointer flex-col gap-2 whitespace-pre-line rounded-xl border-b-2 border-none border-[#BBA5A0]/20 bg-white p-4 text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
        >
          <div className="flex w-full items-center gap-2 text-start">
            <div className="space-y-1">
              <h2 className="text-lg font-medium text-slate-700">
                {medicine.name}
              </h2>
              <p className="line-clamp-2 w-full">{medicine.instruction}</p>
              <div>
                <p className="text-[#7D7A78]">
                  {medicine.schedule.category} · timeToConsume · dosage
                </p>
              </div>
            </div>
            <div className="rounded-full bg-[#FEE5CE]/50 p-2">
              <Check size={18} className="text-[#F96C00]/70" />
            </div>
          </div>
          <p className="w-full gap-4 border-t border-t-slate-200 pt-2 text-left text-[#7D7A78]">
            Taken time
          </p>
        </Button>
      );
    default:
      return <h1>Something wrong</h1>;
  }
}
