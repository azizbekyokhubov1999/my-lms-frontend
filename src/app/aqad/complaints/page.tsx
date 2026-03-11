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
type Status = "Open" | "Under Investigation" | "Resolved" | "Closed";

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
  slaCountdown: string;
  status: Status;
  title: string;
  studentName: string;
  teacherName: string;
  courseName: string;
  openedAt: string;
  messages: Message[];
}

const COMPLAINTS: Complaint[] = [
  {
    id: "1",
    type: "Academic",
    priority: "P1",
    slaCountdown: "2d 4h",
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
    slaCountdown: "4d 12h",
    status: "Open",
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
    slaCountdown: "1d 8h",
    status: "Open",
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
];

const STATUS_OPTIONS: { key: Status; label: string }[] = [
  { key: "Open", label: "Open" },
  { key: "Under Investigation", label: "Under Investigation" },
  { key: "Resolved", label: "Resolved" },
  { key: "Closed", label: "Closed" },
];

export default function ComplaintsPage() {
  const [selectedId, setSelectedId] = React.useState<string | null>("1");
  const [statusFilter, setStatusFilter] = React.useState<Status | "all">("all");
  const [correctiveAction, setCorrectiveAction] = React.useState("");
  const [correctiveDeadline, setCorrectiveDeadline] = React.useState("");

  const selected = selectedId
    ? COMPLAINTS.find((c) => c.id === selectedId)
    : null;

  const filteredComplaints =
    statusFilter === "all"
      ? COMPLAINTS
      : COMPLAINTS.filter((c) => c.status === statusFilter);

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
      case "Open":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Under Investigation":
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
      case "Resolved":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Closed":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

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
        {/* Triage table */}
        <section className="lg:col-span-1">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">Triage</h2>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Status | "all")
              }
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700"
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
            <div className="max-h-[420px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-600">
                      Type / Priority
                    </th>
                    <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-600">
                      SLA
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
                            "font-mono text-[11px]",
                            c.priority === "P1"
                              ? "font-bold text-red-700"
                              : "text-slate-600",
                          )}
                        >
                          {c.slaCountdown}
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
              {/* Status tracker */}
              <Card className="rounded-lg border-slate-200">
                <h3 className="text-xs font-semibold text-slate-700">
                  Status tracker
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {}}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        selected.status === opt.key
                          ? getStatusStyles(opt.key)
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Current:{" "}
                  <span className="font-semibold text-slate-700">
                    {selected.status}
                  </span>
                  {" • "}
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
