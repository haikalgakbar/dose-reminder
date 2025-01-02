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
import { ChevronRight } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/libs/util";
import { DosageForm, DosageQty, TMedicine } from "@/types/medicine";
import { updateData } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dosage({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  return (
    <section className="space-y-2 p-4 text-neutral-200">
      <header>
        <h2 className="ms-4">Dosage</h2>
      </header>
      <div className="overflow-hidden rounded-xl bg-neutral-800">
        <DosageQtyEdit medicine={medicine} setMedicine={setMedicine} />
        <DosageFormEdit medicine={medicine} setMedicine={setMedicine} />
      </div>
    </section>
  );
}

function DosageQtyEdit({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-fit w-full items-center justify-between gap-1 rounded-none border-b border-b-neutral-700 bg-[#1D1B1A] bg-transparent p-4 text-[#F8F4F2] hover:bg-neutral-700/60 hover:text-neutral-200"
          >
            <h3 className="text-base font-normal">Qty</h3>
            <div className="flex items-center gap-1">
              <p className="text-base font-normal text-neutral-300">
                {medicine.dosage.qty}
              </p>
              <ChevronRight size={20} />
            </div>
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
        <Button
          variant="ghost"
          className="flex h-fit w-full items-center justify-between gap-1 rounded-none border-b border-b-neutral-700 bg-[#1D1B1A] bg-transparent p-4 text-[#F8F4F2] hover:bg-neutral-700/60 hover:text-neutral-200"
        >
          <h3 className="text-base font-normal">Qty</h3>
          <div className="flex items-center gap-1">
            <p className="text-base font-normal text-neutral-300">
              {medicine.dosage.qty}
            </p>
            <ChevronRight size={20} />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerTitle className="sr-only w-full text-center text-base uppercase text-[#A3A3A3]">
          Change start date
        </DrawerTitle>
        <DialogDescription className="sr-only">
          Change start date
        </DialogDescription>
        <FormQty
          setOpen={setOpen}
          medicine={medicine}
          setMedicine={setMedicine}
        />
      </DrawerContent>
    </Drawer>
  );
}

function FormQty({
  setOpen,
  medicine,
  setMedicine,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const formSchema = z.object({
    qty: z.nativeEnum(DosageQty),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qty: medicine.dosage.qty,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedMedicine = {
      ...medicine,
      dosage: { ...medicine.dosage, qty: values.qty },
    };

    updateData(DB_NAME, MEDICINE_STORE, updatedMedicine);
    setMedicine(updatedMedicine);
    setOpen((prev) => !prev);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <FormField
          control={form.control}
          name="qty"
          render={({ field }) => (
            <FormItem className="[">
              <FormLabel className="font-normal text-neutral-300">
                Dosage qty
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger className="rounded-lg border-none bg-neutral-800 text-neutral-200">
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                    {Object.values(DosageQty).map((qty) => (
                      <SelectItem
                        key={qty}
                        value={qty}
                        className="focus:bg-neutral-700 focus:text-neutral-100"
                      >
                        {qty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-neutral-100 text-neutral-800 hover:bg-neutral-300"
        >
          Update
        </Button>
      </form>
    </Form>
  );
}

function DosageFormEdit({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-fit w-full items-center justify-between gap-1 rounded-none bg-[#1D1B1A] bg-transparent p-4 text-[#F8F4F2] hover:bg-neutral-700/60 hover:text-neutral-200"
          >
            <h3 className="text-base font-normal">Form</h3>
            <div className="flex items-center gap-1">
              <p className="text-base font-normal text-neutral-300">
                {medicine.dosage.form}
              </p>
              <ChevronRight size={20} />
            </div>
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
        <Button
          variant="ghost"
          className="flex h-fit w-full items-center justify-between gap-1 rounded-none bg-[#1D1B1A] bg-transparent p-4 text-[#F8F4F2] hover:bg-neutral-700/60 hover:text-neutral-200"
        >
          <h3 className="text-base font-normal">Form</h3>
          <div className="flex items-center gap-1">
            <p className="text-base font-normal text-neutral-300">
              {medicine.dosage.form}
            </p>
            <ChevronRight size={20} />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerTitle className="sr-only w-full text-center text-base uppercase text-[#A3A3A3]">
          Change end date
        </DrawerTitle>
        <DialogDescription className="sr-only">
          Change end date
        </DialogDescription>
        <DosageFormForm
          setOpen={setOpen}
          medicine={medicine}
          setMedicine={setMedicine}
        />
      </DrawerContent>
    </Drawer>
  );
}

function DosageFormForm({
  setOpen,
  medicine,
  setMedicine,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const formSchema = z.object({
    form: z.nativeEnum(DosageForm),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      form: medicine.dosage.form,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedMedicine = {
      ...medicine,
      dosage: { ...medicine.dosage, form: values.form },
    };

    updateData(DB_NAME, MEDICINE_STORE, updatedMedicine);
    setMedicine(updatedMedicine);
    setOpen((prev) => !prev);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <FormField
          control={form.control}
          name="form"
          render={({ field }) => (
            <FormItem className="[">
              <FormLabel className="font-normal text-neutral-300">
                End date
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <SelectTrigger className="rounded-lg border-none bg-neutral-800 text-neutral-200">
                    <SelectValue placeholder="Select dosage" />
                  </SelectTrigger>
                  <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                    {Object.values(DosageForm).map((qty) => (
                      <SelectItem
                        key={qty}
                        value={qty}
                        className="focus:bg-neutral-700 focus:text-neutral-100"
                      >
                        {qty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-neutral-100 text-neutral-800 hover:bg-neutral-300"
        >
          Update
        </Button>
      </form>
    </Form>
  );
}
