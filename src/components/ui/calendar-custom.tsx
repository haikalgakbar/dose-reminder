import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/libs/util";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("border-none", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-between pt-1 relative items-center",
        caption_label: "text-2xl font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full",
        ),
        // nav_button_previous: "absolute left-1",
        // nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex gap-1",
        head_cell:
          "text-[#D4D4D4] w-full font-normal text-sm bg-[#262626] rounded-full",
        row: "flex w-full mt-1 gap-1",
        cell: "w-full text-center text-sm p-0 relative [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-[#1D1B1A] focus-within:relative focus-within:z-20 rounded-xl aspect-square justify-center flex items-center",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-full p-0 font-normal aria-selected:opacity-100 aria-selected:bg-[#1D1B1A] bg-[#262626] rounded-xl hover:bg-[#262626]/60 hover:text-white",
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
