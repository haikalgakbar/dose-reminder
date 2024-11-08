// import React, { useState, memo } from "react";
// import { defaultMedicine } from "@/context/medicine";
// import { cn, sortDays } from "@/libs/util";
// import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import { ArrowLeft, Plus, Calendar as CalendarIcon, Trash } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useFieldArray, useForm } from "react-hook-form";
// import { z } from "zod";
// import { getCurrentDate } from "@/libs/util";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";
// import useMedicineContext from "@/hooks/useMedicineContext";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
// import { DosageForm, DosageQty, TMedicine } from "@/types/medicine";
// import { nanoid } from "nanoid";
// import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

// export function DrawerDialog() {
//   const [open, setOpen] = useState(false);
//   const [step, setStep] = useState(1);
//   const { updateMedicine } = useMedicineContext();

//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline" className="bg-[#1D1B1A]">
//             <Plus size={20} />
//             Add medication
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit profile</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           {/* <ProfileForm /> */}
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer
//       open={open}
//       onOpenChange={setOpen}
//       onAnimationEnd={() => {
//         updateMedicine(defaultMedicine);
//         setStep(1);
//       }}
//     >
//       <DrawerTrigger asChild>
//         <Button
//           variant="outline"
//           className="flex items-center gap-1 rounded-lg bg-[#1D1B1A] text-[#F8F4F2]"
//         >
//           <Plus size={20} />
//           Add medication
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-0">
//           {step !== 1 && (
//             <Button
//               variant="ghost"
//               className="-ms-2 h-10 w-10 rounded-xl p-2 hover:bg-black/5"
//               onClick={() => setStep((prev) => prev - 1)}
//             >
//               <ArrowLeft size={18} className="text-[#33302E]" />
//             </Button>
//           )}
//           <DrawerTitle
//             className={`${step !== 1 && "pe-8"} w-full text-center text-base uppercase text-[#635d5a]`}
//           >
//             New medicine
//           </DrawerTitle>
//         </DrawerHeader>
//         <AddMedicineForm
//           step={step}
//           setStep={setStep}
//           setOpen={setOpen}
//           className="p-4"
//         />
//       </DrawerContent>
//     </Drawer>
//   );
// }

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

// function StepOneForm({
//   setStep,
// }: {
//   setStep: React.Dispatch<React.SetStateAction<number>>;
// }) {
//   const { medicine, updateMedicine } = useMedicineContext();

