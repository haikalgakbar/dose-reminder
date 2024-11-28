import { getCurrentDate, getDaysOfInterval } from "@/libs/util";
import { endOfISOWeek, format, startOfISOWeek } from "date-fns";
import { Check, X } from "lucide-react";
import { cn } from "@/libs/util";
import { cva, type VariantProps } from "class-variance-authority";

type CalendarItemStatus =
  | "complete"
  | "incomplete"
  | "empty"
  | "progress"
  | "future";

export default function Header() {
  const currentMonth = format(getCurrentDate(), "MMM, yyyy").split(",");
  const getCurrentWeek = getDaysOfInterval(
    startOfISOWeek(getCurrentDate()).toISOString(),
    endOfISOWeek(getCurrentDate()).toISOString(),
  );

  return (
    <header className="flex select-none flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-[#F5F5F5]">Daily check</h2>
        <span className="text-[#D4D4D4]">{currentMonth}</span>
      </div>
      <div className="flex gap-2">
        {getCurrentWeek.map((week, index) =>
          week.toISOString() === getCurrentDate() ? (
            <CalendarItem
              key={index}
              day={format(week, "EEEEEE")}
              date={format(week, "dd")}
              isComplete={true}
              status="complete"
              variant="active"
            />
          ) : (
            <CalendarItem
              key={index}
              day={format(week, "EEEEEE")}
              date={format(week, "dd")}
              isComplete={true}
              status="future"
            />
          ),
        )}
      </div>
    </header>
  );
}



const calendarItemVariants = cva(
  "flex flex-1 flex-col items-center rounded-2xl p-2",
  {
    variants: {
      variant: {
        default: "text-[#F5F5F5]",
        active: "text-[#F5F5F5] bg-[#262626]",
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
  status: CalendarItemStatus;
  isComplete: boolean;
}

function CalendarItem({
  variant,
  date,
  day,
  status,
  className,
}: CalendarItemProps) {
  return (
    <div className={cn(calendarItemVariants({ variant, className }))}>
      <p className="text-sm text-[#D4D4D4]">{day}</p>
      <p className="text-xl font-medium text-[#F5F5F5]">{date}</p>
      <CalendarStatus status={status} />
    </div>
  );
}

function CalendarStatus({ status }: { status: CalendarItemStatus }) {
  switch (status) {
    case "complete":
      return (
        <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
          <Check size={16} className="text-[#262626]" />
        </span>
      );
    case "incomplete":
      return (
        <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
          <X size={16} className="text-[#262626]" />
        </span>
      );
    case "empty":
      return (
        <span className="my-1 h-6 w-6 rounded-full border border-[#f5f5f5]"></span>
      );
    case "progress":
      return (
        <span className="my-1 h-6 w-6 rounded-full border border-dashed border-[#f5f5f5]"></span>
      );
    case "future":
      return <span className="my-1 h-6 w-6 rounded-full bg-[#A3A3A3]"></span>;
    default:
      throw new Error(`Unknown status: ${status}`);
  }
}
