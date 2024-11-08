import { useMediaQuery } from "@uidotdev/usehooks";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MedicineTransaction, TTransactionRecord } from "@/types/transaction";

import handleTakeMedicine from "@/libs/medicine";
import { isArrayEmpty } from "@/libs/util";

export default function MedicineCardHome({
  medication,
  transaction,
}: {
  medication: MedicineTransaction;
  transaction: TTransactionRecord[];
}) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            {/* <Plus size={20} /> */}
            Add medication
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* <ProfileForm /> */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-fit w-full cursor-pointer flex-col gap-1 whitespace-pre-line rounded-xl border-b-2 border-[#BBA5A0]/20 bg-white p-4 text-left text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
        >
          <h2 className="w-full text-lg font-medium">{medication.name}</h2>
          <p className="line-clamp-2 w-full">{medication.instruction}</p>
          {medication.schedule.category === "takeAsNeeded" ? (
            <>
              <span className="flex w-full items-center gap-1 text-[#7D7A78]">
                {medication.schedule.details.minTimeBetweenDoses ? (
                  <p>
                    Every {medication.schedule.details.minTimeBetweenDoses}{" "}
                    hour(s)
                  </p>
                ) : (
                  <p>As needed</p>
                )}
                · {medication.dosage.qty} {medication.dosage.form}
              </span>
              {!isArrayEmpty(medication.consumedAt) && (
                <>
                  <div className="my-1 h-[1px] w-full bg-[#E3CBBC]/20"></div>
                  <p className="w-full text-left text-[#7D7A78]">
                    Taken {medication.consumedAt.length} time(s)
                  </p>
                </>
              )}
            </>
          ) : (
            <>
              <span className="flex w-full items-center gap-1 text-[#7D7A78]">
                {medication.timeToConsume} · {medication.dosage.qty}{" "}
                {medication.dosage.form}
              </span>
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-2 pt-0 text-left">
          <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-200" />
          <div className="flex w-full flex-col gap-2">
            <DrawerTitle>{medication.name}</DrawerTitle>
            <DrawerDescription>{medication.instruction}</DrawerDescription>
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <p>Dose</p>
            <p>
              {medication.dosage.qty} {medication.dosage.form}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            {medication.schedule.category === "takeAsNeeded" ? (
              <>
                <p>Time between doses</p>
                <p>{medication.schedule.details.minTimeBetweenDoses} hours</p>
              </>
            ) : (
              <>
                <p>Time</p>
                <p>{medication.schedule.details.times[0]}</p>
              </>
            )}
          </div>
        </div>
        <DrawerFooter>
          <Button
            variant="default"
            onClick={() => {
              handleTakeMedicine(medication, transaction);
              setOpen((prev) => !prev);
            }}
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Take medicine
          </Button>
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => console.log("skip")}
          >
            Skip
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
