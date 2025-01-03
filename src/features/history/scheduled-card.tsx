import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
  MedicineTransaction,
  MedicineTransactionWithSchedule,
  TTransactionRecord,
} from "@/types/transaction";
import { memo, useState } from "react";
import { CheckIcon, PreIcon, XIcon } from "@/components/calendar-status";
import { getCurrentDate } from "@/libs/util";
import { format } from "date-fns";
import { z } from "zod";
import { ArrowLeft, Check, ChevronRight, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateData } from "@/libs/db";
import { DB_NAME, TRANSACTION_STORE } from "@/constant/db";

export function ScheduledCard({
  date,
  medicine,
  transaction,
}: {
  date: string;
  medicine: MedicineTransactionWithSchedule;
  transaction: TTransactionRecord;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<
    "detail" | "status" | "time" | "update"
  >("detail");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-fit w-full items-center justify-between rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700 hover:text-neutral-200"
          >
            <DetailMedicineTrigger date={date} medicine={medicine} />
          </Button>
        </DialogTrigger>
        <DialogContent
          className="border-none bg-neutral-900 p-6 text-neutral-200 sm:max-w-[425px] sm:rounded-2xl"
          onCloseAutoFocus={() => setContent("detail")}
        >
          {content === "detail" ? (
            <DialogHeader className="flex-row items-center gap-2">
              <DialogTitle className="w-full">{medicine.name}</DialogTitle>
              <DialogDescription className="sr-only">
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
              <DialogClose className="mt-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>
          ) : content === "status" ||
            content === "time" ||
            content === "update" ? (
            <DialogHeader className="text-left">
              <div className="flex w-full items-center">
                <Button
                  variant="ghost"
                  className="relative z-10 h-8 p-0 before:absolute before:z-0 before:h-8 before:w-8 before:rounded-xl before:content-[''] hover:bg-transparent hover:text-neutral-200 before:hover:bg-neutral-700"
                  onClick={() => {
                    if (content === "status") setContent("detail");
                    if (content === "time") setContent("status");
                    if (content === "update") setContent("time");
                  }}
                >
                  <ArrowLeft size={20} className="z-10" />
                </Button>
                <DialogTitle className="w-full pe-6 text-center text-sm uppercase tracking-wide text-neutral-300">
                  Status
                </DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
          ) : null}
          <ChangeStatus
            type="desktop"
            date={date}
            content={content}
            setContent={setContent}
            medicine={medicine}
            transaction={transaction}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      onAnimationEnd={() => {
        setContent("detail");
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-fit w-full items-center justify-between rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700 hover:text-neutral-200"
        >
          <DetailMedicineTrigger date={date} medicine={medicine} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="border border-neutral-800 bg-neutral-800/60 text-neutral-200 backdrop-blur-md">
        {content === "detail" ? (
          <DrawerHeader className="text-left">
            <DrawerTitle>{medicine.name}</DrawerTitle>
            <DrawerDescription className="sr-only">
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
        ) : content === "status" ? (
          <DrawerHeader className="p-2 text-left">
            <div className="flex w-full items-center px-1">
              <Button
                variant="ghost"
                className="relative z-10 h-8 p-0 before:absolute before:z-0 before:h-8 before:w-8 before:rounded-xl before:content-[''] hover:bg-transparent hover:text-neutral-200 before:hover:bg-neutral-700"
                onClick={() => {
                  setContent("detail");
                }}
              >
                <ArrowLeft size={20} className="z-10" />
              </Button>
              <DrawerTitle className="w-full pe-8 text-center text-sm uppercase tracking-wide text-neutral-300">
                Status
              </DrawerTitle>
            </div>
            <DrawerDescription className="sr-only">
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
        ) : content === "time" ? (
          <DrawerHeader className="p-2 text-left">
            <div className="flex w-full items-center px-1">
              <Button
                variant="ghost"
                className="relative z-10 h-8 p-0 before:absolute before:z-0 before:h-8 before:w-8 before:rounded-xl before:content-[''] hover:bg-transparent hover:text-neutral-200 before:hover:bg-neutral-700"
                onClick={() => {
                  setContent("status");
                }}
              >
                <ArrowLeft size={20} className="z-10" />
              </Button>
              <DrawerTitle className="w-full pe-8 text-center text-sm uppercase tracking-wide text-neutral-300">
                Status
              </DrawerTitle>
            </div>
            <DrawerDescription className="sr-only">
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
        ) : content === "update" ? (
          <DrawerHeader className="p-2 text-left">
            <div className="flex w-full items-center px-1">
              <Button
                variant="ghost"
                className="relative z-10 h-8 p-0 before:absolute before:z-0 before:h-8 before:w-8 before:rounded-xl before:content-[''] hover:bg-transparent hover:text-neutral-200 before:hover:bg-neutral-700"
                onClick={() => {
                  setContent("time");
                }}
              >
                <ArrowLeft size={20} className="z-10" />
              </Button>
              <DrawerTitle className="w-full pe-8 text-center text-sm uppercase tracking-wide text-neutral-300">
                Status
              </DrawerTitle>
            </div>
            <DrawerDescription className="sr-only">
              Make changes to your profile here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
        ) : null}
        <ChangeStatus
          type="mobile"
          date={date}
          content={content}
          setContent={setContent}
          medicine={medicine}
          transaction={transaction}
        />
      </DrawerContent>
    </Drawer>
  );
}

function ChangeStatus({
  type,
  date,
  content,
  setContent,
  medicine,
  transaction,
}: {
  type: "desktop" | "mobile";
  date: string;
  content: "detail" | "status" | "time" | "update";
  setContent: React.Dispatch<
    React.SetStateAction<"detail" | "status" | "time" | "update">
  >;
  medicine: MedicineTransactionWithSchedule;
  transaction: TTransactionRecord;
}) {
  const FormSchema = z.object({
    time: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time: medicine.consumedAt[0] ?? "00:00",
    },
  });

  function handleSkipMedicine() {
    const updatedTransaction = {
      ...transaction,
      medications: transaction.medications.map((med) =>
        med.id === medicine.id
          ? {
              ...med,
              isSkip: true,
              consumedAt: [],
            }
          : med,
      ),
    };

    updateData(DB_NAME, TRANSACTION_STORE, updatedTransaction);

    setContent("detail");
  }

  function handleConsumeNowMedicine() {
    const updatedTransaction = {
      ...transaction,
      medications: transaction.medications.map((med) =>
        med.id === medicine.id
          ? {
              ...med,
              isSkip: false,
              consumedAt: [format(new Date(), "HH:mm")],
            }
          : med,
      ),
    };

    updateData(DB_NAME, TRANSACTION_STORE, updatedTransaction);

    setContent("detail");
  }

  function handleConsumeMedicineOnTime() {
    const updatedTransaction = {
      ...transaction,
      medications: transaction.medications.map((med) =>
        med.id === medicine.id
          ? {
              ...med,
              isSkip: false,
              consumedAt: [med.timeToConsume],
            }
          : med,
      ),
    };

    updateData(DB_NAME, TRANSACTION_STORE, updatedTransaction);

    setContent("detail");
  }

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const updatedTransaction = {
      ...transaction,
      medications: transaction.medications.map((med) =>
        med.id === medicine.id
          ? {
              ...med,
              isSkip: false,
              consumedAt: [data.time],
            }
          : med,
      ),
    };

    updateData(DB_NAME, TRANSACTION_STORE, updatedTransaction);

    setContent("detail");
  }

  switch (content) {
    case "detail":
      return (
        <>
          <section className={`${type === "mobile" && "p-4"} space-y-4 pt-2`}>
            <article className="rounded-xl bg-neutral-800 p-4">
              {medicine.instruction}
            </article>
            <article className="flex items-center justify-between rounded-xl bg-neutral-800 p-4">
              <h3>Date</h3>
              <p>{format(date, "dd/MM/yyyy")}</p>
            </article>
            <article className="flex flex-col rounded-xl bg-neutral-800">
              <div className="flex w-full items-center justify-between p-4">
                <h3>Dosage</h3>
                <p>
                  {medicine.dosage.qty} {medicine.dosage.form}
                </p>
              </div>
              <div className="h-[1px] w-full rounded-full bg-neutral-700"></div>
              <div className="flex w-full items-center justify-between p-4">
                <h3>Time</h3>
                <p>{medicine.timeToConsume}</p>
              </div>
            </article>
            <article className="flex flex-col overflow-hidden rounded-xl bg-neutral-800">
              <Button
                variant="ghost"
                onClick={() => {
                  setContent("status");
                }}
                className="flex min-h-fit cursor-pointer items-center justify-between rounded-none p-4 text-start font-normal hover:bg-neutral-700 hover:text-neutral-200"
              >
                <h3 className="w-full text-base font-normal">Status</h3>
                <p className="me-1 text-base text-neutral-400">
                  {medicine.isSkip
                    ? "Skipped"
                    : medicine.consumedAt.length > 0
                      ? "Consumed"
                      : "Not taken"}
                </p>
                <ChevronRight size={20} />
              </Button>
              <div className="h-[1px] w-full rounded-full bg-neutral-700"></div>
              <div className="flex w-full items-center justify-between p-4">
                <h3>Consumed at</h3>
                <p>{`${medicine.consumedAt[0] ?? "None"}`}</p>
              </div>
            </article>
          </section>
        </>
      );
    case "status":
      return (
        <>
          <section className={`${type === "mobile" && "p-4"} flex gap-2 pt-2`}>
            <Button
              onClick={() => {
                setContent("time");
              }}
              className={`flex h-fit w-full flex-col items-center gap-1 rounded-xl ${medicine.consumedAt.length > 0 && !medicine.isSkip ? "bg-neutral-200 p-4 text-neutral-800 hover:bg-neutral-300/90" : "bg-neutral-800 p-4 text-neutral-300 hover:bg-neutral-700/60"}`}
            >
              <Check size={24} className="h-6 w-6 shrink-0" />
              <p>Consumed</p>
            </Button>
            <Button
              onClick={handleSkipMedicine}
              className={`flex h-fit w-full flex-col items-center gap-1 rounded-xl ${medicine.isSkip ? "bg-neutral-200 p-4 text-neutral-800 hover:bg-neutral-300/90" : "bg-neutral-800 p-4 text-neutral-300 hover:bg-neutral-700/60"}`}
            >
              <X size={24} className="h-6 w-6 shrink-0" />
              <p>Skip</p>
            </Button>
          </section>
        </>
      );
    case "time":
      return (
        <>
          <section
            className={`${type === "mobile" && "p-4"} flex flex-col gap-2 pt-2`}
          >
            <p className="ms-2">When did you take your meds?</p>
            <Button
              onClick={handleConsumeNowMedicine}
              className="flex h-fit w-full flex-col items-center gap-1 rounded-xl bg-neutral-800 p-4 text-neutral-300 hover:bg-neutral-700/60"
            >
              <p>Now</p>
            </Button>
            <Button
              onClick={handleConsumeMedicineOnTime}
              className="flex h-fit w-full flex-col items-center gap-1 rounded-xl bg-neutral-800 p-4 text-neutral-300 hover:bg-neutral-700/60"
            >
              <p>On time ({medicine.timeToConsume})</p>
            </Button>
            <Button
              onClick={() => {
                setContent("update");
              }}
              className="flex h-fit w-full flex-col items-center gap-1 rounded-xl bg-neutral-800 p-4 text-neutral-300 hover:bg-neutral-700/60"
            >
              <p>Pick exact time</p>
            </Button>
          </section>
        </>
      );
    case "update":
      return (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={`${type === "mobile" && "p-4"} space-y-6 pt-2`}
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
        </>
      );
  }
}

const DetailMedicineTrigger = memo(
  ({ date, medicine }: { date: string; medicine: MedicineTransaction }) => {
    function getStatusIcon() {
      const isToday = date === getCurrentDate();

      if (medicine.consumedAt.length > 0) return <CheckIcon />;
      if (medicine.isSkip) return <XIcon />;
      if (isToday && !medicine.consumedAt.length)
        return <PreIcon type="history" />;
      return null;
    }

    return (
      <>
        <h3 className="text-base font-medium">{medicine.name}</h3>
        {getStatusIcon()}
      </>
    );
  },
);
