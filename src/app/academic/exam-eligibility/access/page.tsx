"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface AccessRow {
  id: string;
  type: "group" | "module";
  name: string;
  open: boolean;
}

const MOCK_GROUPS: AccessRow[] = [
  { id: "g1", type: "group", name: "SD-24-01", open: true },
  { id: "g2", type: "group", name: "SD-24-02", open: true },
  { id: "g3", type: "group", name: "CS-23-01", open: false },
];

const MOCK_MODULES: AccessRow[] = [
  { id: "m1", type: "module", name: "CS101", open: true },
  { id: "m2", type: "module", name: "SE201", open: true },
  { id: "m3", type: "module", name: "CS102", open: false },
];

export default function ExamAccessPage() {
  const [groups, setGroups] = React.useState(MOCK_GROUPS);
  const [modules, setModules] = React.useState(MOCK_MODULES);

  const toggle = (list: AccessRow[], setList: React.Dispatch<React.SetStateAction<AccessRow[]>>, id: string) => {
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, open: !r.open } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/exam-eligibility" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Exam eligibility
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Exam access control</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Master switch to open or close exam portals for specific groups or modules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">By group</h2>
          <p className="mt-0.5 text-xs text-slate-600">When closed, students in this group cannot access exam portal for any module.</p>
          <ul className="mt-4 space-y-2">
            {groups.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
              >
                <span className="font-medium text-slate-900">{r.name}</span>
                <button
                  type="button"
                  onClick={() => toggle(groups, setGroups, r.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                    r.open ? "bg-purple-600" : "bg-slate-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                      r.open ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">By module</h2>
          <p className="mt-0.5 text-xs text-slate-600">When closed, no student can access this module's exam regardless of group.</p>
          <ul className="mt-4 space-y-2">
            {modules.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
              >
                <span className="font-medium text-slate-900">{r.name}</span>
                <button
                  type="button"
                  onClick={() => toggle(modules, setModules, r.id)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2",
                    r.open ? "bg-purple-600" : "bg-slate-200",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
                      r.open ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border-purple-200 bg-purple-50/30 p-4">
        <p className="text-sm text-purple-900">
          <strong>Summary:</strong> Portal is open when both the student's group and the module are open. Changes take effect immediately.
        </p>
      </Card>
    </div>
  );
}
