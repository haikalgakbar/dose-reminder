import { defaultMedicine } from "@/context/medicine";
import useMedicineContext from "@/hooks/useMedicineContext";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, Plus, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, getCurrentDate, sortDays } from "@/libs/util";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TMedicine,
  DosageForm,
  DosageQty,
  ScheduleCategory,
  DayOfWeek,
  Schedule,
  AsNeededSchedule,
  DailySchedule,
  SpecificDaysSchedule,
} from "@/types/medicine";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { nanoid } from "nanoid";
import { addMedicine } from "@/libs/medicine";

export default function AddMedication({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { updateMedicine } = useMedicineContext();

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
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={() => {
        updateMedicine(defaultMedicine);
        setStep(1);
      }}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-0">
          {step !== 1 && (
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
          </DrawerTitle>
        </DrawerHeader>
        <DialogDescription></DialogDescription>
        <AddMedicineForm
          step={step}
          setStep={setStep}
          setOpen={setOpen}
          className="p-4"
        />
      </DrawerContent>
    </Drawer>
  );
}

// const AddMedicineForm = memo(
//   ({
//     step,
//     setStep,
//     setOpen,
//     className,
//   }: {
//     step: number;
//     setStep: React.Dispatch<React.SetStateAction<number>>;
//     setOpen: React.Dispatch<React.SetStateAction<boolean>>;
//     className: string;
//   }) => {
//     return (
//       <div className={className}>
//         {step === 1 ? (
//           <StepOneForm setStep={setStep} />
//         ) : (
//           <StepTwoForm setOpen={setOpen} />
//         )}
//       </div>
//     );
//   },
// );
function AddMedicineForm({
  step,
  setStep,
  setOpen,
  className,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className: string;
}) {
  return (
    <div className={className}>
      {step === 1 ? (
        <StepOneForm setStep={setStep} />
      ) : (
        <StepTwoForm setOpen={setOpen} setStep={setStep} />
      )}
    </div>
  );
}

function StepOneForm({
  setStep,
}: {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { medicine, updateMedicine } = useMedicineContext();

  const formSchema = z
    .object({
      name: z.string().min(1),
      instruction: z.string().min(1).max(100),
      dosage: z.object({
        qty: z.nativeEnum(DosageQty),
        form: z.nativeEnum(DosageForm),
      }),
      duration: z.object({
        startDate: z.string(),
        endDate: z.string().optional(),
      }),
      addEndDate: z.boolean().default(false).optional(),
    })
    .refine((data) => {
      if (data.addEndDate && !data.duration.endDate) {
        return false;
      }
      return true;
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: medicine?.name ?? "",
      instruction: medicine?.instruction ?? "",
      dosage: {
        qty: medicine?.dosage.qty ?? DosageQty.One,
        form: medicine?.dosage.form ?? DosageForm.Tablets,
      },
      duration: {
        startDate: medicine?.duration?.startDate ?? getCurrentDate(),
        endDate: medicine?.duration?.endDate ?? undefined,
      },
      addEndDate: !!medicine?.duration.endDate,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMedicine({
      name: values.name,
      instruction: values.instruction,
      dosage: {
        qty: values.dosage.qty,
        form: values.dosage.form,
      },
      duration: {
        startDate: new Date(values.duration.startDate).toISOString(),
        endDate: values.addEndDate ? values.duration.endDate : undefined,
      },
    });

    setStep((prev) => prev + 1);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4")}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-neutral-300">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  className="rounded-lg border-none bg-neutral-800 text-neutral-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instruction"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-normal text-neutral-300">
                Instruction
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="At least 30 minutes before eating"
                  className="resize-none rounded-lg border-none bg-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-2">
          <p className="text-sm font-normal leading-none text-neutral-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {" "}
            How many meds do you take at the same time?
          </p>
          <div className="grid grid-cols-6 gap-2">
            <FormField
              control={form.control}
              name="dosage.qty"
              render={({ field }) => (
                <FormItem className="col-span-2">
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
            <FormField
              control={form.control}
              name="dosage.form"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <SelectTrigger className="w-full rounded-lg border-none bg-neutral-800 text-neutral-200">
                        <SelectValue placeholder="Choose form" />
                      </SelectTrigger>
                      <SelectContent className="border-none bg-neutral-800 text-neutral-200">
                        {Object.values(DosageForm).map((form) => (
                          <SelectItem
                            key={form}
                            value={form}
                            className="focus:bg-neutral-700 focus:text-neutral-100"
                          >
                            {form}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2 *:w-full">
          <FormField
            control={form.control}
            name="duration.startDate"
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
          {form.getValues().addEndDate && (
            <FormField
              control={form.control}
              name="duration.endDate"
              render={({ field }) => (
                <FormItem>
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
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-neutral-200" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="text-neutral-500">
                              Pick a date
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden rounded-lg border-none bg-neutral-800 p-0">
                        <Calendar
                          mode="single"
                          disabled={(date) =>
                            date <=
                            new Date(form.getValues().duration.startDate)
                          }
                          // selected={field.value}
                          onSelect={(date) => {
                            if (date) {
                              field.onChange(date.toISOString());
                            }
                          }}
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
          )}
        </div>
        <FormField
          control={form.control}
          name="addEndDate"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 text-neutral-300">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-neutral-300"
                />
              </FormControl>
              <FormLabel className="cursor-pointer">End date?</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className="bg-neutral-100 text-neutral-800 hover:bg-neutral-300"
        >
          Next
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

function StepTwoForm({
  setOpen,
  setStep,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { medicine, updateMedicine } = useMedicineContext();

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
        days: values.days as DayOfWeek[],
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
      id: nanoid(8),
      status: "active",
      ...medicine,
      schedule,
    };

    console.log(newMeds);

    addMedicine(newMeds);

    setOpen((prev) => !prev);
    setStep((prev) => prev - 1);
    updateMedicine(defaultMedicine);
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
