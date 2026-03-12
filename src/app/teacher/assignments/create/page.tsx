"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AqadStatus = "Draft" | "Pending Review" | "Approved" | "Need Correction";

interface AssignmentDraft {
  id: string;
  title: string;
  instructions: string;
  maxPoints: number;
  deadline: string;
  rubricId: string | null;
  rubricName: string | null;
  status: AqadStatus;
}

const STORAGE_KEY = "teacher-assignment-drafts";

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning" },
  { id: "2", name: "CS 210 - Data Structures" },
  { id: "3", name: "RES 301 - Research Methods" },
];

function loadDrafts(): AssignmentDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: AssignmentDraft[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

function loadRubrics(): { id: string; title: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("teacher-rubrics");
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.map((r: { id: string; title: string }) => ({ id: r.id, title: r.title })) : [];
  } catch {
    return [];
  }
}

export default function AssignmentCreatePage() {
  const searchParams = useSearchParams();
  const rubricParam = searchParams?.get("rubric");
  const [id] = React.useState(() => "a" + Date.now());
  const [courseId, setCourseId] = React.useState("1");
  const [title, setTitle] = React.useState("");
  const [instructions, setInstructions] = React.useState("");
  const [maxPoints, setMaxPoints] = React.useState(100);
  const [deadline, setDeadline] = React.useState("");
  const [rubricId, setRubricId] = React.useState<string | null>(null);
  const [rubricName, setRubricName] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<AqadStatus>("Draft");
  const [saveToast, setSaveToast] = React.useState<"saving" | "saved" | null>(null);
  const [drafts, setDrafts] = React.useState<AssignmentDraft[]>([]);
  const [availableRubrics, setAvailableRubrics] = React.useState<{ id: string; title: string }[]>([]);

  React.useEffect(() => {
    setDrafts(loadDrafts());
    const rubrics = loadRubrics();
    setAvailableRubrics(rubrics);
    if (rubricParam && rubrics.some((r) => r.id === rubricParam)) {
      const r = rubrics.find((x) => x.id === rubricParam);
      if (r) {
        setRubricId(r.id);
        setRubricName(r.title);
      }
    }
  }, [rubricParam]);

  const isLocked = status === "Pending Review" || status === "Approved";

  const handleSaveDraft = () => {
    setSaveToast("saving");
    const draft: AssignmentDraft = {
      id,
      title,
      instructions,
      maxPoints,
      deadline,
      rubricId,
      rubricName,
      status: "Draft",
    };
    const updated = [...drafts.filter((d) => d.id !== id), draft];
    setDrafts(updated);
    saveDrafts(updated);
    setStatus("Draft");
    setTimeout(() => {
      setSaveToast("saved");
      setTimeout(() => setSaveToast(null), 2000);
    }, 600);
  };

  const handleSubmitToAqad = () => {
    if (!title.trim()) return;
    const draft: AssignmentDraft = {
      id,
      title,
      instructions,
      maxPoints,
      deadline,
      rubricId,
      rubricName,
      status: "Pending Review",
    };
    const updated = [...drafts.filter((d) => d.id !== id), draft];
    setDrafts(updated);
    saveDrafts(updated);
    setStatus("Pending Review");
  };

  const handleRubricRemove = () => {
    setRubricId(null);
    setRubricName(null);
  };

  const statusStyles: Record<AqadStatus, string> = {
    Draft: "bg-slate-100 text-slate-700",
    "Pending Review": "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    "Need Correction": "bg-red-100 text-red-800",
  };

  const approvedCount = drafts.filter((d) => d.status === "Approved").length;
  const needCorrectionCount = drafts.filter((d) => d.status === "Need Correction").length;

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/assignments" className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to Assignments
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Create Assignment
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Define title, instructions, deadline, and grading rubric. Save as draft or submit to AQAD for review.
        </p>
      </section>

      {/* Status Tracker Dashboard */}
      <Card className="rounded-lg border-slate-200 bg-slate-50/50 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Assessment status</h3>
        <p className="mt-0.5 text-xs text-slate-500">Your assignments in the AQAD workflow</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-emerald-600">{approvedCount}</span>
            <span className="text-sm text-slate-600">Approved</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-red-600">{needCorrectionCount}</span>
            <span className="text-sm text-slate-600">Need Correction</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
            <span className="text-2xl font-bold text-amber-600">
              {drafts.filter((d) => d.status === "Pending Review").length}
            </span>
            <span className="text-sm text-slate-600">Pending Review</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Card className="rounded-lg border-slate-200 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Assignment details</h2>
            <p className="mt-0.5 text-xs text-slate-500">Required fields for the assignment</p>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="course-select" className="block text-xs font-medium text-slate-700">Course</label>
                <select
                  id="course-select"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={isLocked}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Assignment 1: Linear Regression"
                disabled={isLocked}
              />
              <div>
                <label htmlFor="instructions" className="block text-xs font-medium text-slate-700">Instructions</label>
                <textarea
                  id="instructions"
                  rows={5}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Describe what students should submit and how..."
                  disabled={isLocked}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Max points"
                  type="number"
                  min={1}
                  value={String(maxPoints)}
                  onChange={(e) => setMaxPoints(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  disabled={isLocked}
                />
                <Input
                  label="Deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  disabled={isLocked}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Grading rubric</label>
                {rubricName ? (
                  <div className="mt-1 flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-sm font-medium text-slate-700">{rubricName}</span>
                    {!isLocked && (
                      <button
                        type="button"
                        onClick={handleRubricRemove}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <select
                      value={rubricId ?? ""}
                      onChange={(e) => {
                        const id = e.target.value || null;
                        const r = availableRubrics.find((x) => x.id === id);
                        setRubricId(id);
                        setRubricName(r?.title ?? null);
                      }}
                      disabled={isLocked || availableRubrics.length === 0}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100"
                    >
                      <option value="">Select rubric...</option>
                      {availableRubrics.map((r) => (
                        <option key={r.id} value={r.id}>{r.title}</option>
                      ))}
                    </select>
                    <Link href="/teacher/assignments/rubrics">
                      <span className="text-xs font-medium text-teal-600 hover:underline">
                        Create new rubric
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Actions</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {isLocked
                ? "Editing is locked after submitting to AQAD."
                : "Save locally or submit for academic quality review."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {saveToast && (
                <span className={cn("text-sm", saveToast === "saved" && "text-emerald-600")}>
                  {saveToast === "saving" ? "Saving…" : "Draft saved."}
                </span>
              )}
              <Button
                type="button"
                variant="primary"
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleSaveDraft}
                disabled={isLocked || saveToast === "saving"}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSubmitToAqad}
                disabled={isLocked || !title.trim() || saveToast === "saving"}
              >
                Submit to AQAD
              </Button>
              {status !== "Draft" && (
                <span className={cn("mt-2 inline-flex rounded px-2 py-1 text-xs font-semibold", statusStyles[status])}>
                  {status}
                </span>
              )}
            </div>
          </Card>

          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900">Your drafts</h3>
            {drafts.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No saved drafts yet.</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {drafts.slice(-5).reverse().map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-medium text-slate-800">{d.title || "Untitled"}</span>
                    <span className={cn("shrink-0 rounded px-1.5 py-0.5 font-medium", statusStyles[d.status])}>
                      {d.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
