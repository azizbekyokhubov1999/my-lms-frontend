"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function AlertIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

type ConflictType = "overlap" | "room_double" | "teacher";

interface Conflict {
  id: string;
  type: ConflictType;
  title: string;
  detail: string;
  date: string;
  slot: string;
  involved: string[];
}

const MOCK_CONFLICTS: Conflict[] = [
  { id: "cf1", type: "overlap", title: "Overlapping classes", detail: "SD-24-01 and CS-23-01 both scheduled 09:00–10:30 in same room.", date: "2026-03-06", slot: "09:00", involved: ["SD-24-01 · CS101", "CS-23-01 · Algorithms", "Room A101"] },
  { id: "cf2", type: "room_double", title: "Room double-booking", detail: "Room B202 booked for SD-24-01 (SE201) and MBA-24-A (Strategy) at 10:45.", date: "2026-03-06", slot: "10:45", involved: ["B202", "SD-24-01", "MBA-24-A"] },
  { id: "cf3", type: "teacher", title: "Teacher availability", detail: "Dr. Sokolova assigned to two classes at 14:00: A102 (SD-24-02) and B201 (CS-23-01).", date: "2026-03-06", slot: "14:00", involved: ["Dr. Sokolova", "A102", "B201"] },
];

const TYPE_LABELS: Record<ConflictType, string> = {
  overlap: "Overlap",
  room_double: "Room double-book",
  teacher: "Teacher conflict",
};

export default function ScheduleConflictsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/schedules" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Schedules
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Schedule conflicts</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Overlapping classes, room double-bookings, and teacher availability issues. Resolve or add overrides.
        </p>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto rounded-lg border-2 border-amber-200 bg-amber-50/30">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-amber-300 bg-amber-100">
                <th className="w-10 px-4 py-3 text-left font-medium text-amber-900"></th>
                <th className="px-4 py-3 text-left font-medium text-amber-900">Type</th>
                <th className="px-4 py-3 text-left font-medium text-amber-900">Summary</th>
                <th className="px-4 py-3 text-left font-medium text-amber-900">Date / Time</th>
                <th className="px-4 py-3 text-left font-medium text-amber-900">Involved</th>
                <th className="w-24 px-4 py-3 text-right font-medium text-amber-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-200">
              {MOCK_CONFLICTS.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No conflicts.
                  </td>
                </tr>
              ) : (
                MOCK_CONFLICTS.map((c) => (
                  <tr key={c.id} className="bg-white hover:bg-amber-50/50">
                    <td className="px-4 py-3 text-amber-600">
                      <AlertIcon />
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                        {TYPE_LABELS[c.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-amber-900">{c.title}</p>
                      <p className="mt-0.5 text-xs text-amber-800/90">{c.detail}</p>
                    </td>
                    <td className="px-4 py-3 text-amber-900">{c.date} · {c.slot}</td>
                    <td className="px-4 py-3 text-xs text-amber-900">{c.involved.join("; ")}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href="/academic/schedules/overrides"
                        className="text-sm font-medium text-amber-700 hover:underline"
                      >
                        Resolve
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
