import { cn } from "@/libs/util";
import { cva, type VariantProps } from "class-variance-authority";

const calendarStatusVariants = cva("h-[0.375rem] w-[0.375rem] rounded-full", {
  variants: {
    variant: {
      inactive: "bg-[#AA9C87]",
      active: "bg-[#FFD2A7]",
      partial: "bg-none border border-[#FFD2A7]",
      skip: "bg-[#E3B5FA]",
    },
  },
});

export interface CalendarStatusProps
  extends React.HtmlHTMLAttributes<"div">,
    VariantProps<typeof calendarStatusVariants> {}

export default function CalendarStatus({
  variant,
  className,
  ...props
}: CalendarStatusProps) {
  return (
    <div
      className={cn(calendarStatusVariants({ variant, className }), {
        ...props,
      })}
    ></div>
  );
}