//   const formSchema = z
//     .object({
//       name: z.string().min(1),
//       instruction: z.string().min(1),
//       status: z.enum(["active", "non_active"]),
//       dosage: z.object({
//         qty: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"]),
//         form: z.enum([
//           "tablets",
//           "injections",
//           "ointments",
//           "capsules",
//           "syrups",
//           "drops",
//           "inhalers",
//           "patches",
//           "suppositories",
//         ]),
//       }),
//       duration: z.object({
//         startDate: z.date(),
//         endDate: z.date().optional(),
//       }),
//       addEndDate: z.boolean().default(false).optional(),
//     })
//     .refine((data) => {
//       if (data.addEndDate && !data.duration.endDate) {
//         return false;
//       }
//       return true;
//     });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: medicine?.name || "",
//       instruction: medicine?.instruction ?? "",
//       status: "active",
//       dosage: {
//         qty: medicine?.dosage.qty ?? DosageQty.One,
//         form: medicine?.dosage.form ?? DosageForm.Tablets,
//       },
//       duration: {
//         startDate: medicine?.duration?.startDate ?? getCurrentDate(),
//         endDate: medicine?.duration?.endDate ?? undefined,
//       },
//       addEndDate: medicine?.duration.endDate ? true : false,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     updateMedicine({
//       name: values.name,
//       instruction: values.instruction,
//       status: values.status,
//       dosage: {
//         qty: values.dosage.qty,
//         form: values.dosage.form,
//       },
//       duration: {
//         startDate: values.duration.startDate,
//         endDate: values.addEndDate ? values.duration.endDate : undefined,
//       },
//     });
//     setStep((prev) => prev + 1);
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className={cn("grid items-start gap-4")}
//       >
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="font-normal text-[#AA9C87]">Name</FormLabel>
//               <FormControl>
//                 <Input className="rounded-lg border-none" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="instruction"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel className="font-normal text-[#AA9C87]">
//                 Instruction
//               </FormLabel>
//               <FormControl>
//                 <Textarea
//                   placeholder="At least 30 minutes before eating"
//                   className="resize-none rounded-lg border-none placeholder:text-[#33302E]/50"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="grid gap-2">
//           <p className="text-sm font-normal leading-none text-[#AA9C87] peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
//             {" "}
//             How many meds do you take at the same time?
//           </p>
//           <div className="grid grid-cols-6 gap-2">
//             <FormField
//               control={form.control}
//               name="dosage.qty"
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormControl>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger className="rounded-lg border-none text-[#33302E]">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent className="border-none">
//                         <SelectItem value="1">1</SelectItem>
//                         <SelectItem value="2">2</SelectItem>
//                         <SelectItem value="3">3</SelectItem>
//                         <SelectItem value="4">4</SelectItem>
//                         <SelectItem value="5">5</SelectItem>
//                         <SelectItem value="6">6</SelectItem>
//                         <SelectItem value="7">7</SelectItem>
//                         <SelectItem value="8">8</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="dosage.form"
//               render={({ field }) => (
//                 <FormItem className="col-span-4">
//                   <FormControl>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <SelectTrigger className="w-full rounded-lg border-none text-[#33302E]">
//                         <SelectValue placeholder="Choose form" />
//                       </SelectTrigger>
//                       <SelectContent className="border-none">
//                         <SelectItem value="tablets">Tablets</SelectItem>
//                         <SelectItem value="injections">Injections</SelectItem>
//                         <SelectItem value="ointments">Ointments</SelectItem>
//                         <SelectItem value="capsules">Capsules</SelectItem>
//                         <SelectItem value="syrups">Syrups</SelectItem>
//                         <SelectItem value="drops">Drops</SelectItem>
//                         <SelectItem value="inhalers">Inhalers</SelectItem>
//                         <SelectItem value="patches">Patches</SelectItem>
//                         <SelectItem value="suppositories">
//                           Suppositories
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2 *:w-full">
//           <FormField
//             control={form.control}
//             name="duration.startDate"
//             render={({ field }) => (
//               <FormItem className="[">
//                 <FormLabel className="font-normal text-[#AA9C87]">
//                   Start date
//                 </FormLabel>
//                 <FormControl>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <Button
//                         variant={"outline"}
//                         className={cn(
//                           "w-full justify-start border-none text-left font-normal",
//                           !field.value && "text-muted-foreground",
//                         )}
//                       >
//                         <CalendarIcon className="mr-2 h-4 w-4" />
//                         {field.value ? (
//                           format(field.value, "PPP")
//                         ) : (
//                           <span>Pick a date</span>
//                         )}
//                       </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0">
//                       <Calendar
//                         mode="single"
//                         selected={field.value}
//                         onSelect={field.onChange}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           {form.getValues().addEndDate && (
//             <FormField
//               control={form.control}
//               name="duration.endDate"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="font-normal text-[#AA9C87]">
//                     End date
//                   </FormLabel>
//                   <FormControl>
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full justify-start border-none text-left font-normal",
//                             !field.value && "text-muted-foreground",
//                           )}
//                         >
//                           <CalendarIcon className="mr-2 h-4 w-4" />
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent className="w-auto p-0">
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={field.onChange}
//                           initialFocus
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )}
//         </div>
//         <FormField
//           control={form.control}
//           name="addEndDate"
//           render={({ field }) => (
//             <FormItem className="flex items-center gap-2">
//               <FormControl>
//                 <Checkbox
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//               <FormLabel>End date?</FormLabel>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" disabled={!form.formState.isValid}>
//           Next
//         </Button>
//       </form>
//     </Form>
//   );
// }

// function StepTwoForm({
//   setOpen,
// }: {
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   const { medicine, updateMedicine } = useMedicineContext();
//   const [_, setMeds] = useLocalStorage<TMedicine[] | null>("my_meds", []);

//   const formSchema = z.object({
//     type: z.enum(["daily", "specific", "interval"]),
//     days: z.string().array().optional(),
//     reminderIntake: z
//       .object({
//         time: z.string(),
//       })
//       .array()
//       .optional(),
//     addReminderInterval: z.boolean().default(false).optional(),
//     reminderInterval: z.string().optional(),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       type: "daily",
//       days: ["mon", "wed", "fri"],
//       reminderIntake: [
//         {
//           time: "06:00",
//         },
//       ],
//       addReminderInterval: false,
//       reminderInterval: undefined,
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     name: "reminderIntake",
//     control: form.control,
//     // rules: {
//     //   maxLength: 8,
//     // },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     const commonReminder = {
//       time: values.reminderIntake?.map((val) => val.time),
//     };

//     const schedule = {
//       type: values.type,
//       reminder: {
//         day:
//           values.type === "daily"
//             ? ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
//             : values.type === "specific"
//               ? sortDays(values.days || [])
//               : undefined,
//         time:
//           values.type === "interval" && values.addReminderInterval
//             ? values.reminderInterval
//             : values.type === "interval" && !values.addReminderInterval
//               ? undefined
//               : commonReminder.time,
//       },
//     };

//     // console.log(commonReminder, schedule);

//     updateMedicine({ schedule });

//     const newMeds: TMedicine = {
//       id: nanoid(8),
//       ...medicine,
//       schedule,
//     };

