import { Check, X } from "lucide-react";

export interface CalendarStatusProps {
  type: "check" | "uncheck" | "pre" | "empty";
}

export function CheckIcon() {
  return (
    <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
      <Check size={16} className="text-[#262626]" />
    </span>
  );
}

export function XIcon() {
  return (
    <span className="my-1 rounded-full bg-[#F5F5F5] p-1">
      <X size={16} className="text-[#262626]" />
    </span>
  );
}

export function PreIcon({ type }: { type: "home" | "history" }) {
  return (
    <span
      className={`my-1 ${type === "history" ? "h-4 w-4" : "h-6 w-6"} rounded-full border border-dashed border-[#f5f5f5]`}
    />
  );
}

export function EmptyIcon({ type }: { type: "home" | "history" }) {
  return (
    <span
      className={`${type === "history" ? "h-4 w-4" : "h-6 w-6"} my-1 rounded-full border border-neutral-700`}
    />
  );
}

export function FutureIcon({ type }: { type: "home" | "history" }) {
  return (
    <span
      className={`${type === "history" ? "h-4 w-4" : "h-6 w-6"} my-1 rounded-full bg-neutral-800`}
    />
  );
}
