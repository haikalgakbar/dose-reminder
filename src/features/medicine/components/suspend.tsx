import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import { updateData } from "@/libs/db";
import { MedicationStatus, TMedicine } from "@/types/medicine";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock3, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

function handler(
  medicine: TMedicine,
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>,
) {
  const updatedMedicine =
    medicine.status === "active"
      ? {
          ...medicine,
          status: "inactive" as MedicationStatus,
        }
      : {
          ...medicine,
          status: "active" as MedicationStatus,
          duration: {
            ...medicine.duration,
            endDate: undefined,
          },
        };

  updateData(DB_NAME, MEDICINE_STORE, updatedMedicine, medicine.id);
  setMedicine(updatedMedicine);
}

export default function SuspendMedicine({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
          {medicine.status === "active" ? (
            <>
              <Clock3 className="h-5 w-5 shrink-0" />
              <h3>Suspend</h3>
            </>
          ) : (
            <>
              <CirclePlus className="h-5 w-5 shrink-0" />
              <h3>Resume</h3>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-96 rounded-xl border-0 bg-neutral-800 text-neutral-200 focus:outline-none focus:ring-0">
        <DialogHeader>
          <DialogTitle>
            {medicine.status === "active"
              ? "Suspend medicine?"
              : "Resume medicine?"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {medicine.status === "active"
              ? "The medicine will remain available, but the reminder will beremoved."
              : "The existing end date will be cleared, but you can set it again later."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                onClick={() => handler(medicine, setMedicine)}
                className="bg-neutral-200 text-neutral-800 hover:bg-neutral-400"
              >
                {medicine.status === "active" ? "Suspend" : "Resume"}
              </Button>
              <Button
                type="reset"
                variant="ghost"
                className="hover:bg-transparent hover:text-neutral-400"
              >
                Cancel
              </Button>
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
