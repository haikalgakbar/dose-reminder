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
import { ArrowLeft, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function EditMedication({
  type,
}: {
  type: "duration" | "dosage" | "frequency";
}) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-[#1D1B1A]">
            <Plus size={20} />
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
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {type === "duration" ? (
          <Button
            variant="ghost"
            className="flex aspect-square items-center gap-1 rounded-full bg-[#1D1B1A] p-2 text-[#F8F4F2]"
          >
            <Plus size={20} />
          </Button>
        ) : type === "dosage" ? (
          <Button
            variant="ghost"
            className="flex aspect-square items-center gap-1 rounded-full bg-[#1D1B1A] p-2 text-[#F8F4F2]"
          >
            <Plus size={20} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="flex aspect-square items-center gap-1 rounded-full bg-[#1D1B1A] p-2 text-[#F8F4F2]"
          >
            <Plus size={20} />
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-0">
          {/* {step !== 1 && (
            <Button
              variant="ghost"
              className="-ms-2 h-10 w-10 rounded-xl p-2 hover:bg-black/5"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <ArrowLeft size={18} className="text-neutral-300" />
            </Button>
          )}
          <DrawerTitle
            className={`${step !== 1 && "pe-8"} w-full text-center text-base uppercase text-[#A3A3A3]`}
          >
            New medicine
          </DrawerTitle> */}
        </DrawerHeader>
        <DialogDescription></DialogDescription>
        {/* <AddMedicineForm
          step={step}
          setStep={setStep}
          setOpen={setOpen}
          className="p-4"
        /> */}
      </DrawerContent>
    </Drawer>
  );
}
