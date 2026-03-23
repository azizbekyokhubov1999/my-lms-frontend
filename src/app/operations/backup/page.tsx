"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "../../components/ui/Card";

type Recurrence = "one-time" | "weekly";

type ScheduledBackup = {
  id: string;
  dayISO: string; // date only in local time
  time: string; // HH:mm
  recurrence: Recurrence;
  retentionDays: number;
  cron: string;
  status: "Scheduled" | "Completed";
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalDateISO(d: Date) {
  // Date-only ISO string in local time (YYYY-MM-DD).
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dayOfWeekCronValue(d: Date) {
  // JS: 0=Sun..6=Sat; cron: 0=Sun..6=Sat
  return d.getDay();
}

function buildCron({
  dayLocalISO,
  time,
  recurrence,
}: {
  dayLocalISO: string;
  time: string;
  recurrence: Recurrence;
}) {
  const [hh, mm] = time.split(":").map((x) => Number(x));
  if (recurrence === "weekly") {
    const [yyyy, m, dd] = dayLocalISO.split("-").map((x) => Number(x));
    const d = new Date(yyyy, m - 1, dd);
    const dow = dayOfWeekCronValue(d);
    // minute hour * * dow
    return `${mm} ${hh} * * ${dow}`;
  }

  // One-time: minute hour day month *
  const [yyyy, m, dd] = dayLocalISO.split("-").map((x) => Number(x));
  return `${mm} ${hh} ${dd} ${m} *`;
}

function generateCalendarMonth(monthCursor: Date) {
  const year = monthCursor.getFullYear();
  const monthIndex = monthCursor.getMonth();

  const first = new Date(year, monthIndex, 1);
  const firstWeekday = first.getDay(); // 0..6
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ date: null });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, monthIndex, day) });
  }
  while (cells.length % 7 !== 0) cells.push({ date: null });

  return cells;
}

function randomId(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
}

export default function BackupSchedulePage() {
  const now = new Date();
  const [monthCursor, setMonthCursor] = React.useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selectedDayISO, setSelectedDayISO] = React.useState<string>(() =>
    toLocalDateISO(now),
  );
  const [time, setTime] = React.useState("02:00");
  const [recurrence, setRecurrence] = React.useState<Recurrence>("weekly");
  const [retentionDays, setRetentionDays] = React.useState(35);

  const [scheduled, setScheduled] = React.useState<ScheduledBackup[]>(() => [
    {
      id: "b-1",
      dayISO: toLocalDateISO(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)),
      time: "02:00",
      recurrence: "weekly",
      retentionDays: 30,
      cron: "0 2 * * 0",
      status: "Scheduled",
    },
    {
      id: "b-2",
      dayISO: toLocalDateISO(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 9)),
      time: "02:00",
      recurrence: "weekly",
      retentionDays: 30,
      cron: "0 2 * * 0",
      status: "Completed",
    },
  ]);

  const calendarCells = React.useMemo(
    () => generateCalendarMonth(monthCursor),
    [monthCursor],
  );

  const selectedDate = React.useMemo(() => {
    const [y, m, d] = selectedDayISO.split("-").map((x) => Number(x));
    return new Date(y, m - 1, d);
  }, [selectedDayISO]);

  const cronPreview = React.useMemo(() => {
    return buildCron({ dayLocalISO: selectedDayISO, time, recurrence });
  }, [recurrence, selectedDayISO, time]);

  const scheduleBackup = React.useCallback(() => {
    const id = randomId("b");
    const next: ScheduledBackup = {
      id,
      dayISO: selectedDayISO,
      time,
      recurrence,
      retentionDays,
      cron: cronPreview,
      status: "Scheduled",
    };
    setScheduled((prev) => [next, ...prev].slice(0, 50));
  }, [cronPreview, recurrence, retentionDays, selectedDayISO, time]);

  const monthLabel = monthCursor.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">Backup Schedule</h1>
          <p className="mt-1 text-sm text-slate-100/70">
            Calendar-based scheduling for automated backups.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/operations/backup/restore"
            className="inline-flex items-center justify-center rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
          >
            Restore Now
          </Link>
          <p className="text-xs text-slate-100/50">
            Restore wizard available in the next page.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-100">{monthLabel}</p>
              <p className="mt-1 text-xs text-slate-100/60">
                Select a day for the next backup run.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setMonthCursor(
                    (d) => new Date(d.getFullYear(), d.getMonth() - 1, 1),
                  )
                }
                className="rounded-lg border border-indigo-400/30 bg-slate-900/30 px-3 py-2 text-sm text-slate-100/80 transition-colors hover:bg-indigo-400/10"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() =>
                  setMonthCursor(
                    (d) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
                  )
                }
                className="rounded-lg border border-indigo-400/30 bg-slate-900/30 px-3 py-2 text-sm text-slate-100/80 transition-colors hover:bg-indigo-400/10"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-100/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-2 text-center">
            {calendarCells.map((cell, idx) => {
              const date = cell.date;
              if (!date) {
                return <div key={`empty-${idx}`} className="h-10 rounded-md bg-slate-950" />;
              }

              const iso = toLocalDateISO(date);
              const isSelected = iso === selectedDayISO;
              const isToday = iso === toLocalDateISO(now);

              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedDayISO(iso)}
                  className={[
                    "h-10 rounded-lg border px-1 text-sm transition-colors",
                    isSelected
                      ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                      : "border-indigo-400/20 bg-slate-900/20 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/40",
                    isToday && !isSelected ? "ring-1 ring-indigo-400/60" : "",
                  ].join(" ")}
                >
                  <span className="leading-10">{date.getDate()}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">Schedule Settings</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Configure the next automated backup.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as Recurrence)}
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              >
                <option value="one-time">One-time</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Retention (days)
              </label>
              <input
                type="number"
                min={1}
                value={retentionDays}
                onChange={(e) => setRetentionDays(Math.max(1, Number(e.target.value)))}
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Cron Preview
              </p>
              <div className="mt-2 rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-3 font-mono text-sm text-slate-100/80">
                {cronPreview}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={scheduleBackup}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Schedule Backup
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-indigo-400/20 bg-indigo-400/5 p-4 text-xs text-slate-100/70">
            Selected:{" "}
            <span className="font-semibold text-slate-100">
              {selectedDate.toLocaleDateString([], { weekday: "short", month: "short", day: "2-digit" })}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-slate-100">{time}</span>
          </div>
        </Card>
      </div>

      <Card className="border-indigo-400/30 bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Scheduled Backups</h2>
            <p className="mt-1 text-xs text-slate-100/60">
              Most recent schedules appear first.
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-400/20">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-slate-100/60">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Recurrence</th>
                <th className="px-4 py-3">Retention</th>
                <th className="px-4 py-3">Cron</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.map((s) => (
                <tr key={s.id} className="border-t border-indigo-400/20">
                  <td className="px-4 py-3 text-slate-100/80">{s.dayISO}</td>
                  <td className="px-4 py-3 text-slate-100/80">{s.time}</td>
                  <td className="px-4 py-3 text-slate-100/70">{s.recurrence}</td>
                  <td className="px-4 py-3 text-slate-100/70">{s.retentionDays}d</td>
                  <td className="px-4 py-3 font-mono text-slate-100/70">{s.cron}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        s.status === "Completed"
                          ? "border-indigo-400/40 bg-indigo-400/10 text-indigo-100"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-100"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {scheduled.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-slate-100/70">
                    No scheduled backups yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

