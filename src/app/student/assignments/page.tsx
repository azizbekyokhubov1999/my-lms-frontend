"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TabKey = "active" | "submitted" | "graded";

type AssignmentStatus = "active" | "submitted" | "graded";

interface Assignment {
  id: string;
  subject: string;
  title: string;
  deadline: string; // ISO date
  status: AssignmentStatus;
  score?: number; // when graded
  maxScore?: number;
}

const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    subject: "Distributed Systems",
    title: "Assignment 2: System design reflection",
    deadline: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "active",
  },
  {
    id: "2",
    subject: "Algorithms",
    title: "Problem set 3: Graph algorithms",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "active",
  },
  {
    id: "3",
    subject: "Research Methods",
    title: "Essay draft: Literature review",
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "submitted",
  },
  {
    id: "4",
    subject: "Distributed Systems",
    title: "Assignment 1: Architecture diagram",
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "graded",
    score: 28,
    maxScore: 30,
  },
  {
    id: "5",
    subject: "Algorithms",
    title: "Problem set 2: Dynamic programming",
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "graded",
    score: 22,
    maxScore: 25,
  },
];

function formatCountdown(deadlineIso: string): string {
  const due = new Date(deadlineIso + "T23:59:59");
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}

function formatDate(iso: string): string {
  return new Date(iso + "Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AssignmentsListPage() {
  const [tab, setTab] = React.useState<TabKey>("active");

  const filtered =
    tab === "active"
      ? MOCK_ASSIGNMENTS.filter((a) => a.status === "active")
      : tab === "submitted"
        ? MOCK_ASSIGNMENTS.filter((a) => a.status === "submitted")
        : MOCK_ASSIGNMENTS.filter((a) => a.status === "graded");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "active", label: "Active" },
    { key: "submitted", label: "Submitted" },
    { key: "graded", label: "Graded" },
  ];

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Assignments
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View and submit your assignments by deadline.
        </p>
      </section>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex gap-6" aria-label="Assignment filters">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "border-b-2 py-3 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-sky-600 text-sky-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {filtered.length === 0 ? (
        <Card className="py-12 text-center text-sm text-slate-500">
          No assignments in this category.
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <li key={a.id}>
              <Link href={`/student/assignments/${a.id}`} className="block h-full">
                <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {a.subject}
                  </p>
                  <h2 className="mt-1.5 line-clamp-2 text-sm font-semibold text-slate-900">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600">
                    Deadline: {formatDate(a.deadline)}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      a.status === "active" &&
                        (formatCountdown(a.deadline) === "Overdue"
                          ? "text-red-600"
                          : "text-amber-700"),
                      a.status === "submitted" && "text-slate-600",
                      a.status === "graded" && "text-emerald-700",
                    )}
                  >
                    {a.status === "active" && formatCountdown(a.deadline)}
                    {a.status === "submitted" && "Submitted"}
                    {a.status === "graded" &&
                      a.score != null &&
                      a.maxScore != null &&
                      `Score: ${a.score}/${a.maxScore}`}
                  </p>
                  <span
                    className={cn(
                      "mt-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      a.status === "active" && "bg-amber-100 text-amber-800",
                      a.status === "submitted" && "bg-slate-100 text-slate-700",
                      a.status === "graded" && "bg-emerald-100 text-emerald-800",
                    )}
                  >
                    {a.status === "active" && "Active"}
                    {a.status === "submitted" && "Submitted"}
                    {a.status === "graded" && "Graded"}
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
