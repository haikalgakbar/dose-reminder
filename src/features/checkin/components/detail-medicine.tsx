import * as React from "react";

import { cn } from "@/libs/util";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { ScheduleCategory, TMedicine } from "@/types/medicine";

export function DetailMedicine({ medicine }: { medicine: TMedicine }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <h1>Detail</h1>
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
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <h1>Detail</h1>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DetailMedicineTrigger({ medicine }: { medicine: TMedicine }) {
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
