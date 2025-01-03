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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  MedicineTransactionAsNeeded,
  TTransactionRecord,
} from "@/types/transaction";
import { useState } from "react";
import { format } from "date-fns";
import { getOrdinalSuffixFromNumber, isArrayEmpty } from "@/libs/util";
import { ChevronRight, ArrowLeft } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { updateData } from "@/libs/db";
import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";

export function AsNeededCard({
  date,
  medicine,
  transaction,
}: {
  date: string;
  medicine: MedicineTransactionAsNeeded;
  transaction: TTransactionRecord;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<"detail" | "edit">("detail");
  const [intakeIndex, setIntakeIndex] = useState<undefined | number>(undefined);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isArrayEmpty(medicine.consumedAt)) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-fit w-full items-center justify-between rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700 hover:text-neutral-200"
          >
            <>
              <h3 className="text-base font-medium">{medicine.name}</h3>
              <p>{`${medicine.consumedAt.length} time(s)`}</p>
            </>
          </Button>
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
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={() => {
        setIntakeIndex(undefined);
        setContent("detail");
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-fit w-full items-center justify-between rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700 hover:text-neutral-200"
        >
          <>
            <h3 className="text-base font-medium">{medicine.name}</h3>
            <p>{`${medicine.consumedAt.length} time(s)`}</p>
          </>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-neutral-800/80 text-neutral-200 backdrop-blur-md">
        {content === "detail" ? (
          <>
            <DrawerHeader className="text-left">
              <DrawerTitle>{medicine.name}</DrawerTitle>
              <DrawerDescription className="sr-only">
                Make changes to your profile here. Click save when you're done.
              </DrawerDescription>
            </DrawerHeader>
            <section className="space-y-4 p-4 pt-2">
              <article className="rounded-xl bg-neutral-800 p-4">
                {medicine.instruction}
              </article>
              <article className="flex items-center justify-between rounded-xl bg-neutral-800 p-4">
                <h3>Date</h3>
                <p>{format(date, "dd/MM/yyyy")}</p>
              </article>
              <article className="flex flex-col items-center justify-between gap-2 rounded-xl bg-neutral-800 p-4">
                <div
                  className={`flex w-full items-center justify-between ${medicine.schedule.details.minTimeBetweenDoses && "p-2"}`}
                >
                  <h3>Dosage</h3>
                  <p>
                    {medicine.dosage.qty} {medicine.dosage.form}
                  </p>
                </div>
                {medicine.schedule.details.minTimeBetweenDoses && (
                  <>
                    <div className="h-[1px] w-full rounded-full bg-neutral-700"></div>
                    <div className="flex w-full items-center justify-between p-2">
                      <h3>Time</h3>
                      <p>{medicine.timeToConsume}</p>
                    </div>
                  </>
                )}
              </article>
              <article className="flex flex-col gap-2 rounded-xl bg-neutral-800 p-2">
                {medicine.consumedAt.map((time, index) => (
                  <>
                    <Button
                      key={index}
                      variant="ghost"
                      className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-start font-normal hover:bg-neutral-700 hover:text-neutral-200"
                      onClick={() => {
                        setIntakeIndex(index);
                        setContent("edit");
                      }}
                    >
                      <h3 className="w-full">
                        {`${index + 1}${getOrdinalSuffixFromNumber(index + 1)}`}{" "}
                        intake
                      </h3>
                      <p className="me-1 text-neutral-400">{time}</p>
                      <ChevronRight size={20} className="text-neutral-400" />
                    </Button>
                    {index === medicine.consumedAt.length - 1 ? null : (
                      <div
                        key={index + 100}
                        className="h-[1px] w-full rounded-full bg-neutral-700"
                      ></div>
                    )}
                  </>
                ))}
              </article>
            </section>
          </>
        ) : (
          <>
            <DrawerHeader className="p-2 text-left">
              <div className="flex w-full items-center px-1">
                <Button
                  variant="ghost"
                  className="relative z-10 h-8 p-0 before:absolute before:z-0 before:h-8 before:w-8 before:rounded-xl before:content-[''] hover:bg-transparent hover:text-neutral-200 before:hover:bg-neutral-700"
                  onClick={() => {
                    setIntakeIndex(undefined);
                    setContent("detail");
                  }}
                >
                  <ArrowLeft size={20} className="z-10" />
                </Button>
                <DrawerTitle className="w-full pe-8 text-center text-sm uppercase tracking-wide text-neutral-300">
                  Taken at
                </DrawerTitle>
              </div>
              <DrawerDescription className="sr-only">
                Make changes to your profile here. Click save when you're done.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerContentAsNeeded
              intakeIndex={intakeIndex}
              setIntakeIndex={setIntakeIndex}
              medicine={medicine}
              transaction={transaction}
              setContent={setContent}
            />
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function DrawerContentAsNeeded({
  intakeIndex,
  setIntakeIndex,
  medicine,
  transaction,
  setContent,
}: {
  intakeIndex: number | undefined;
  setIntakeIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
  medicine: MedicineTransactionAsNeeded;
  transaction: TTransactionRecord;
  setContent: React.Dispatch<React.SetStateAction<"detail" | "edit">>;
}) {
  const FormSchema = z.object({
    time: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time: medicine.consumedAt[intakeIndex as number] ?? "00:00",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedTransaction = {
      ...transaction,
      medications: transaction.medications.map((med) =>
        med.id === medicine.id
          ? {
              ...med,
              consumedAt: med.consumedAt.toSpliced(
                intakeIndex as number,
                1,
                data.time,
              ),
            }
          : med,
      ),
    };

    updateData(DB_NAME, TRANSACTION_STORE, updatedTransaction);

    setIntakeIndex(undefined);
    setContent("detail");

    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-4 pt-2"
      >
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Pick time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="rounded-lg border-none bg-neutral-800 text-neutral-200 [&::-webkit-calendar-picker-indicator]:invert"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 rounded-full border-b-[0.5px] border-neutral-700 bg-neutral-700"></div>
        <Button
          type="submit"
          className="w-full bg-neutral-200 text-neutral-800 hover:bg-neutral-400"
        >
          Update
        </Button>
      </form>
    </Form>
  );
}
