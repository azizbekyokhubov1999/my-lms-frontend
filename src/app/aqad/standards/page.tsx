"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_CHECKLIST = [
  { id: "1", label: "Learning outcomes are specific and measurable", enabled: true },
  { id: "2", label: "Content coverage aligns with learning outcomes", enabled: true },
  { id: "3", label: "Lecture video meets quality standards (HD, clear audio)", enabled: true },
  { id: "4", label: "Core reading resources are present and current", enabled: true },
  { id: "5", label: "Assessment aligns with outcomes; rubrics are clear", enabled: true },
  { id: "6", label: "Q&A, comments, or chat mechanism enabled", enabled: true },
  { id: "7", label: "Accessibility standards met", enabled: true },
];

const DEFAULT_PROCTORING_RULES = `# Proctoring violation rules (AI flagging)

The following behaviors will be flagged for AQAD review:

1. **Face not detected** – No face in frame for more than 10 seconds during exam.
2. **Multiple faces** – More than one person visible in the camera feed.
3. **Second screen / device** – Detection of additional display or phone.
4. **Looking away repeatedly** – Sustained gaze away from screen (threshold: 30s cumulative per 10 min).
5. **Audio anomalies** – Speech from others or suspicious noise patterns.
6. **Browser/tab switch** – Leaving the exam tab or full-screen without permission.

Severity levels: critical (immediate flag), high (flag + notify), medium (log for spot-check).
`;

type AqadRole = "Reviewer" | "Senior Reviewer" | "Admin";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: AqadRole;
  permissions: string[];
}

const DEFAULT_STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    role: "Senior Reviewer",
    permissions: ["Review courses", "Approve/Reject", "View reports", "Manage checklist"],
  },
  {
    id: "s2",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "Reviewer",
    permissions: ["Review courses", "View reports"],
  },
  {
    id: "s3",
    name: "Maria Garcia",
    email: "maria.garcia@university.edu",
    role: "Admin",
    permissions: ["Review courses", "Approve/Reject", "View reports", "Manage checklist", "Exam audit", "Staff settings"],
  },
];

const ROLE_OPTIONS: AqadRole[] = ["Reviewer", "Senior Reviewer", "Admin"];

export default function StandardsRubricsPage() {
  const [checklist, setChecklist] = React.useState(DEFAULT_CHECKLIST);
  const [newRequirement, setNewRequirement] = React.useState("");
  const [proctoringRules, setProctoringRules] = React.useState(DEFAULT_PROCTORING_RULES);
  const [staff, setStaff] = React.useState<StaffMember[]>(DEFAULT_STAFF);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);

  const showSaved = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const addChecklistItem = () => {
    const trimmed = newRequirement.trim();
    if (!trimmed) return;
    setChecklist((prev) => [
      ...prev,
      { id: String(Date.now()), label: trimmed, enabled: true },
    ]);
    setNewRequirement("");
    showSaved("Checklist requirement added.");
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
    showSaved("Requirement removed.");
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)),
    );
    showSaved("Checklist updated.");
  };

  const saveProctoringRules = () => {
    showSaved("Proctoring violation rules saved. AI will use updated rules for flagging.");
  };

  const updateStaffRole = (id: string, role: AqadRole) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
    showSaved("Staff role updated.");
  };

  return (
    <div className="space-y-6">
      <section>
        <Link
          href="/aqad"
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Standards &amp; rubrics
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage University-wide quality rubrics: course quality checklist, exam proctoring rules, and AQAD role settings.{" "}
          <Link href="/aqad/quality-checklist" className="font-medium text-indigo-600 hover:underline">
            Manage checklist templates
          </Link>
          .
        </p>
      </section>

      {savedMessage && (
        <div
          role="alert"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {savedMessage}
        </div>
      )}

      {/* 1. Checklist Manager */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Course quality checklist
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Requirements used during course review. Add, remove, or disable items.
        </p>
        <Card className="mt-3 rounded-lg border-slate-200 p-4">
          <ul className="space-y-2">
            {checklist.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50/50 px-3 py-2"
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      item.enabled ? "text-slate-900" : "text-slate-500 line-through",
                    )}
                  >
                    {item.label}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => removeChecklistItem(item.id)}
                  className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  aria-label={`Remove "${item.label}"`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
              placeholder="e.g., English subtitles required for all video lectures"
              className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Button
              type="button"
              variant="primary"
              onClick={addChecklistItem}
              disabled={!newRequirement.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Add requirement
            </Button>
          </div>
        </Card>
      </section>

      {/* 2. Exam policies — Proctoring violation rules */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Exam policies</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Proctoring violation rules used by the AI to flag exams. Edit in plain text or Markdown.
        </p>
        <Card className="mt-3 rounded-lg border-slate-200 p-4">
          <label htmlFor="proctoring-rules" className="block text-xs font-medium text-slate-700">
            Proctoring violation rules
          </label>
          <textarea
            id="proctoring-rules"
            rows={14}
            value={proctoringRules}
            onChange={(e) => setProctoringRules(e.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            spellCheck="false"
          />
          <div className="mt-3">
            <Button
              type="button"
              variant="primary"
              onClick={saveProctoringRules}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Save proctoring rules
            </Button>
          </div>
        </Card>
      </section>

      {/* 3. Role settings — AQAD staff assignments and permissions */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Role settings</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Manage internal AQAD staff assignments and permissions
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Staff
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Permissions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={member.role}
                        onChange={(e) =>
                          updateStaffRole(member.id, e.target.value as AqadRole)
                        }
                        className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        aria-label={`Change role for ${member.name}`}
                      >
                        {ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {member.permissions.join(" • ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-4 py-3">
            <Button type="button" variant="outline" size="sm">
              Invite staff member
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
