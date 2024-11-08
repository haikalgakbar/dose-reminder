import { getCurrentDate, getDaysOfInterval } from "@/libs/util";
import { endOfISOWeek, format, startOfISOWeek } from "date-fns";
import CalendarItem from "./calendar-item";

export default function WeeklyCalendar() {
  const currentMonth = format(getCurrentDate(), "MMMM, yyyy").split(",");
  const getCurrentWeek = getDaysOfInterval(
    startOfISOWeek(getCurrentDate()).toISOString(),
    endOfISOWeek(getCurrentDate()).toISOString(),
  );

  return (
    <section className="flex flex-col gap-2 p-4">
      <h2 className="text-2xl font-medium">
        {currentMonth[0]}{" "}
        <span className="text-slate-600">{currentMonth[1]}</span>
      </h2>
      <div className="flex gap-2">
        {getCurrentWeek.map((week, index) =>
          week.toISOString() === getCurrentDate() ? (
            <CalendarItem
              key={index}
              day={format(week, "iii")}
              date={format(week, "dd")}
              isComplete={true}
              variant="active"
            />
          ) : (
            <CalendarItem
              key={index}
              day={format(week, "iii")}
              date={format(week, "dd")}
              isComplete={true}
              variant="inactive"
            />
          ),
        )}
      </div>
    </section>
  );
}
