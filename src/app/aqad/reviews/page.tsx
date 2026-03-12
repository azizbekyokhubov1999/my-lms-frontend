"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type StatusFilter =
  | "all"
  | "Draft"
  | "InReview"
  | "Needs Clarification"
  | "Major Changes Required"
  | "Ready for Publication"
  | "Approved"
  | "Rejected";

type PriorityFilter = "all" | "High" | "Medium" | "Low";
type DateFilter = "all" | "7" | "30" | "90";

interface ReviewItem {
  id: string;
  courseName: string;
  module: string;
  teacher: string;
  faculty: string;
  priority: "High" | "Medium" | "Low";
  submitted: string;
  submittedTs: number; // for date filtering
  status:
    | "Draft"
    | "InReview"
    | "Needs Clarification"
    | "Major Changes Required"
    | "Ready for Publication"
    | "Approved"
    | "Rejected";
  assignedReviewerId?: string;
}

const FACULTIES = ["All", "Computer Science", "Engineering", "Research", "Business"] as const;

const REVIEWERS = [
  { id: "rev1", name: "Jane Smith" },
  { id: "rev2", name: "John Doe" },
  { id: "rev3", name: "Maria Garcia" },
];

const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    courseName: "CS 440 - Machine Learning",
    module: "Introduction to ML",
    teacher: "Prof. Sarah Chen",
    faculty: "Computer Science",
    priority: "High",
    submitted: "Mar 6, 2026",
    submittedTs: new Date("2026-03-06").getTime(),
    status: "InReview",
    assignedReviewerId: "rev1",
  },
  {
    id: "2",
    courseName: "CS 210 - Data Structures",
    module: "Trees and Graphs",
    teacher: "Dr. James Wilson",
    faculty: "Computer Science",
    priority: "Medium",
    submitted: "Mar 5, 2026",
    submittedTs: new Date("2026-03-05").getTime(),
    status: "Needs Clarification",
    assignedReviewerId: "rev2",
  },
  {
    id: "3",
    courseName: "RES 301 - Research Methods",
    module: "Qualitative Methods",
    teacher: "Dr. Emma Davis",
    faculty: "Research",
    priority: "High",
    submitted: "Mar 4, 2026",
    submittedTs: new Date("2026-03-04").getTime(),
    status: "Major Changes Required",
  },
  {
    id: "4",
    courseName: "CS 350 - Database Systems",
    module: "Normalization",
    teacher: "Prof. Michael Brown",
    faculty: "Computer Science",
    priority: "Low",
    submitted: "Mar 3, 2026",
    submittedTs: new Date("2026-03-03").getTime(),
    status: "Draft",
  },
  {
    id: "5",
    courseName: "CS 480 - Distributed Systems",
    module: "Consensus Protocols",
    teacher: "Dr. Lisa Park",
    faculty: "Computer Science",
    priority: "Medium",
    submitted: "Mar 2, 2026",
    submittedTs: new Date("2026-03-02").getTime(),
    status: "Ready for Publication",
    assignedReviewerId: "rev1",
  },
  {
    id: "6",
    courseName: "CS 220 - Algorithms",
    module: "Greedy Algorithms",
    teacher: "Prof. David Kim",
    faculty: "Computer Science",
    priority: "High",
    submitted: "Feb 28, 2026",
    submittedTs: new Date("2026-02-28").getTime(),
    status: "Rejected",
  },
  {
    id: "7",
    courseName: "EE 320 - Digital Signal Processing",
    module: "Filter Design",
    teacher: "Dr. James Wilson",
    faculty: "Engineering",
    priority: "Medium",
    submitted: "Mar 1, 2026",
    submittedTs: new Date("2026-03-01").getTime(),
    status: "InReview",
  },
  {
    id: "8",
    courseName: "BUS 210 - Organizational Behavior",
    module: "Team Dynamics",
    teacher: "Dr. Lisa Park",
    faculty: "Business",
    priority: "Low",
    submitted: "Feb 25, 2026",
    submittedTs: new Date("2026-02-25").getTime(),
    status: "Approved",
    assignedReviewerId: "rev3",
  },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Draft", label: "Draft" },
  { key: "InReview", label: "In review" },
  { key: "Needs Clarification", label: "Needs clarification" },
  { key: "Major Changes Required", label: "Major changes required" },
  { key: "Ready for Publication", label: "Ready for publication" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

function getStatusStyles(status: ReviewItem["status"]) {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700";
    case "InReview":
      return "bg-amber-50 text-amber-800";
    case "Needs Clarification":
      return "bg-amber-100 text-amber-900 border border-amber-200";
    case "Major Changes Required":
      return "bg-red-100 text-red-800 border border-red-200";
    case "Ready for Publication":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Approved":
      return "bg-emerald-50 text-emerald-800";
    case "Rejected":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function ContentReviewListPage() {
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [facultyFilter, setFacultyFilter] = React.useState<string>("All");
  const [priorityFilter, setPriorityFilter] = React.useState<PriorityFilter>("all");
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("all");
  const [assignments, setAssignments] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    REVIEWS.forEach((r) => {
      if (r.assignedReviewerId) initial[r.id] = r.assignedReviewerId;
    });
    return initial;
  });

  const now = Date.now();
  const msByDays = (d: number) => d * 24 * 60 * 60 * 1000;

  const filteredReviews = REVIEWS.filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    if (facultyFilter !== "All" && row.faculty !== facultyFilter) return false;
    if (priorityFilter !== "all" && row.priority !== priorityFilter) return false;
    if (dateFilter !== "all") {
      const cutoff = now - msByDays(Number(dateFilter));
      if (row.submittedTs < cutoff) return false;
    }
    return true;
  });

  const handleAssign = (reviewId: string, reviewerId: string) => {
    setAssignments((prev) =>
      reviewerId ? { ...prev, [reviewId]: reviewerId } : (() => {
        const next = { ...prev };
        delete next[reviewId];
        return next;
      })(),
    );
  };

  const getAssignedName = (row: ReviewItem) => {
    const id = assignments[row.id] ?? row.assignedReviewerId;
    return id ? REVIEWERS.find((r) => r.id === id)?.name ?? "—" : "—";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Approval workflow
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Draft → In review → Approved / Rejected. Filter by faculty, priority, and submission date.
        </p>
      </section>

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </span>
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                statusFilter === item.key
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2">
            <label htmlFor="faculty-filter" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Faculty
            </label>
            <select
              id="faculty-filter"
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {FACULTIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Priority
            </span>
            {(["all", "High", "Medium", "Low"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  priorityFilter === p
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
                )}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Submission date
            </span>
            {(["all", "7", "30", "90"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDateFilter(d)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  dateFilter === d
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
                )}
              >
                {d === "all" ? "All" : `Last ${d} days`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Table */}
      <section>
        <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course / Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Faculty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Assigned to
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                      No reviews match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <span className="block font-medium text-slate-900">
                          {row.courseName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {row.module}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.faculty}</td>
                      <td className="px-4 py-3 text-slate-600">{row.teacher}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded px-1.5 py-0.5 text-xs font-semibold",
                            row.priority === "High" && "bg-red-50 text-red-700",
                            row.priority === "Medium" && "bg-amber-50 text-amber-700",
                            row.priority === "Low" && "bg-slate-100 text-slate-600",
                          )}
                        >
                          {row.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.submitted}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            getStatusStyles(row.status),
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={assignments[row.id] ?? row.assignedReviewerId ?? ""}
                          onChange={(e) => handleAssign(row.id, e.target.value)}
                          className="rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          aria-label={`Assign reviewer for ${row.courseName}`}
                        >
                          <option value="">— Assign —</option>
                          {REVIEWERS.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/aqad/reviews/${row.id}`}>
                          <Button type="button" variant="secondary" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </div>
  );
}
