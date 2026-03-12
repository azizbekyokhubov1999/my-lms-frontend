"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ComplaintType = "Technical" | "Academic" | "Financial";
type Priority = "P1" | "P2" | "P3";
/** Resolution workflow: Filed → Under Investigation → Evidence Gathered → Resolved */
type Status =
  | "Filed"
  | "Under Investigation"
  | "Evidence Gathered"
  | "Resolved";

interface Message {
  id: string;
  sender: "student" | "teacher";
  name: string;
  text: string;
  timestamp: string;
}

interface Complaint {
  id: string;
  type: ComplaintType;
  priority: Priority;
  /** Hours remaining to resolve (for SLA tracker) */
  slaHoursRemaining: number;
  status: Status;
  title: string;
  studentName: string;
  teacherName: string;
  courseName: string;
  openedAt: string;
  messages: Message[];
}

const WORKFLOW_STEPS: Status[] = [
  "Filed",
  "Under Investigation",
  "Evidence Gathered",
  "Resolved",
];

function formatSlaRemaining(hours: number): string {
  if (hours <= 0) return "Overdue";
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  if (d > 0) return `${d}d ${h}h`;
  return `${h}h`;
}

const COMPLAINTS: Complaint[] = [
  {
    id: "1",
    type: "Academic",
    priority: "P1",
    slaHoursRemaining: 52,
    status: "Under Investigation",
    title: "Grade dispute - Final exam",
    studentName: "John Smith",
    teacherName: "Prof. Sarah Chen",
    courseName: "CS 440 - Machine Learning",
    openedAt: "Mar 4, 2026",
    messages: [
      {
        id: "m1",
        sender: "student",
        name: "John Smith",
        text: "I believe my final exam grade is incorrect. I submitted all answers on time but received 62 when I expected at least 75.",
        timestamp: "Mar 4, 10:30",
      },
      {
        id: "m2",
        sender: "teacher",
        name: "Prof. Sarah Chen",
        text: "I've reviewed your submission. Question 3 was marked incorrect because the solution didn't follow the specified algorithm. Happy to discuss during office hours.",
        timestamp: "Mar 4, 14:15",
      },
      {
        id: "m3",
        sender: "student",
        name: "John Smith",
        text: "I used the correct approach but the rubric wasn't clear. Can we have a second reviewer?",
        timestamp: "Mar 5, 09:00",
      },
    ],
  },
  {
    id: "2",
    type: "Technical",
    priority: "P2",
    slaHoursRemaining: 108,
    status: "Filed",
    title: "Video not loading in lecture",
    studentName: "Emma Davis",
    teacherName: "Dr. James Wilson",
    courseName: "CS 210 - Data Structures",
    openedAt: "Mar 5, 2026",
    messages: [
      {
        id: "m1",
        sender: "student",
        name: "Emma Davis",
        text: "Lecture 5 video fails to load. I've tried different browsers and devices.",
        timestamp: "Mar 5, 11:20",
      },
    ],
  },
  {
    id: "3",
    type: "Financial",
    priority: "P1",
    slaHoursRemaining: 32,
    status: "Filed",
    title: "Duplicate payment charged",
    studentName: "Michael Brown",
    teacherName: "N/A",
    courseName: "Bursar",
    openedAt: "Mar 6, 2026",
    messages: [
      {
        id: "m1",
        sender: "student",
        name: "Michael Brown",
        text: "I was charged twice for CS 350 tuition. Payment IDs: #12345 and #12346.",
        timestamp: "Mar 6, 08:00",
      },
    ],
  },
  {
    id: "4",
    type: "Academic",
    priority: "P3",
    slaHoursRemaining: 0,
    status: "Resolved",
    title: "Assignment feedback delay",
    studentName: "Lisa Park",
    teacherName: "Dr. Emma Davis",
    courseName: "RES 301 - Research Methods",
    openedAt: "Mar 1, 2026",
    messages: [],
  },
];

const TYPE_OPTIONS: { key: ComplaintType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Technical", label: "Technical" },
  { key: "Academic", label: "Academic" },
  { key: "Financial", label: "Financial" },
];

const STATUS_OPTIONS: { key: Status | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Filed", label: "Filed" },
  { key: "Under Investigation", label: "Under Investigation" },
  { key: "Evidence Gathered", label: "Evidence Gathered" },
  { key: "Resolved", label: "Resolved" },
];

