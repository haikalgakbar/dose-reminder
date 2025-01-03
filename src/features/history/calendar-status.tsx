import { TTransactionRecord } from "@/types/transaction";
import {
  CheckIcon,
  EmptyIcon,
  XIcon,
  PreIcon,
  CalendarStatusProps,
} from "@/components/calendar-status";

interface CalendarItemProps {
  transaction: TTransactionRecord | undefined;
}

function CalendarStatus({ type }: CalendarStatusProps) {
  const statusMap = {
    check: CheckIcon,
    uncheck: XIcon,
    pre: PreIcon,
    empty: EmptyIcon,
  };

  const StatusComponent = statusMap[type];
  return StatusComponent ? <StatusComponent type="history" /> : null;
}

function getCalendarType(transaction: TTransactionRecord | undefined) {
  if (!transaction) return "empty";

  if (transaction.consumedMedications === transaction.medicationsToBeConsumed)
    return "check";
  if (transaction.skippedMedications > 0) return "uncheck";
  if (transaction.totalMedications === 0) return "empty";
  if (transaction.totalMedications > 0) return "pre";
  return "empty";
}

export function CalendarItem({ transaction }: CalendarItemProps) {
  return <CalendarStatus type={getCalendarType(transaction)} />;
}
