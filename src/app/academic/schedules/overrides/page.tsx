"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const MOCK_CLASSES = [
  { id: "c1", label: "SD-24-01 · CS101 · Mon 09:00 · A101" },
  { id: "c2", label: "CS-23-01 · SE201 · Tue 10:45 · B202" },
  { id: "c3", label: "MBA-24-A · Strategy · Wed 14:00 · C301" },
];

export default function ScheduleOverridesPage() {
  const router = useRouter();
  const [classId, setClassId] = React.useState("");
  const [newTime, setNewTime] = React.useState("");
  const [newRoom, setNewRoom] = React.useState("");
  const [reason, setReason] = React.useState("");

  const canSubmit = classId && (newTime.trim() || newRoom.trim()) && reason.trim().length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const c = MOCK_CLASSES.find((x) => x.id === classId);
    alert(`Override applied (Demo): ${c?.label}. New time: ${newTime || "—"}, New room: ${newRoom || "—"}. Reason: ${reason}`);
    router.push("/academic/schedules");
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/schedules" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Schedules
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Schedule overrides</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Manually change a class time or room. Overrides synced data. Reason is required for audit.
        </p>
      </div>

      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-800">Class to override</label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option value="">— Select class —</option>
              {MOCK_CLASSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="New time (optional)"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="e.g. 14:00–15:30"
              className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
            <Input
              label="New room (optional)"
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="e.g. A205"
              className="focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800">
              Reason <span className="text-rose-600">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={10}
              rows={3}
              placeholder="e.g. Room A101 under maintenance. Moved to A205 for one week."
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
            <p className="mt-0.5 text-xs text-slate-500">Minimum 10 characters. Stored for audit.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link href="/academic/schedules">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
              disabled={!canSubmit}
            >
              Apply override
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