export default function ComplaintsPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>("1");
  const [typeFilter, setTypeFilter] = React.useState<ComplaintType | "all">("all");
  const [statusFilter, setStatusFilter] = React.useState<Status | "all">("all");
  const [correctiveAction, setCorrectiveAction] = React.useState("");
  const [correctiveDeadline, setCorrectiveDeadline] = React.useState("");

  const selected = selectedId
    ? COMPLAINTS.find((c) => c.id === selectedId)
    : null;

  const filteredComplaints = COMPLAINTS.filter((c) => {
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const getTypeStyles = (type: ComplaintType) => {
    switch (type) {
      case "Technical":
        return "bg-sky-100 text-sky-800";
      case "Academic":
        return "bg-indigo-100 text-indigo-800";
      case "Financial":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case "P1":
        return "bg-red-100 text-red-800 font-bold";
      case "P2":
        return "bg-amber-100 text-amber-800 font-semibold";
      case "P3":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusStyles = (status: Status) => {
    switch (status) {
      case "Filed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Under Investigation":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Evidence Gathered":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const workflowStepIndex = (s: Status) => WORKFLOW_STEPS.indexOf(s);

  const handleAssignCorrective = (e: React.FormEvent) => {
    e.preventDefault();
    const action = correctiveAction.trim();
    const deadline = correctiveDeadline.trim();
    if (!action || !deadline) return;
    setCorrectiveAction("");
    setCorrectiveDeadline("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Complaints management
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Triage, investigate, and resolve student and teacher complaints.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Triage: sort by Technical / Academic / Financial */}
        <section className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-slate-900">Triage</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Filter by type and status. SLA = time remaining to resolve.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="sr-only">Filter by type</span>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setTypeFilter(opt.key as ComplaintType | "all")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  typeFilter === opt.key
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
                )}
              >
                {opt.label}
              </button>
            ))}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Status | "all")
              }
              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
              aria-label="Filter by status"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-600">
                      Type / Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-600">
                      SLA remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-slate-50",
                        selectedId === c.id && "bg-indigo-50 hover:bg-indigo-50",
                      )}
                    >
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold",
                            getTypeStyles(c.type),
                          )}
                        >
                          {c.type}
                        </span>
                        <span
                          className={cn(
                            "ml-1 inline-block rounded px-1.5 py-0.5 text-[10px]",
                            getPriorityStyles(c.priority),
                          )}
                        >
                          {c.priority}
                        </span>
                        <p className="mt-1 truncate text-xs font-medium text-slate-800">
                          {c.title}
                        </p>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={cn(
                            "font-mono text-[11px] font-semibold",
                            c.slaHoursRemaining <= 0 && "text-slate-500",
                            c.slaHoursRemaining > 0 && c.slaHoursRemaining < 24 && "text-red-700",
                            c.slaHoursRemaining >= 24 && "text-slate-600",
                          )}
                        >
                          {formatSlaRemaining(c.slaHoursRemaining)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Investigation & resolution */}
        <section className="lg:col-span-2 space-y-4">
          {selected ? (
            <>
              {/* SLA Tracker: time remaining to resolve */}
              <Card className="rounded-lg border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700">
                  SLA tracker
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Time remaining to resolve this complaint per policy
                </p>
                <div
                  className={cn(
                    "mt-3 rounded-lg border px-4 py-3",
                    selected.slaHoursRemaining <= 0 && "border-slate-200 bg-slate-50",
                    selected.slaHoursRemaining > 0 && selected.slaHoursRemaining < 24 && "border-amber-300 bg-amber-50",
                    selected.slaHoursRemaining >= 24 && "border-emerald-200 bg-emerald-50/50",
                  )}
                >
                  <p
                    className={cn(
                      "font-mono text-lg font-bold",
                      selected.slaHoursRemaining <= 0 && "text-slate-600",
                      selected.slaHoursRemaining > 0 && selected.slaHoursRemaining < 24 && "text-amber-800",
                      selected.slaHoursRemaining >= 24 && "text-emerald-800",
                    )}
                  >
                    {formatSlaRemaining(selected.slaHoursRemaining)}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    {selected.slaHoursRemaining <= 0
                      ? "Resolution deadline passed"
                      : selected.slaHoursRemaining < 24
                        ? "Less than 24 hours remaining"
                        : "Within SLA"}
                  </p>
                </div>
              </Card>

              {/* Resolution workflow: Filed → Under Investigation → Evidence Gathered → Resolved */}
              <Card className="rounded-lg border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700">
                  Resolution workflow
                </h3>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Investigation steps — current stage highlighted
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-1">
                  {WORKFLOW_STEPS.map((step, i) => {
                    const isActive = selected.status === step;
                    const isPast = workflowStepIndex(selected.status) > i;
                    return (
                      <React.Fragment key={step}>
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                            isActive && getStatusStyles(step),
                            isPast && "border-emerald-200 bg-emerald-50 text-emerald-800",
                            !isActive && !isPast && "border-slate-200 bg-white text-slate-500",
                          )}
                        >
                          {step}
                        </span>
                        {i < WORKFLOW_STEPS.length - 1 && (
                          <span className="hidden text-slate-300 sm:inline" aria-hidden>
                            →
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Opened {selected.openedAt} • {selected.studentName} vs{" "}
                  {selected.teacherName}
                </p>
              </Card>

              {/* Investigation interface (chat-like) */}
              <Card className="rounded-lg border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700">
                  Investigation — communication thread
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selected.courseName}
                </p>
                <div className="mt-3 max-h-52 space-y-3 overflow-y-auto">
                  {selected.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col rounded-lg px-3 py-2 text-sm",
                        msg.sender === "student"
                          ? "bg-slate-100 text-slate-800"
                          : "bg-indigo-50 text-indigo-900",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800">
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-700">{msg.text}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Resolution form */}
              <Card className="rounded-lg border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700">
                  Resolution form
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Assign corrective action to teacher with deadline
                </p>
                <form
                  onSubmit={handleAssignCorrective}
                  className="mt-3 space-y-3"
                >
                  <div>
                    <label
                      htmlFor="corrective-action"
                      className="block text-xs font-medium text-slate-700"
                    >
                      Corrective action
                    </label>
                    <textarea
                      id="corrective-action"
                      rows={3}
                      value={correctiveAction}
                      onChange={(e) => setCorrectiveAction(e.target.value)}
                      placeholder="e.g., Re-grade question 3 using clarified rubric. Provide written feedback to student by deadline."
                      className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        label="Deadline"
                        type="date"
                        value={correctiveDeadline}
                        onChange={(e) => setCorrectiveDeadline(e.target.value)}
                        placeholder="YYYY-MM-DD"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={
                          !correctiveAction.trim() || !correctiveDeadline.trim()
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600"
                      >
                        Assign
                      </Button>
                    </div>
                  </div>
                </form>
                <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                  <Button type="button" variant="outline" size="sm">
                    Mark resolved
                  </Button>
                  <Button type="button" variant="outline" size="sm">
                    Close complaint
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="flex h-80 items-center justify-center rounded-lg border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Select a complaint to view investigation and resolution options
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
