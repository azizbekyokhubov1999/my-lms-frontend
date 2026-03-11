"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

const EXAM_BOOKING_KEY = "admission_exam_booking";
const SCHEDULED_EXAM_ID_KEY = "scheduled_exam_id";

const EXAM_RULES = [
  "No external devices (phones, notes, second screens).",
  "Stay in camera view for the duration of the exam.",
  "Do not open secondary tabs or leave the exam window.",
  "Your session is recorded for academic integrity.",
  "Ensure stable internet and a quiet environment.",
];

interface ExamSlot {
  slotId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  proctoring: "Required";
  location: string;
  availableSeats: number;
}

function buildMockSlots(): ExamSlot[] {
  const slots: ExamSlot[] = [];
  const today = new Date();
  const times = ["09:00", "14:00", "18:00"];
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    times.forEach((time, t) => {
      slots.push({
        slotId: `slot-${dateStr}-${time.replace(":", "")}`,
        date: dateStr,
        time,
        durationMinutes: 60,
        proctoring: "Required",
        location: "Online",
        availableSeats: 10 - t,
      });
    });
  }
  return slots;
}

const MOCK_SLOTS = buildMockSlots();

function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

function formatSlotDate(dateStr: string): string {
  const d = new Date(dateStr + "Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExamSchedulePage() {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = React.useState<ExamSlot | null>(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [monthOffset, setMonthOffset] = React.useState(0);

  const slotsByDate = React.useMemo(() => {
    const map = new Map<string, ExamSlot[]>();
    MOCK_SLOTS.forEach((slot) => {
      const list = map.get(slot.date) ?? [];
      list.push(slot);
      map.set(slot.date, list);
    });
    map.forEach((list) => list.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, []);

  const calendarStart = React.useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [monthOffset]);

  const calendarDays = React.useMemo(() => {
    const year = calendarStart.getFullYear();
    const month = calendarStart.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const days: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) {
      days.push(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return days;
  }, [calendarStart]);

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    try {
      const booking = {
        slotId: selectedSlot.slotId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        durationMinutes: selectedSlot.durationMinutes,
        proctoring: selectedSlot.proctoring,
        location: selectedSlot.location,
        bookedAt: new Date().toISOString(),
      };
      localStorage.setItem(EXAM_BOOKING_KEY, JSON.stringify(booking));
      localStorage.setItem(SCHEDULED_EXAM_ID_KEY, selectedSlot.slotId);
    } catch {
      /* ignore */
    }
    setConfirmOpen(false);
    setSelectedSlot(null);
    router.push("/admission/status");
  };

  return (
    <div className="min-h-[calc(100vh-52px)] bg-slate-50 px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href="/admission/status"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Overview
          </Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Schedule your entrance exam
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose a date and time. Duration: 60 min. Proctoring is required.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
          {/* Calendar */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-slate-900">
                Available slots
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMonthOffset((m) => m - 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  ←
                </button>
                <span className="min-w-[140px] text-center text-sm font-medium text-slate-800">
                  {calendarStart.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  type="button"
                  onClick={() => setMonthOffset((m) => m + 1)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {calendarDays.map((dayStr, i) => {
                if (!dayStr) {
                  return <div key={`empty-${i}`} />;
                }
                const daySlots = slotsByDate.get(dayStr) ?? [];
                const hasSlots = daySlots.length > 0;
                const isSelected =
                  selectedSlot?.date === dayStr;
                return (
                  <div key={dayStr} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() =>
                        hasSlots && setSelectedSlot(daySlots[0])
                      }
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors",
                        hasSlots
                          ? "bg-blue-50 text-blue-900 hover:bg-blue-100"
                          : "text-slate-300",
                        isSelected && "ring-2 ring-blue-900 ring-offset-2"
                      )}
                    >
                      {new Date(dayStr + "Z").getDate()}
                    </button>
                    {hasSlots && (
                      <span className="mt-0.5 text-[10px] text-slate-500">
                        {daySlots.length}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* List of times for selected date */}
            {selectedSlot && (
              <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Times on {formatSlotDate(selectedSlot.date)}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {(slotsByDate.get(selectedSlot.date) ?? []).map((slot) => (
                    <li key={slot.slotId}>
                      <button
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          selectedSlot.slotId === slot.slotId
                            ? "border-blue-900 bg-blue-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        )}
                      >
                        {slot.time}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Slot details */}
          <div>
            <Card className="sticky top-24 border-blue-100 bg-blue-50/30">
              {selectedSlot ? (
                <>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Slot details
                  </h3>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="text-slate-500">Date</dt>
                      <dd className="font-medium text-slate-900">
                        {formatSlotDate(selectedSlot.date)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Time</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedSlot.time}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Duration</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedSlot.durationMinutes} min
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Proctoring</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedSlot.proctoring}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Location</dt>
                      <dd className="font-medium text-slate-900">
                        {selectedSlot.location}
                      </dd>
                    </div>
                  </dl>
                  <Button
                    type="button"
                    variant="primary"
                    className="mt-6 w-full"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Book this slot
                  </Button>
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Click a date with available slots, then choose a time.
                </p>
              )}
            </Card>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link
            href="/admission/exams/check"
            className="font-medium text-blue-900 hover:underline"
          >
            Already scheduled? Go to Technical Pre-check →
          </Link>
        </p>
      </div>

      {/* Confirmation modal */}
      {confirmOpen && selectedSlot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-booking-title"
        >
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
              <h2
                id="confirm-booking-title"
                className="text-lg font-semibold text-slate-900"
              >
                Confirm booking
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {formatSlotDate(selectedSlot.date)} at {selectedSlot.time} · 60
                min · Proctoring required
              </p>
            </div>
            <div className="max-h-[50vh] overflow-y-auto px-4 py-4 sm:px-6">
              <h3 className="text-sm font-semibold text-slate-800">
                Exam rules
              </h3>
              <ul className="mt-2 space-y-2">
                {EXAM_RULES.map((rule, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-slate-700"
                  >
                    <span className="text-blue-900">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-4 py-4 sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmBooking}
              >
                Confirm booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
