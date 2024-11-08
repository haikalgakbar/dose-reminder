import { cn } from "@/libs/util";
import { cva, type VariantProps } from "class-variance-authority";
import CalendarStatus from "@/components/calendar-status";

const calendarItemVariants = cva(
  "flex flex-1 flex-col items-center rounded-2xl p-2 bg-white/70",
  {
    variants: {
      variant: {
        default: "text-[#33302E]",
        active: "bg-[#1D1B1A] text-[#F8F4F2]",
        inactive: "text-[#AA9C87]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CalendarItemProps
  extends React.HtmlHTMLAttributes<"div">,
    VariantProps<typeof calendarItemVariants> {
  date: string;
  day: string;
  isComplete: boolean;
}

export default function CalendarItem({
  variant,
  date,
  day,
  isComplete,
  className,
}: CalendarItemProps) {
  return (
    <div className={cn(calendarItemVariants({ variant, className }))}>
      <p className="text-sm">{day}</p>
      <p className="text-xl font-medium">{date}</p>
      {isComplete && <CalendarStatus variant="skip" className="my-1" />}
    </div>
  );
}
