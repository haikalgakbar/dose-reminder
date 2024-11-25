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
import { ChevronRight, Plus, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, getOrdinalSuffixFromNumber, sortDays } from "@/libs/util";
import {
  AsNeededSchedule,
  DailySchedule,
  DayOfWeek,
  DosageQty,
  Schedule,
  ScheduleCategory,
  SpecificDaysSchedule,
  TMedicine,
} from "@/types/medicine";
import { updateData } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";

export default function Frequency({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  return (
    <section className="space-y-2 p-4 text-neutral-200">
      <header>
        <h2>Frequency</h2>
      </header>
      <div className="overflow-hidden rounded-xl bg-neutral-800">
        <FrequencyForm medicine={medicine} setMedicine={setMedicine} />
      </div>
      <div className="overflow-hidden rounded-xl bg-neutral-800">
        {medicine.schedule.category === ScheduleCategory.DailyIntake ||
        medicine.schedule.category === ScheduleCategory.SpecificDays ? (
          medicine.schedule.details.times.map((time, index) => (
            <FrequencyDetail
              category={medicine.schedule.category}
              index={index}
              time={time}
              key={index}
            />
          ))
        ) : (
          <FrequencyDetail
            category={medicine.schedule.category}
            index={0}
            time={medicine.schedule.details.minTimeBetweenDoses}
          />
        )}
      </div>
    </section>
  );
}

function FrequencyDetail({
  category,
  index,
  time,
}: {
  category: ScheduleCategory;
  index: number;
  time: string | null;
}) {
  return category === ScheduleCategory.DailyIntake ||
    category === ScheduleCategory.SpecificDays ? (
    <article className="flex items-center justify-between p-4">
      <h3 className="font-normal">
        {`${index + 1}${getOrdinalSuffixFromNumber(index + 1)}`} intake
      </h3>
      <p className="text-[#A3A3A3]">{time}</p>
    </article>
  ) : (
    <article className="flex items-center justify-between p-4">
      <h3 className="font-normal">Interval between dose</h3>
      <p className="text-[#A3A3A3]">{time ? time : "None"}</p>
    </article>
  );
}

function FrequencyForm({
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
          <h3 className="text-base font-normal">
            {medicine.schedule.category === ScheduleCategory.DailyIntake
              ? "Daily"
              : medicine.schedule.category === ScheduleCategory.SpecificDays
                ? `Every ${medicine.schedule.details.days.join(", ")}`
                : "As needed"}
          </h3>
          <ChevronRight size={20} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerTitle className="sr-only w-full text-center text-base uppercase text-[#A3A3A3]">
          Change start date
        </DrawerTitle>
        <DialogDescription className="sr-only">
          Change start date
        </DialogDescription>
        <EditFrequencyForm
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

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      options.push(time);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

function EditFrequencyForm({
  setOpen,
  medicine,
  setMedicine,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  // const { medicine, updateMedicine } = useMedicineContext();

  const formSchema = z.object({
    category: z.nativeEnum(ScheduleCategory),
    days: z.array(z.nativeEnum(DayOfWeek)).optional(),
    reminderIntake: z
      .object({
        time: z.string(),
      })
      .array()
      .optional(),
    addReminderInterval: z.boolean().default(false).optional(),
    reminderInterval: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: medicine.schedule.category,
      days: [DayOfWeek.Mon, DayOfWeek.Wed, DayOfWeek.Fri],
      reminderIntake: [
        {
          time: "00:00",
        },
      ],
      addReminderInterval: false,
      reminderInterval: "06:00",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "reminderIntake",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let details:
      | AsNeededSchedule
      | DailySchedule
      | SpecificDaysSchedule
      | null = null;

    if (values.category === ScheduleCategory.DailyIntake) {
      details = {
        times: values.reminderIntake?.map((val) => val.time) as string[],
      };
    } else if (values.category === ScheduleCategory.SpecificDays) {
      details = {
        days: sortDays(values.days ?? []) as DayOfWeek[],
        times: values.reminderIntake?.map((val) => val.time) as string[],
      };
    } else if (values.category === ScheduleCategory.TakeAsNeeded) {
      details = {
        minTimeBetweenDoses: values.addReminderInterval
          ? (values.reminderInterval as string)
          : null,
      };
    }

    if (!details) {
      throw new Error("Details could not be assigned."); // Optional: handle the error more gracefully based on your application's needs
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const schedule: Schedule = {
      category: values.category,
      details: details as any,
    };

    const newMeds: TMedicine = {
      ...medicine,
      schedule,
    };

    console.log(newMeds);
    // setMedicine(newMeds);
    // setOpen((prev) => !prev);
  }

  // const useAvailableTimeOptions = (include?: string) => {
  //   const { watch } = useFormContext();
  //   const reminderIntake: { time: string }[] = watch("reminderIntake");

  //   return useMemo(() => {
  //     return timeOptions.filter(
  //       (time) =>
  //         time === include ||
  //         !reminderIntake?.some((item) => item.time === time),
  //     );
  //   }, [reminderIntake, include]);
  // };

  // const availableTimeOptions = useMemo(() => {
  //   return timeOptions.filter(
  //     (time) =>
  //       // time === include ||
  //       !reminderIntake?.some((item) => item.time === time),
  //   );
  // }, [reminderIntake]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="font-normal text-neutral-300">
                Frequency
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {Object.values(ScheduleCategory).map((category) => (
                    <FormItem
                      key={category}
                      className="flex items-center space-x-3 space-y-0 text-neutral-300"
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={category}
                          className="border-neutral-200 text-neutral-200"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">{category}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          {form.watch().category === ScheduleCategory.DailyIntake ? (
            <>
              <p className="text-sm text-neutral-300">Intakes</p>
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`reminderIntake.${index}.time`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <>
                          <span className="text-neutral-300">{index + 1}.</span>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                            onOpenChange={() => {
                              console.log(field.value);
                            }}
                          >
                            <SelectTrigger className="w-full rounded-lg border-none bg-neutral-800 text-neutral-200">
                              <SelectValue
                                placeholder="Select time"
                                className="text-neutral-200"
                              />
                            </SelectTrigger>
                            <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                              {timeOptions.map((time) => (
                                <SelectItem
                                  key={time}
                                  value={time}
                                  className="focus:bg-neutral-700 focus:text-neutral-100"
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </>
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-2 text-neutral-300"
                        onClick={() => remove(index)}
                      >
                        <X size={20} />
                      </Button>
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                className="ps-2 text-neutral-300"
                onClick={() => {
                  append({
                    time: timeOptions[0],
                  });
                }}
              >
                <Plus size={20} />
                Add
              </Button>
            </>
          ) : null}
          {form.watch().category === ScheduleCategory.SpecificDays ? (
            <>
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem className="col-span-2 text-neutral-300">
                    <FormLabel className="text-sm font-normal">
                      Choose day
                    </FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="multiple"
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                      >
                        {Object.values(DayOfWeek).map((day) => (
                          <ToggleGroupItem
                            key={day}
                            value={day}
                            aria-label={`Toggle ${day}`}
                            className="aspect-square rounded-full"
                          >
                            {day[0].toUpperCase()}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Every {sortDays(field?.value ?? []).join(", ")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm font-normal text-neutral-300">Intakes</p>
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`reminderIntake.${index}.time`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <span className="text-neutral-300">{index + 1}.</span>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          onOpenChange={() => {
                            console.log(field.value);
                          }}
                        >
                          <SelectTrigger className="w-full rounded-lg border-none bg-neutral-800 text-neutral-200">
                            <SelectValue
                              placeholder="Select time"
                              className="text-neutral-200"
                            />
                          </SelectTrigger>
                          <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                className="focus:bg-neutral-700 focus:text-neutral-100"
                              >
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-2 text-neutral-300"
                        onClick={() => remove(index)}
                      >
                        <X size={20} />
                      </Button>
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                className="gap-2 ps-2"
                onClick={() => {
                  append({
                    time: "00:00",
                  });
                }}
              >
                <Plus size={20} />
                Add
              </Button>
            </>
          ) : null}
          {form.watch().category === ScheduleCategory.TakeAsNeeded ? (
            <>
              {form.getValues().addReminderInterval && (
                <FormField
                  control={form.control}
                  name="reminderInterval"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          onOpenChange={() => {
                            console.log(field.value);
                          }}
                        >
                          <SelectTrigger className="w-full rounded-lg border-none bg-neutral-800 text-neutral-200">
                            <SelectValue
                              placeholder="Select time"
                              className="text-neutral-200"
                            />
                          </SelectTrigger>
                          <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                            {timeOptions.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                className="focus:bg-neutral-700 focus:text-neutral-100"
                              >
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="addReminderInterval"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 text-neutral-300">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-neutral-300"
                      />
                    </FormControl>
                    <FormLabel>Reminder between dose?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}
        </div>
        <Button
          type="submit"
          className="w-full bg-neutral-100 text-neutral-800 hover:bg-neutral-300"
        >
          Submit
        </Button>
        {/* <DrawerClose className="w-full">
          Submit
        </DrawerClose> */}
      </form>
    </Form>
  );
}
