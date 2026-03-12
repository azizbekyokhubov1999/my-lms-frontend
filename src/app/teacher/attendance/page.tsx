"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AttendanceStatus = "Present" | "Absent" | "Excused" | "Late" | "—";

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Excused", "Late", "—"];

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

const GROUPS: Record<string, { id: string; name: string }[]> = {
  "1": [
    { id: "g1a", name: "Section A" },
    { id: "g1b", name: "Section B" },
  ],
  "2": [
    { id: "g2a", name: "Section A" },
    { id: "g2b", name: "Section B" },
  ],
  "3": [
    { id: "g3a", name: "Section A" },
  ],
};

const LECTURE_DATES = ["Mar 3", "Mar 4", "Mar 5", "Mar 6", "Mar 10"];

interface AttendanceCell {
  status: AttendanceStatus;
  comment?: string;
}

const ATTENDANCE: Record<string, Record<string, Record<string, AttendanceCell>>> = {
  "1": {
    g1a: {
      "st1:Mar3": { status: "Present" },
      "st1:Mar4": { status: "Present" },
      "st1:Mar5": { status: "Absent", comment: "Medical appointment" },
      "st1:Mar6": { status: "Present" },
      "st1:Mar10": { status: "—" },
      "st2:Mar3": { status: "Present" },
      "st2:Mar4": { status: "Late", comment: "Arrived 15 min late" },
      "st2:Mar5": { status: "Present" },
      "st2:Mar6": { status: "Excused", comment: "Family emergency" },
      "st2:Mar10": { status: "—" },
      "st6:Mar3": { status: "Present" },
      "st6:Mar4": { status: "Present" },
      "st6:Mar5": { status: "Present" },
      "st6:Mar6": { status: "—" },
      "st6:Mar10": { status: "—" },
      "st7:Mar3": { status: "Absent" },
      "st7:Mar4": { status: "Present" },
      "st7:Mar5": { status: "Present" },
      "st7:Mar6": { status: "Present" },
      "st7:Mar10": { status: "—" },
    },
    g1b: {
      "st4:Mar3": { status: "Present" },
      "st4:Mar4": { status: "Absent" },
      "st4:Mar5": { status: "Present" },
      "st4:Mar6": { status: "—" },
      "st4:Mar10": { status: "—" },
    },
  },
  "2": {
    g2a: {
      "st3:Mar3": { status: "Present" },
      "st3:Mar4": { status: "Excused", comment: "Conference" },
      "st3:Mar5": { status: "Present" },
      "st3:Mar6": { status: "Present" },
      "st3:Mar10": { status: "—" },
      "st8:Mar3": { status: "Late" },
      "st8:Mar4": { status: "Present" },
      "st8:Mar5": { status: "Absent" },
      "st8:Mar6": { status: "Present" },
      "st8:Mar10": { status: "—" },
    },
  },
  "3": {
    g3a: {
      "st5:Mar3": { status: "Present" },
      "st5:Mar4": { status: "Present" },
      "st5:Mar5": { status: "Late" },
      "st5:Mar6": { status: "Present" },
      "st5:Mar10": { status: "—" },
    },
  },
};

const STUDENTS: Record<string, { id: string; name: string }[]> = {
  g1a: [
    { id: "st1", name: "Alex Johnson" },
    { id: "st2", name: "Jordan Lee" },
    { id: "st6", name: "Casey Brown" },
    { id: "st7", name: "Taylor Wong" },
  ],
  g1b: [
    { id: "st4", name: "Riley Davis" },
  ],
  g2a: [
    { id: "st3", name: "Sam Chen" },
    { id: "st8", name: "Jamie Park" },
  ],
  g2b: [],
  g3a: [
    { id: "st5", name: "Morgan Kim" },
  ],
};

function getCellKey(studentId: string, date: string): string {
  return `${studentId}:${date}`;
}