//     // saveToDB(DB_NAME, MEDICINE_STORE, newMeds);
//     // setMeds((prev) => (prev ? [...prev, newMeds] : [newMeds]));
//     // console.log(medicine);

//     updateMedicine(defaultMedicine);
//     // setStep((prev) => prev - 1);
//     setOpen((prev) => !prev);
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4")}>
//         <FormField
//           control={form.control}
//           name="type"
//           render={({ field }) => (
//             <FormItem className="col-span-2">
//               <FormLabel>Frequency</FormLabel>
//               <FormControl>
//                 <RadioGroup
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="daily" />
//                     </FormControl>
//                     <FormLabel className="font-normal">Daily</FormLabel>
//                   </FormItem>
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="specific" />
//                     </FormControl>
//                     <FormLabel className="font-normal">
//                       Specific day of the week
//                     </FormLabel>
//                   </FormItem>
//                   <FormItem className="flex items-center space-x-3 space-y-0">
//                     <FormControl>
//                       <RadioGroupItem value="interval" />
//                     </FormControl>
//                     <FormLabel className="font-normal">As needed</FormLabel>
//                   </FormItem>
//                 </RadioGroup>
//                 {/* <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select frequency" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily</SelectItem>
//                     <SelectItem value="specific">
//                       Specific day of the week
//                     </SelectItem>
//                     <SelectItem value="interval">As needed</SelectItem>
//                   </SelectContent>
//                 </Select> */}
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div className="space-y-2">
//           {form.watch().type === "daily" ? (
//             <>
//               <p>Intakes</p>
//               {fields.map((item, index) => (
//                 <FormField
//                   key={item.id}
//                   control={form.control}
//                   name={`reminderIntake.${index}.time`}
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-2 space-y-0">
//                       <FormControl>
//                         <Input type="time" {...field} className="w-full" />
//                       </FormControl>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="p-2"
//                         onClick={() => remove(index)}
//                       >
//                         <Trash size={20} />
//                       </Button>
//                     </FormItem>
//                   )}
//                 />
//               ))}
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="gap-2 ps-2"
//                 onClick={() => {
//                   append({
//                     time: "00:00",
//                   });
//                 }}
//               >
//                 <Plus size={20} />
//                 Add
//               </Button>
//             </>
//           ) : null}
//           {form.watch().type === "specific" ? (
//             <>
//               <FormField
//                 control={form.control}
//                 name="days"
//                 render={({ field }) => (
//                   <FormItem className="col-span-2">
//                     <FormLabel>Choose day</FormLabel>
//                     <FormControl>
//                       <ToggleGroup
//                         type="multiple"
//                         defaultValue={field.value}
//                         onValueChange={field.onChange}
//                       >
//                         {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(
//                           (day) => (
//                             <ToggleGroupItem
//                               key={day}
//                               value={day}
//                               aria-label={`Toggle ${day}`}
//                             >
//                               {day[0].toUpperCase()}
//                             </ToggleGroupItem>
//                           ),
//                         )}
//                       </ToggleGroup>
//                     </FormControl>
//                     <FormDescription>
//                       Every {sortDays(field?.value ?? []).join(", ")}
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <p>Intakes</p>
//               {fields.map((item, index) => (
//                 <FormField
//                   key={item.id}
//                   control={form.control}
//                   name={`reminderIntake.${index}.time`}
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-2 space-y-0">
//                       <FormControl>
//                         <Input type="time" {...field} className="w-full" />
//                       </FormControl>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="p-2"
//                         onClick={() => remove(index)}
//                       >
//                         <Trash size={20} />
//                       </Button>
//                     </FormItem>
//                   )}
//                 />
//               ))}
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="gap-2 ps-2"
//                 onClick={() => {
//                   append({
//                     time: "00:00",
//                   });
//                 }}
//               >
//                 <Plus size={20} />
//                 Add
//               </Button>
//             </>
//           ) : null}
//           {form.watch().type === "interval" ? (
//             <>
//               {form.getValues().addReminderInterval && (
//                 <FormField
//                   control={form.control}
//                   name="reminderInterval"
//                   render={({ field }) => (
//                     <FormItem className="flex items-center gap-2 space-y-0">
//                       <FormControl>
//                         <Input type="time" className="w-full" {...field} />
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               )}
//               <FormField
//                 control={form.control}
//                 name="addReminderInterval"
//                 render={({ field }) => (
//                   <FormItem className="flex items-center gap-2">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                       />
//                     </FormControl>
//                     <FormLabel>Reminder between dose?</FormLabel>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </>
//           ) : null}
//         </div>
//         <Button type="submit" className="w-full">
//           Submit
//         </Button>
//         {/* <DrawerClose className="w-full">
//           Submit
//         </DrawerClose> */}
//       </form>
//     </Form>
//   );
// }
