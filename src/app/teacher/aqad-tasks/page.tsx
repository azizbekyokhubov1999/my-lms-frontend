"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TaskStatus = "Pending" | "In Progress" | "Overdue" | "Fixed";
type Priority = "critical" | "high" | "medium" | "low";

interface AqadTask {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  moduleId?: string;
  lectureId?: string;
  dueDate: string;
  dueTs: number;
  priority: Priority;
  status: TaskStatus;
}

const TASKS: AqadTask[] = [
  { id: "ca1", title: "Update Lecture 5 video", description: "Replace low-quality recording with HD version; ensure audio is clear.", courseId: "2", courseName: "CS 210 - Data Structures", moduleId: "m2", lectureId: "l3", dueDate: "Mar 10, 2026", dueTs: new Date("2026-03-10").getTime(), priority: "high", status: "Overdue" },
  { id: "ca2", title: "Fix quiz typos", description: "Correct spelling and numbering errors in Quiz 2 (Module 3).", courseId: "1", courseName: "CS 440 - Machine Learning", moduleId: "m3", dueDate: "Mar 12, 2026", dueTs: new Date("2026-03-12").getTime(), priority: "medium", status: "In Progress" },
  { id: "ca3", title: "Update Lecture 3 audio", description: "Audio clipping detected at 10:45. Re-record or re-upload with clear audio.", courseId: "1", courseName: "CS 440 - Machine Learning", moduleId: "m2", lectureId: "l2", dueDate: "Mar 14, 2026", dueTs: new Date("2026-03-14").getTime(), priority: "high", status: "Pending" },
  { id: "ca4", title: "Replace outdated references", description: "Module 4 readings: replace 2018 sources with current editions.", courseId: "4", courseName: "CS 350 - Database Systems", moduleId: "m4", dueDate: "Mar 20, 2026", dueTs: new Date("2026-03-20").getTime(), priority: "medium", status: "Pending" },
  { id: "ca5", title: "Add measurable learning outcomes", description: "Define 5 measurable outcomes for Module 2; align with assessment.", courseId: "3", courseName: "RES 301 - Research Methods", moduleId: "m2", dueDate: "Mar 8, 2026", dueTs: new Date("2026-03-08").getTime(), priority: "high", status: "Fixed" },
];

function getStatusStyles(s: TaskStatus) {
  switch (s) {
    case "Pending": return "bg-slate-100 text-slate-700";
    case "In Progress": return "bg-amber-100 text-amber-800";
    case "Overdue": return "bg-red-100 text-red-800";
    case "Fixed": return "bg-emerald-100 text-emerald-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

function getPriorityStyles(p: Priority) {
  switch (p) {
    case "critical": return "bg-red-100 text-red-800";
    case "high": return "bg-amber-100 text-amber-800";
    case "medium": return "bg-sky-100 text-sky-800";
    case "low": return "bg-slate-100 text-slate-700";
    default: return "bg-slate-100 text-slate-600";
  }
}

function buildBuilderUrl(task: AqadTask): string {
  const params = new URLSearchParams();
  if (task.moduleId) params.set("module", task.moduleId);
  if (task.lectureId) params.set("lecture", task.lectureId);
  const qs = params.toString();
  return `/teacher/courses/builder/${task.courseId}${qs ? `?${qs}` : ""}`;
}

export default function TeacherAqadTasksPage() {
  const [tasks, setTasks] = React.useState<AqadTask[]>(TASKS);

  const handleMarkFixed = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "Fixed" as TaskStatus } : t)),
    );
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          AQAD Tasks
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Corrective actions from Quality Assurance. Fix in Course Builder, then mark as fixed.
        </p>
      </section>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id}>
            <Card className="rounded-lg border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-900">{task.title}</h2>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", getStatusStyles(task.status))}>
                      {task.status}
                    </span>
                    <span className={cn("rounded px-2 py-0.5 text-xs font-semibold capitalize", getPriorityStyles(task.priority))}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {task.courseName} · Due {task.dueDate}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={buildBuilderUrl(task)}>
                    <Button type="button" variant="outline" size="sm">
                      Go to Course Builder
                    </Button>
                  </Link>
                  {task.status !== "Fixed" && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      className="bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleMarkFixed(task.id)}
                    >
                      Mark as Fixed
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <Card className="rounded-lg border-slate-200 p-12 text-center">
          <p className="text-sm text-slate-600">No AQAD tasks.</p>
        </Card>
      )}
    </div>
  );
}