function statusStyles(s: AttendanceStatus): string {
  switch (s) {
    case "Present": return "bg-emerald-100 text-emerald-800";
    case "Absent": return "bg-red-100 text-red-800";
    case "Excused": return "bg-amber-100 text-amber-800";
    case "Late": return "bg-sky-100 text-sky-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

export default function TeacherAttendancePage() {
  const [courseId, setCourseId] = React.useState("1");
  const groups = GROUPS[courseId] ?? [];
  const [groupId, setGroupId] = React.useState(groups[0]?.id ?? "");
  const [overrideCell, setOverrideCell] = React.useState<{ studentId: string; date: string } | null>(null);
  const [overrideStatus, setOverrideStatus] = React.useState<AttendanceStatus>("Excused");
  const [overrideComment, setOverrideComment] = React.useState("");
  const [cells, setCells] = React.useState<Record<string, AttendanceCell>>(() => {
    const data = ATTENDANCE[courseId]?.[groupId] ?? {};
    return { ...data };
  });

  React.useEffect(() => {
    const nextGroups = GROUPS[courseId] ?? [];
    const validGroupId = nextGroups.some((g) => g.id === groupId) ? groupId : nextGroups[0]?.id ?? "";
    if (validGroupId !== groupId) setGroupId(validGroupId);
    const data = ATTENDANCE[courseId]?.[validGroupId] ?? {};
    setCells({ ...data });
  }, [courseId, groupId]);

  const students = STUDENTS[groupId] ?? [];
  const getCell = (studentId: string, date: string): AttendanceCell => {
    const key = getCellKey(studentId, date);
    return cells[key] ?? { status: "—" };
  };

  const handleOpenOverride = (studentId: string, date: string) => {
    const cell = getCell(studentId, date);
    setOverrideCell({ studentId, date });
    setOverrideStatus(cell.status === "—" ? "Excused" : cell.status);
    setOverrideComment(cell.comment ?? "");
  };

  const handleApplyOverride = () => {
    if (!overrideCell) return;
    const key = getCellKey(overrideCell.studentId, overrideCell.date);
    setCells((prev) => ({
      ...prev,
      [key]: { status: overrideStatus, comment: overrideComment.trim() || undefined },
    }));
    setOverrideCell(null);
    setOverrideComment("");
  };

  const handleCancelOverride = () => {
    setOverrideCell(null);
    setOverrideComment("");
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Attendance Tracking
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View and manage student attendance. Click a cell to change status or add a comment.
        </p>
      </section>

      <Card className="rounded-lg border-slate-200 p-4">
        <div className="flex flex-wrap gap-6">
          <div>
            <label htmlFor="course-select" className="block text-xs font-medium text-slate-700">
              Course
            </label>
            <select
              id="course-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="group-select" className="block text-xs font-medium text-slate-700">
              Student group
            </label>
            <select
              id="group-select"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="sticky left-0 z-10 min-w-[160px] bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                  Student
                </th>
                {LECTURE_DATES.map((d) => (
                  <th key={d} className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-600">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={LECTURE_DATES.length + 1} className="px-4 py-12 text-center text-slate-500">
                    No students in this group.
                  </td>
                </tr>
              ) : (
                students.map((stu) => (
                  <tr key={stu.id} className="hover:bg-slate-50/50">
                    <td className="sticky left-0 z-10 min-w-[160px] bg-white px-4 py-3 font-medium text-slate-900">
                      {stu.name}
                    </td>
                    {LECTURE_DATES.map((date) => {
                      const cell = getCell(stu.id, date);
                      const isOverrideTarget = overrideCell?.studentId === stu.id && overrideCell?.date === date;
                      return (
                        <td key={date} className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenOverride(stu.id, date)}
                            className={cn(
                              "inline-flex min-w-[72px] flex-col items-center justify-center rounded-md px-2 py-1.5 text-xs font-medium transition-colors hover:ring-2 hover:ring-teal-500 hover:ring-offset-1",
                              statusStyles(cell.status),
                              isOverrideTarget && "ring-2 ring-teal-500 ring-offset-1",
                            )}
                            title={cell.comment ? `Comment: ${cell.comment}` : "Click to change status"}
                          >
                            <span>{cell.status}</span>
                            {cell.comment && (
                              <span className="mt-0.5 block max-w-[80px] truncate text-[10px] opacity-90" title={cell.comment}>
                                {cell.comment}
                              </span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {overrideCell && (
        <Card className="rounded-lg border-teal-200 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Manual override</h3>
          <p className="mt-0.5 text-xs text-slate-600">
            Change status for{" "}
            {students.find((s) => s.id === overrideCell.studentId)?.name} on {overrideCell.date}
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">New status</label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value as AttendanceStatus)}
                className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="override-comment" className="block text-xs font-medium text-slate-700">
                Comment (optional)
              </label>
              <Input
                id="override-comment"
                value={overrideComment}
                onChange={(e) => setOverrideComment(e.target.value)}
                placeholder="e.g., Medical excuse, family emergency"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleCancelOverride}>
                Cancel
              </Button>
              <Button type="button" variant="primary" className="bg-teal-600 hover:bg-teal-700" onClick={handleApplyOverride}>
                Apply
              </Button>
            </div>
          </div>
        </Card>
      )}

      <p className="text-xs text-slate-500">
        <strong>Statuses:</strong> Present, Absent, Excused, Late. Click any cell to override status and add a comment.
      </p>
    </div>
  );
}
