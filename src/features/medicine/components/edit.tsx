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
import { Pencil, Plus } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { TMedicine } from "@/types/medicine";
import { z } from "zod";
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
import { cn } from "@/libs/util";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateData } from "@/libs/db";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";

export default function EditMedication({
  medicine,
  setMedicine,
}: {
  medicine: TMedicine;
  setMedicine: React.Dispatch<React.SetStateAction<TMedicine | undefined>>;
}) {
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formSchema = z.object({
    name: z.string(),
    instruction: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: medicine.name,
      instruction: medicine.instruction,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedMedicine = {
      ...medicine,
      name: values.name,
      instruction: values.instruction,
    };
    updateData(DB_NAME, MEDICINE_STORE, updatedMedicine);
    setMedicine(updatedMedicine);
    setOpen((prev) => !prev);
  }

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
        <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
          <Pencil className="h-5 w-5 shrink-0" />
          <h3>Edit</h3>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle className="sr-only w-full text-center text-base uppercase text-[#A3A3A3]">
          Change start date
        </DrawerTitle>
        <DialogDescription className="sr-only">
          Change start date
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn("space-y-4 p-4")}
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
            <Button
              type="submit"
              className="w-full bg-neutral-100 text-neutral-800 hover:bg-neutral-300"
            >
              Update
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
