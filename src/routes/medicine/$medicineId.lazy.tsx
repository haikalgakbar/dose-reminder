import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { getData, updateData } from "@/libs/db";
import { TMedicine, MedicationStatus } from "@/types/medicine";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import { useEffect, useState } from "react";
import { CirclePlus, Clock3, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Duration from "@/features/medicine/components/duration";
import Dosage from "@/features/medicine/components/dosage";
import EditMedication from "@/features/medicine/components/edit";
import Frequency from "@/features/medicine/components/frequency";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/medicine/$medicineId")({
  component: MedicineDetail,
});

function MedicineDetail() {
  const { medicineId } = Route.useParams();
  const [medicine, setMedicine] = useState<TMedicine | undefined>(undefined);
  const navigate = useNavigate();

  function handleDeleteMedicine() {
    navigate({ to: "/medicine" });
    toast(`Successfully deleted ${medicine?.name} from your medicines.`, {
      className: "mb-24",
    });
  }

  useEffect(() => {
    async function getMedicines() {
      const medicine = await getData<TMedicine>(
        DB_NAME,
        MEDICINE_STORE,
        medicineId,
      );

      setMedicine(medicine);
    }
    getMedicines();
  }, []);

  if (!medicine) return <p>No medicine found</p>;

  return (
    <main className="w-full max-w-2xl">
      <section className="space-y-2 p-4 text-neutral-200">
        <header className="space-y-4">
          <h2 className="text-center text-2xl font-medium">{medicine?.name}</h2>
          <p className="line-clamp-1 rounded-xl bg-neutral-800 p-4 text-neutral-300">
            {medicine?.instruction}
          </p>
        </header>
        <div className="flex gap-2">
          <EditMedication medicine={medicine} setMedicine={setMedicine}>
            <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
              <Pencil className="h-5 w-5 shrink-0" />
              <h3>Edit</h3>
            </Button>
          </EditMedication>
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
              <DialogHeader className="gap-1">
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
              <DialogFooter className="flex-col gap-1">
                <Button
                  type="submit"
                  onClick={() => handleSuspendMedicine(medicine, setMedicine)}
                  className="bg-neutral-200 text-neutral-900 hover:bg-neutral-400"
                >
                  {medicine.status === "active" ? "Suspend" : "Resume"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="reset"
                    variant="ghost"
                    className="hover:bg-transparent hover:text-neutral-400"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
                <Trash2 className="h-5 w-5 shrink-0" />
                <h3>Delete</h3>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-96 rounded-xl border-0 bg-neutral-900 text-neutral-200 focus:outline-none focus:ring-0">
              <DialogHeader className="gap-1">
                <DialogTitle>Delete medicine?</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Once deleted, this action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex-col gap-1">
                <Button
                  type="submit"
                  onClick={handleDeleteMedicine}
                  className="bg-neutral-200 text-neutral-800 hover:bg-neutral-400"
                >
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button
                    type="reset"
                    variant="ghost"
                    className="hover:bg-transparent hover:text-neutral-400"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
      <Duration medicine={medicine} setMedicine={setMedicine} />
      <Dosage medicine={medicine} setMedicine={setMedicine} />
      <Frequency medicine={medicine} setMedicine={setMedicine} />
    </main>
  );
}

function handleSuspendMedicine(
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