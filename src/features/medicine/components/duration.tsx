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
import { ChevronRight, CalendarIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, getCurrentDate } from "@/libs/util";
import { TMedicine } from "@/types/medicine";
import { updateData } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import { Checkbox } from "@/components/ui/checkbox";

export default function Duration({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  return (
    <section className="space-y-2 p-4 text-neutral-200">
      <header>
        <h2>Duration</h2>
      </header>
      <div className="overflow-hidden rounded-xl bg-neutral-800">
        <DurationStartEdit medicine={medicine} setMedicine={setMedicine} />
        <DurationEndEdit medicine={medicine} setMedicine={setMedicine} />
      </div>
    </section>
  );
}

function DurationStartEdit({
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
          <Button variant="outline" className="bg-[#1D1B1A]">
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
          <h3 className="text-base font-normal">Start</h3>
          <div className="flex items-center gap-1">
            <p className="text-base font-normal text-neutral-300">
              {format(new Date(medicine.duration.startDate), "dd MMM yyyy")}
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
        <FormStart
          setOpen={setOpen}
          medicine={medicine}
          setMedicine={setMedicine}
        />
      </DrawerContent>
    </Drawer>
  );
}

function FormStart({
  setOpen,
  medicine,
  setMedicine,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const formSchema = z.object({
    startDate: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: medicine.duration.startDate,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updateStartDate = {
      ...medicine,
      duration: { ...medicine.duration, startDate: values.startDate },
    };

    updateData(DB_NAME, MEDICINE_STORE, updateStartDate);
    setMedicine(updateStartDate);
    setOpen((prev) => !prev);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="[">
              <FormLabel className="font-normal text-neutral-300">
                Start date
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start border-none bg-neutral-800 text-left font-normal text-neutral-200",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden rounded-lg border-none bg-neutral-800 p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(field.value)}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        }
                      }}
                      disabled={(date) =>
                        date > new Date() || date < new Date("2020-01-01")
                      }
                      defaultMonth={new Date(medicine.duration.startDate)}
                      className="bg-neutral-800 text-neutral-200"
                      classNames={{
                        head_cell:
                          "text-neutral-500 rounded-md w-full font-normal text-[0.8rem]",
                        cell: "[&:has([aria-selected])]:bg-transparent",
                        day_today: "bg-none border border-neutral-200",
                        day_selected:
                          " rounded-lg focus:bg-neutral-200 focus:text-neutral-800",
                        day_outside: "text-neutral-500",
                        day_disabled: "text-neutral-600",
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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

function DurationEndEdit({
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
          <Button variant="outline" className="bg-[#1D1B1A]">
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
          <h3 className="text-base font-normal">End</h3>
          <div className="flex items-center gap-1">
            <p className="text-base font-normal text-neutral-300">
              {medicine.duration.endDate
                ? format(new Date(medicine.duration.endDate), "dd MMM yyyy")
                : "None"}
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
        <FormEnd
          setOpen={setOpen}
          medicine={medicine}
          setMedicine={setMedicine}
        />
      </DrawerContent>
    </Drawer>
  );
}

function FormEnd({
  setOpen,
  medicine,
  setMedicine,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const formSchema = z.object({
    endDate: z.string().optional(),
    indefinite: z.boolean().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endDate: medicine.duration.endDate ?? getCurrentDate(),
      indefinite: medicine.duration.endDate ? false : true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const endDate = values.indefinite ? undefined : values.endDate;

    const updatedMedicine = {
      ...medicine,
      duration: { ...medicine.duration, endDate },
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
          name="endDate"
          render={({ field }) => (
            <FormItem className="[">
              <FormLabel className="font-normal text-neutral-300">
                End date
              </FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start border-none bg-neutral-800 text-left font-normal text-neutral-200",
                        !field.value && "text-neutral-200",
                      )}
                      disabled={form.getValues().indefinite}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden rounded-lg border-none bg-neutral-800 p-0">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        }
                      }}
                      disabled={(date) =>
                        date <= new Date(medicine.duration.startDate)
                      }
                      className="bg-neutral-800 text-neutral-200"
                      classNames={{
                        head_cell:
                          "text-neutral-500 rounded-md w-full font-normal text-[0.8rem]",
                        cell: "[&:has([aria-selected])]:bg-transparent",
                        day_today: "bg-none border border-neutral-200",
                        day_selected:
                          " rounded-lg focus:bg-neutral-200 focus:text-neutral-800",
                        day_outside: "text-neutral-500",
                        day_disabled: "text-neutral-600",
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="indefinite"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 text-neutral-300">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-neutral-300"
                />
              </FormControl>
              <FormLabel className="cursor-pointer">Indefinitely?</FormLabel>
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
