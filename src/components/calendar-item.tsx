import { cn } from "../libs/util";
import { cva, type VariantProps } from "class-variance-authority";
import { format } from "date-fns";
import { Check } from "lucide-react";

const calendarItemVariants = cva(
  "relative flex justify-center items-center w-full aspect-square rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-slate-200",
        active: "bg-blue-500 text-slate-50",
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
  week: string;
  isComplete: boolean;
  isToday: boolean;
}

export default function CalendarItem({
  variant,
  week,
  isComplete,
  isToday,
  className,
}: CalendarItemProps) {
  return (
    <div className={cn(calendarItemVariants({ variant, className }))}>
      <p className="text-xl font-medium">{format(week, "dd")}</p>
      {isComplete ? (
        <div
          className={`absolute -bottom-3 left-1/2 translate-x-[-50%] rounded-full bg-blue-500 p-1 ${isToday && `border-2 border-slate-50`}`}
        >
          <Check size={18} className="text-slate-50" strokeWidth={1.75} />
        </div>
      ) : null}
    </div>
  );
}
