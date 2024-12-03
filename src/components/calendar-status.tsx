import { Check, X } from "lucide-react";
import { cn } from "@/libs/util";

export interface CalendarStatusProps {
  type: "check" | "uncheck" | "pre" | "empty";
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
      <Check size={16} className="text-[#262626]" />
    </span>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
      <X size={16} className="text-[#262626]" />
    </span>
  );
}

export function PreIcon({ className }: { className?: string }) {
  return (
    <span className="my-1 h-6 w-6 rounded-full border border-dashed border-[#f5f5f5]" />
  );
}

export function EmptyIcon({ className }: { className?: string }) {
  return (
    <span className="my-1 h-6 w-6 rounded-full border border-neutral-700" />
  );
}

export function FutureIcon({ className }: { className?: string }) {
  return <span className="my-1 h-6 w-6 rounded-full bg-neutral-800" />;
}
