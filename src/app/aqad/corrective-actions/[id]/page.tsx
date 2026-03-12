"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Priority = "critical" | "high" | "medium" | "low";
type TimelineStep = "Open" | "Instructor Notified" | "Fix Submitted" | "AQAD Verified";

interface CorrectiveTask {
  id: string;
  title: string;
  description: string;
  problemDescription: string;
  courseName: string;
  courseId: string;
  teacherName: string;
  issuedDate: string;
  dueDate: string;
  dueTs: number;
  priority: Priority;
  issuedBy: string;
  timelineStep: TimelineStep;
  verified: boolean;
}

const TIMELINE_STEPS: TimelineStep[] = [
  "Open",
  "Instructor Notified",
  "Fix Submitted",
  "AQAD Verified",
];

/** Mock data; in production fetch by id */
const TASKS_BY_ID: Record<string, CorrectiveTask> = {
  ca1: {
    id: "ca1",
    title: "Update Lecture 5 Video",
    description: "Replace low-quality recording with HD version; ensure audio is clear.",
    problemDescription:
      "Quality violation: Audio clipping detected at 10:45 timestamp in Lecture 5. Background hum and peak distortion make the segment unintelligible. Video resolution drops below 720p between 08:20–12:00. Instructor requested to re-record the segment and re-upload in HD with clear audio.",
    courseName: "CS 210 - Data Structures",
    courseId: "1",
    teacherName: "Dr. James Wilson",
    issuedDate: "Mar 1, 2026",
    dueDate: "Mar 10, 2026",
    dueTs: new Date("2026-03-10").getTime(),
    priority: "high",
    issuedBy: "Jane Smith",
    timelineStep: "Instructor Notified",
    verified: false,
  },
  ca2: {
    id: "ca2",
    title: "Fix Quiz Typos",
    description: "Correct spelling and numbering errors in Quiz 2 (Module 3).",
    problemDescription:
      "Quiz 2 (Module 3): Question 4 has a typo in the stem ('teh' → 'the'). Question 7 numbering skips from 7 to 9. Answer option B in Q5 references 'Fig. 3' but should be 'Fig. 2'. Please correct and republish.",
    courseName: "CS 440 - Machine Learning",
    courseId: "2",
    teacherName: "Prof. Sarah Chen",
    issuedDate: "Mar 4, 2026",
    dueDate: "Mar 12, 2026",
    dueTs: new Date("2026-03-12").getTime(),
    priority: "medium",
    issuedBy: "John Doe",
    timelineStep: "Fix Submitted",
    verified: false,
  },
  ca3: {
    id: "ca3",
    title: "Add Measurable Learning Outcomes",
    description: "Syllabus: define 5 measurable outcomes for Module 2; align with assessment.",
    problemDescription:
      "Module 2 syllabus lists learning goals but they are not measurable (e.g. 'Understand recursion'). Per university standards, each outcome must be actionable and assessable (e.g. 'Students will be able to trace recursive calls and predict output'). Align Module 2 quiz and assignment with the new outcomes.",
    courseName: "RES 301 - Research Methods",
    courseId: "3",
    teacherName: "Dr. Emma Davis",
    issuedDate: "Feb 28, 2026",
    dueDate: "Mar 8, 2026",
    dueTs: new Date("2026-03-08").getTime(),
    priority: "high",
    issuedBy: "Jane Smith",
    timelineStep: "AQAD Verified",
    verified: true,
  },
  ca4: {
    id: "ca4",
    title: "Replace Outdated References",
    description: "Module 4 readings: replace 2018 sources with current editions or peer-reviewed alternatives.",
    problemDescription:
      "Module 4 reading list includes three sources from 2018 that have been superseded by newer editions or retractions. Provide updated references or equivalent peer-reviewed alternatives and update the module PDF and LMS links.",
    courseName: "CS 350 - Database Systems",
    courseId: "4",
    teacherName: "Prof. Michael Brown",
    issuedDate: "Mar 5, 2026",
    dueDate: "Mar 20, 2026",
    dueTs: new Date("2026-03-20").getTime(),
    priority: "medium",
    issuedBy: "Maria Garcia",
    timelineStep: "Open",
    verified: false,
  },
  ca5: {
    id: "ca5",
    title: "Clarify Exam Rubric",
    description: "Publish detailed rubric for Midterm Q3–5 and notify students.",
    problemDescription:
      "Midterm questions Q3–5 (long-form) lack a published rubric. Students have raised concerns about grading consistency. Please publish a detailed rubric (criteria and point allocation) and notify the cohort at least 7 days before the exam.",
    courseName: "CS 220 - Algorithms",
    courseId: "6",
    teacherName: "Prof. David Kim",
    issuedDate: "Mar 3, 2026",
    dueDate: "Mar 6, 2026",
    dueTs: new Date("2026-03-06").getTime(),
    priority: "critical",
    issuedBy: "John Doe",
    timelineStep: "Instructor Notified",
    verified: false,
  },
};

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Format dueDate (e.g. "Mar 10, 2026") to YYYY-MM-DD for date input */
function toDateInputValue(displayStr: string): string {
  const d = new Date(displayStr);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateForDisplay(ymd: string): string {
  const d = new Date(ymd + "T12:00:00");
  if (Number.isNaN(d.getTime())) return ymd;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export default function CorrectiveActionDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const [task, setTask] = React.useState<CorrectiveTask | null>(id ? TASKS_BY_ID[id] ?? null : null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as Priority,
  });

  const startEditing = () => {
    if (!task) return;
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: toDateInputValue(task.dueDate),
      priority: task.priority,
    });
    setIsEditing(true);
    setSuccessMessage(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({ title: "", description: "", dueDate: "", priority: "medium" });
  };

  const saveEdit = () => {
    if (!task) return;
    const newDueTs = new Date(editForm.dueDate + "T23:59:59").getTime();
    setTask({
      ...task,
      title: editForm.title.trim() || task.title,
      description: editForm.description.trim() || task.description,
      dueDate: formatDateForDisplay(editForm.dueDate),
      dueTs: newDueTs,
      priority: editForm.priority,
    });
    setIsEditing(false);
    setEditForm({ title: "", description: "", dueDate: "", priority: "medium" });
    setSuccessMessage("Task Updated Successfully");
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCloseTask = () => {
    if (!task) return;
    setTask({
      ...task,
      timelineStep: "AQAD Verified",
      verified: true,
    });
  };

  if (!id) {
    return (
      <div className="space-y-6">
        <Link href="/aqad/corrective-actions" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Task Board
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Corrective action not found.</p>
          <Link href="/aqad/corrective-actions">
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Back to Task Board
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="space-y-6">
        <Link href="/aqad/corrective-actions" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Task Board
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Corrective action &quot;{id}&quot; not found.</p>
          <Link href="/aqad/corrective-actions">
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Back to Task Board
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const timelineIndex = TIMELINE_STEPS.indexOf(task.timelineStep);
  const isClosed = task.verified && task.timelineStep === "AQAD Verified";

  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad/corrective-actions" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Task Board
        </Link>
      </section>

      {successMessage && (
        <div
          role="alert"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          {successMessage}
        </div>
      )}

      {isEditing && (
        <Card className="rounded-lg border-slate-200 p-4">
          <h2 className="text-sm font-semibold text-slate-900">Edit task</h2>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
          >
            <div>
              <label htmlFor="edit-title" className="block text-xs font-medium text-slate-700">
                Task title
              </label>
              <input
                id="edit-title"
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Update Lecture 5 Video"
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-xs font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="edit-description"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Short description of the task"
              />
            </div>
            <div>
              <label htmlFor="edit-deadline" className="block text-xs font-medium text-slate-700">
                Deadline
              </label>
              <input
                id="edit-deadline"
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="edit-priority" className="block text-xs font-medium text-slate-700">
                Priority
              </label>
              <select
                id="edit-priority"
                value={editForm.priority}
                onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                className="mt-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="primary" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                Save
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={cancelEditing}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 1. Header: Task Title, ID, Priority */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            {task.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            ID: <span className="font-mono font-medium text-slate-700">{task.id}</span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1.5 text-sm font-semibold capitalize",
            getPriorityStyles(task.priority),
          )}
        >
          {task.priority === "critical" ? "Critical" : task.priority}
        </span>
      </header>

      {/* 2. Context: Course (link), Instructor (name + avatar), Issued By */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Context</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Course</dt>
            <dd className="mt-0.5">
              <Link
                href={`/aqad/reviews/${task.courseId}`}
                className="font-medium text-indigo-600 hover:underline"
              >
                {task.courseName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Instructor</dt>
            <dd className="mt-0.5 flex items-center gap-2">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-800"
                aria-hidden
              >
                {getInitials(task.teacherName)}
              </span>
              <span className="font-medium text-slate-900">{task.teacherName}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Issued by</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{task.issuedBy} (AQAD)</dd>
          </div>
        </dl>
      </Card>

      {/* 3. Problem Description */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Problem description</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-700 whitespace-pre-line">
          {task.problemDescription}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Due: {task.dueDate} · Issued: {task.issuedDate}
        </p>
      </Card>

      {/* 4. Timeline: Open → Instructor Notified → Fix Submitted → AQAD Verified */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Status tracker</h2>
        <ul className="mt-4 flex flex-wrap gap-4 sm:gap-6" role="list" aria-label="Task timeline">
          {TIMELINE_STEPS.map((step, i) => {
            const reached = i <= timelineIndex;
            const current = task.timelineStep === step;
            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    reached ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500",
                    current && "ring-4 ring-indigo-100",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  {reached ? (i === timelineIndex && current ? "✓" : i + 1) : "—"}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    reached ? "text-slate-900" : "text-slate-400",
                    current && "text-indigo-700",
                  )}
                >
                  {step}
                </span>
                {i < TIMELINE_STEPS.length - 1 && (
                  <span className="hidden shrink-0 text-slate-300 sm:inline" aria-hidden>
                    →
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* 5. Actions: Edit Task, Close Task */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startEditing}
            aria-label="Edit task deadline or description"
          >
            Edit Task
          </Button>
          {!isClosed ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={handleCloseTask}
              aria-label="Close task and mark fix as accepted"
            >
              Close Task
            </Button>
          ) : (
            <span className="inline-flex items-center rounded bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-800">
              Task closed (fix accepted)
            </span>
          )}
        </div>
      </Card>

      <div>
        <Link href="/aqad/corrective-actions">
          <Button type="button" variant="outline" size="sm">
            Back to Task Board
          </Button>
        </Link>
      </div>
    </div>
  );
}
