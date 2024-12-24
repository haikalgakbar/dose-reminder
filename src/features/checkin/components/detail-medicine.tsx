import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScheduleCategory } from "@/types/medicine";
import handleTakeMedicine from "@/libs/medicine";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";
import { Dispatch, SetStateAction, useState } from "react";
import { Medicine } from "@/routes/index.lazy";

export function DetailMedicine({
  medicine,
  setMedicine,
  transaction,
}: {
  medicine: MedicineTransaction;
  setMedicine: Dispatch<SetStateAction<Medicine | undefined>>;
  transaction: TTransactionRecord;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-fit w-full flex-col items-start border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40 hover:text-neutral-200"
          >
            <DetailMedicineTrigger medicine={medicine} />
          </Button>
        </DialogTrigger>
        <DialogContent className="border-none bg-neutral-900 text-neutral-200 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{medicine.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <section className="space-y-4">
            <article className="rounded-xl bg-neutral-800 p-4">
              {medicine.instruction}
            </article>
            <section className="gap-4 rounded-xl bg-neutral-800">
              <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
                <span>Dose</span>
                <span>
                  {medicine.dosage.qty} {medicine.dosage.form}
                </span>
              </article>
              {medicine.schedule.category === ScheduleCategory.TakeAsNeeded &&
              medicine.schedule.details.minTimeBetweenDoses ? (
                <article className="flex items-center justify-between p-4">
                  <span>Time</span>

                  <span>{medicine.schedule.details.minTimeBetweenDoses}h</span>
                </article>
              ) : medicine.schedule.category === ScheduleCategory.DailyIntake ||
                medicine.schedule.category === ScheduleCategory.SpecificDays ? (
                <article className="flex items-center justify-between p-4">
                  <span>Time</span>

                  <span>{medicine.schedule.details.times[0]}</span>
                </article>
              ) : null}
            </section>
          </section>
          <DialogFooter>
            <Button
              variant="ghost"
              className="hover:bg-transparent hover:text-neutral-400"
            >
              Skip
            </Button>
            <Button
              variant="outline"
              className="rounded-xl bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
              onClick={() => {
                handleTakeMedicine(medicine, transaction);
                setMedicine((prev) => {
                  const updatedMedicines = updateMedicines(
                    prev as Medicine,
                    medicine.id,
                  );
                  return updatedMedicines;
                });
                setOpen((prev) => !prev);
              }}
            >
              Take
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-fit w-full flex-col items-start border-b border-[#33302E] p-4 last:border-b-0 hover:bg-[#171717]/40 hover:text-neutral-200"
        >
          <DetailMedicineTrigger medicine={medicine} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-neutral-800/80 text-neutral-200 backdrop-blur-md">
        <DrawerHeader className="text-left">
          <DrawerTitle>{medicine.name}</DrawerTitle>
          <DrawerDescription className="sr-only">
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <section className="space-y-4 px-4 py-2">
          <article className="rounded-xl bg-neutral-800 p-4">
            {medicine.instruction}
          </article>
          <section className="gap-4 rounded-xl bg-neutral-800">
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <span>Dose</span>
              <span>
                {medicine.dosage.qty} {medicine.dosage.form}
              </span>
            </article>
            {medicine.schedule.category === ScheduleCategory.TakeAsNeeded &&
            medicine.schedule.details.minTimeBetweenDoses ? (
              <article className="flex items-center justify-between p-4">
                <span>Time</span>

                <span>{medicine.schedule.details.minTimeBetweenDoses}h</span>
              </article>
            ) : medicine.schedule.category === ScheduleCategory.DailyIntake ||
              medicine.schedule.category === ScheduleCategory.SpecificDays ? (
              <article className="flex items-center justify-between p-4">
                <span>Time</span>

                <span>{medicine.schedule.details.times[0]}</span>
              </article>
            ) : null}
          </section>
        </section>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <>
              <Button
                variant="outline"
                className="rounded-xl bg-neutral-200 text-neutral-800 hover:bg-neutral-300"
                onClick={() => {
                  handleTakeMedicine(medicine, transaction);
                  setMedicine((prev) => {
                    const updatedMedicines = updateMedicines(
                      prev as Medicine,
                      medicine.id,
                    );
                    return updatedMedicines;
                  });
                  setOpen((prev) => !prev);
                }}
              >
                Take
              </Button>
              <Button
                variant="ghost"
                className="hover:bg-transparent hover:text-neutral-400"
              >
                Skip
              </Button>
            </>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function updateMedicines(medicines: Medicine, medicationId: string) {
  const updatedMedicines = JSON.parse(JSON.stringify(medicines)) as Medicine;

  updatedMedicines.today.withTime = updatedMedicines.today.withTime.map(
    (time) => ({
      time: time.time,
      data: time.data.filter((med) => med.id !== medicationId),
    }),
  );

  updatedMedicines.today.withTime = updatedMedicines.today.withTime.filter(
    (time) => time.data.length > 0,
  );

  return updatedMedicines;
}

function DetailMedicineTrigger({
  medicine,
}: {
  medicine: MedicineTransaction;
}) {
  return (
    <>
      <h3 className="text-base font-medium">{medicine.name}</h3>
      <p className="line-clamp-1 text-base font-normal text-[#A3A3A3]">
        {medicine.instruction}
      </p>
      <p className="flex w-full gap-1 font-normal text-[#A3A3A3]">
        {medicine.schedule.category === ScheduleCategory.TakeAsNeeded &&
        medicine.schedule.details.minTimeBetweenDoses ? (
          <>
            <span>Every {medicine.schedule.details.minTimeBetweenDoses}</span>
            <span>·</span>
          </>
        ) : null}
        <span>
          {medicine.dosage.qty} {medicine.dosage.form}
        </span>
      </p>
    </>
  );
}
