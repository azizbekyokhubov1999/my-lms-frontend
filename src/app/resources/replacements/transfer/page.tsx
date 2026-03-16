"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const TRANSFER_STEPS = [
  { id: "materials", label: "Course materials", description: "Syllabus, slides, handouts" },
  { id: "notes", label: "Lecture notes", description: "Instructor notes and scripts" },
  { id: "groups", label: "Active student groups", description: "Reassign ownership to new teacher" },
  { id: "notify", label: "Notify students", description: "Automatically notify all affected groups" },
];

export default function ContentTransferPage() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({
    materials: false,
    notes: false,
    groups: false,
    notify: false,
  });
  const [completed, setCompleted] = React.useState(false);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const allChecked = TRANSFER_STEPS.every((s) => checked[s.id]);
  const currentStepIndex = TRANSFER_STEPS.findIndex((s) => !checked[s.id]);
  const currentStep = currentStepIndex < 0 ? TRANSFER_STEPS.length : currentStepIndex;

  const handleComplete = () => {
    if (!allChecked) return;
    setCompleted(true);
    setTimeout(() => setCompleted(false), 3000);
    // Demo: "System notifies all students in affected groups automatically"
    alert("Transfer complete. All students in affected groups have been notified automatically (Demo).");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/resources/replacements" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Replacements
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Content transfer</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Checklist to transfer ownership of course materials, lecture notes, and active student groups to the new teacher. Upon completion, all affected students are notified automatically.
        </p>
      </div>

      {/* Step-by-step progress */}
      <div className="flex items-center gap-1">
        {TRANSFER_STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div
              className={cn(
                "flex flex-1 flex-col items-center rounded-lg border px-2 py-2 text-center",
                checked[s.id] ? "border-teal-500 bg-teal-50" : i === currentStep ? "border-teal-300 bg-teal-50/50" : "border-slate-200 bg-slate-50",
              )}
            >
              <span className="text-xs font-semibold text-slate-600">Step {i + 1}</span>
              <span className="mt-0.5 text-xs text-slate-700">{s.label}</span>
              {checked[s.id] && (
                <span className="mt-1 text-teal-600" aria-hidden>✓</span>
              )}
            </div>
            {i < TRANSFER_STEPS.length - 1 && (
              <div className={cn("h-0.5 w-2", checked[s.id] ? "bg-teal-500" : "bg-slate-200")} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="border-teal-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Transfer checklist</h2>
        <p className="mt-0.5 text-xs text-slate-600">Complete each item. Order recommended: materials → notes → groups → notify.</p>
        <ul className="mt-4 space-y-3">
          {TRANSFER_STEPS.map((s) => (
            <li key={s.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={checked[s.id]}
                  onChange={() => toggle(s.id)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <p className="font-medium text-slate-900">{s.label}</p>
                  <p className="text-xs text-slate-600">{s.description}</p>
                </div>
                {checked[s.id] && (
                  <span className="ml-auto text-teal-600" aria-hidden>Done</span>
                )}
              </label>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-lg border border-teal-200 bg-teal-50/50 p-4">
          <p className="text-sm font-medium text-slate-800">Upon completion</p>
          <p className="mt-0.5 text-xs text-slate-600">
            The system will automatically notify all students in the affected groups that the replacement is complete and the new teacher is now responsible for the course.
          </p>
          <Button
            type="button"
            className="mt-3 bg-teal-600 hover:bg-teal-700"
            disabled={!allChecked}
            onClick={handleComplete}
          >
            {completed ? "Completed" : "Complete transfer & notify students"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
