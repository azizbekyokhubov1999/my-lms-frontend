"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Priority = "critical" | "high" | "medium" | "low";
type TaskStatus = "Pending" | "In Progress" | "Completed" | "Overdue";

interface CorrectiveTask {
  id: string;
  title: string;
  description: string;
  courseName: string;
  teacherName: string;
  issuedDate: string;
  dueDate: string;
  dueTs: number;
  priority: Priority;
  status: TaskStatus;
  /** AQAD has verified the fix */
  verified: boolean;
}

const TASKS: CorrectiveTask[] = [
  {
    id: "ca1",
    title: "Update Lecture 5 video",
    description: "Replace low-quality recording with HD version; ensure audio is clear.",
    courseName: "CS 210 - Data Structures",
    teacherName: "Dr. James Wilson",
    issuedDate: "Mar 1, 2026",
    dueDate: "Mar 10, 2026",
    dueTs: new Date("2026-03-10").getTime(),
    priority: "high",
    status: "Overdue",
    verified: false,
  },
  {
    id: "ca2",
    title: "Fix quiz typos",
    description: "Correct spelling and numbering errors in Quiz 2 (Module 3).",
    courseName: "CS 440 - Machine Learning",
    teacherName: "Prof. Sarah Chen",
    issuedDate: "Mar 4, 2026",
    dueDate: "Mar 12, 2026",
    dueTs: new Date("2026-03-12").getTime(),
    priority: "medium",
    status: "In Progress",
    verified: false,
  },
  {
    id: "ca3",
    title: "Add measurable learning outcomes",
    description: "Syllabus: define 5 measurable outcomes for Module 2; align with assessment.",
    courseName: "RES 301 - Research Methods",
    teacherName: "Dr. Emma Davis",
    issuedDate: "Feb 28, 2026",
    dueDate: "Mar 8, 2026",
    dueTs: new Date("2026-03-08").getTime(),
    priority: "high",
    status: "Completed",
    verified: true,
  },
  {
    id: "ca4",
    title: "Replace outdated references",
    description: "Module 4 readings: replace 2018 sources with current editions or peer-reviewed alternatives.",
    courseName: "CS 350 - Database Systems",
    teacherName: "Prof. Michael Brown",
    issuedDate: "Mar 5, 2026",
    dueDate: "Mar 20, 2026",
    dueTs: new Date("2026-03-20").getTime(),
    priority: "medium",
    status: "Pending",
    verified: false,
  },
  {
    id: "ca5",
    title: "Clarify exam rubric",
    description: "Publish detailed rubric for Midterm Q3–5 and notify students.",
    courseName: "CS 220 - Algorithms",
    teacherName: "Prof. David Kim",
    issuedDate: "Mar 3, 2026",
    dueDate: "Mar 6, 2026",
    dueTs: new Date("2026-03-06").getTime(),
    priority: "critical",
    status: "Overdue",
    verified: false,
  },
];

function isPastDue(dueTs: number): boolean {
  return dueTs < Date.now();
}

function formatDue(dueDate: string, dueTs: number): string {
  if (isPastDue(dueTs)) {
    const days = Math.ceil((Date.now() - dueTs) / (24 * 60 * 60 * 1000));
    return `${dueDate} (${days}d overdue)`;
  }
  return dueDate;
}

function getPriorityStyles(p: Priority) {
  switch (p) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-amber-100 text-amber-800";
    case "medium":
      return "bg-sky-100 text-sky-800";
    case "low":
      return "bg-slate-100 text-slate-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getStatusStyles(s: TaskStatus) {
  switch (s) {
    case "Pending":
      return "bg-slate-100 text-slate-700";
    case "In Progress":
      return "bg-amber-50 text-amber-800";
    case "Completed":
      return "bg-emerald-50 text-emerald-800";
    case "Overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function CorrectiveActionsPage() {
  const [tasks, setTasks] = React.useState<CorrectiveTask[]>(TASKS);
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">("all");

  const filteredTasks = tasks.filter(
    (t) => statusFilter === "all" || t.status === statusFilter,
  );

  const handleVerify = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Completed" as TaskStatus, verified: true } : t,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Corrective actions
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Task board: tasks issued by AQAD to teachers. Monitor deadlines and verify fixes.
        </p>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Task board</h2>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TaskStatus | "all")
            }
            className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700"
            aria-label="Filter by status"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Task / Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Due date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTasks.map((task) => {
                  const pastDue = isPastDue(task.dueTs);
                  return (
                    <tr
                      key={task.id}
                      className={cn(
                        "transition-colors hover:bg-slate-50",
                        pastDue && "border-l-4 border-l-red-400 bg-red-50/30",
                      )}
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.courseName}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {task.teacherName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-medium",
                            pastDue ? "text-red-700" : "text-slate-700",
                          )}
                        >
                          {formatDue(task.dueDate, task.dueTs)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded px-2 py-0.5 text-xs font-semibold capitalize",
                            getPriorityStyles(task.priority),
                          )}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            getStatusStyles(task.status),
                          )}
                        >
                          {task.status}
                        </span>
                        {task.verified && (
                          <span className="ml-1.5 inline-flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/aqad/corrective-actions/${task.id}`}
                            className="inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:bg-slate-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`View details for ${task.title}`}
                          >
                            View Details
                          </Link>
                          {task.verified ? (
                            <span className="text-xs font-medium text-emerald-700">
                              Verified
                            </span>
                          ) : (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-600"
                              onClick={() => handleVerify(task.id)}
                            >
                              Verify fix
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              No tasks match the selected filter.
            </div>
          )}
        </Card>

        <p className="mt-3 text-xs text-slate-500">
          <strong>Deadline monitoring:</strong> Rows with a red border and &quot;X days overdue&quot; are past their due date. Use &quot;Verify fix&quot; once the teacher has addressed the issue and AQAD has confirmed.
        </p>
      </section>
    </div>
  );
}
