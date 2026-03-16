'use client';

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

type DayEventType = "class" | "exam" | "holiday";

interface DayEvent {
  id: string;
  type: DayEventType;
  label: string;
}

interface CalendarDay {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  events: DayEvent[];
}

const MOCK_DAYS: CalendarDay[] = [
  { date: "2026-03-01", dayOfMonth: 1, isCurrentMonth: true, events: [] },
  { date: "2026-03-02", dayOfMonth: 2, isCurrentMonth: true, events: [] },
  { date: "2026-03-03", dayOfMonth: 3, isCurrentMonth: true, events: [] },
  { date: "2026-03-04", dayOfMonth: 4, isCurrentMonth: true, events: [] },
  {
    date: "2026-03-05",
    dayOfMonth: 5,
    isCurrentMonth: true,
    isToday: true,
    events: [
      { id: "e1", type: "class", label: "Spring semester – Week 5" },
      { id: "e2", type: "exam", label: "Midterm: BSc Software Development" },
    ],
  },
  {
    date: "2026-03-06",
    dayOfMonth: 6,
    isCurrentMonth: true,
    events: [{ id: "e3", type: "holiday", label: "University holiday" }],
  },
  // ...fill remaining days with simple placeholders
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function eventBadgeColor(type: DayEventType) {
  switch (type) {
    case "class":
      return "bg-sky-100 text-sky-700";
    case "exam":
      return "bg-rose-100 text-rose-700";
    case "holiday":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AcademicCalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<CalendarDay | null>(
    () => MOCK_DAYS.find((d) => d.isToday) ?? MOCK_DAYS[0] ?? null,
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/dashboard" className="text-sm font-medium text-slate-200 hover:text-white">
            ← Dashboard
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Academic Calendar</h1>
          <p className="mt-0.5 text-sm text-slate-600">
            Month view of teaching weeks, holidays, and exam periods.
          </p>
        </div>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="flex flex-col bg-white/80 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">March 2026</h2>
              <p className="text-xs text-slate-500">Tap a day to view events.</p>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-xs font-medium text-slate-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="px-2 py-1 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="mt-1 grid flex-1 grid-cols-7 gap-1 text-xs">
            {MOCK_DAYS.map((day) => {
              const isSelected = selectedDate?.date === day.date;
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex min-h-[72px] flex-col rounded-md border px-2 py-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
                    day.isCurrentMonth ? "bg-white" : "bg-slate-50 text-slate-400",
                    day.isToday && "border-purple-500",
                    isSelected && "border-purple-600 bg-purple-50",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      day.isToday ? "bg-purple-600 text-white" : "text-slate-700",
                    )}
                  >
                    {day.dayOfMonth}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {day.events.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          "block truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          eventBadgeColor(e.type),
                        )}
                      >
                        {e.label}
                      </span>
                    ))}
                    {day.events.length > 2 && (
                      <span className="block truncate text-[10px] text-slate-500">
                        +{day.events.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="flex flex-col bg-white/80 p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Day details</h2>
          {selectedDate ? (
            <>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {selectedDate.date} · Day {selectedDate.dayOfMonth}
              </p>
              <div className="mt-3 space-y-2">
                {selectedDate.events.length === 0 ? (
                  <p className="text-sm text-slate-500">No scheduled events for this day.</p>
                ) : (
                  selectedDate.events.map((e) => (
                    <div
                      key={e.id}
                      className={cn(
                        "rounded-md border px-3 py-2 text-sm",
                        e.type === "exam"
                          ? "border-rose-200 bg-rose-50/60"
                          : e.type === "holiday"
                          ? "border-emerald-200 bg-emerald-50/60"
                          : "border-sky-200 bg-sky-50/60",
                      )}
                    >
                      <p className="font-medium text-slate-900">{e.label}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {e.type === "exam"
                          ? "Exam period / assessment"
                          : e.type === "holiday"
                          ? "Institution-wide holiday or break"
                          : "Teaching / learning activity"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Select a day in the calendar to see details.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

