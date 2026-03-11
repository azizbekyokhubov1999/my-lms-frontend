"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type StatusFilter = "all" | "Draft" | "InReview" | "Approved" | "Rejected";

interface ReviewItem {
  id: string;
  courseName: string;
  module: string;
  teacher: string;
  submitted: string;
  status: "Draft" | "InReview" | "Approved" | "Rejected";
}

const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    courseName: "CS 440 - Machine Learning",
    module: "Introduction to ML",
    teacher: "Prof. Sarah Chen",
    submitted: "Mar 6, 2026",
    status: "InReview",
  },
  {
    id: "2",
    courseName: "CS 210 - Data Structures",
    module: "Trees and Graphs",
    teacher: "Dr. James Wilson",
    submitted: "Mar 5, 2026",
    status: "InReview",
  },
  {
    id: "3",
    courseName: "RES 301 - Research Methods",
    module: "Qualitative Methods",
    teacher: "Dr. Emma Davis",
    submitted: "Mar 4, 2026",
    status: "InReview",
  },
  {
    id: "4",
    courseName: "CS 350 - Database Systems",
    module: "Normalization",
    teacher: "Prof. Michael Brown",
    submitted: "Mar 3, 2026",
    status: "Draft",
  },
  {
    id: "5",
    courseName: "CS 480 - Distributed Systems",
    module: "Consensus Protocols",
    teacher: "Dr. Lisa Park",
    submitted: "Mar 2, 2026",
    status: "Approved",
  },
  {
    id: "6",
    courseName: "CS 220 - Algorithms",
    module: "Greedy Algorithms",
    teacher: "Prof. David Kim",
    submitted: "Feb 28, 2026",
    status: "Rejected",
  },
];

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Draft", label: "Draft" },
  { key: "InReview", label: "In review" },
  { key: "Approved", label: "Approved" },
  { key: "Rejected", label: "Rejected" },
];

export default function ContentReviewListPage() {
  const [filter, setFilter] = React.useState<StatusFilter>("all");

  const filteredReviews =
    filter === "all"
      ? REVIEWS
      : REVIEWS.filter((r) => r.status === filter);

  const getStatusStyles = (status: ReviewItem["status"]) => {
    switch (status) {
      case "Draft":
        return "bg-slate-100 text-slate-700";
      case "InReview":
        return "bg-amber-50 text-amber-800";
      case "Approved":
        return "bg-emerald-50 text-emerald-800";
      case "Rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Content review
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Review and approve course modules submitted by teachers.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Filter by status
        </span>
        {STATUS_FILTERS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              filter === item.key
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700",
            )}
          >
            {item.label}
          </button>
        ))}
      </section>

      {/* Table */}
      <section>
        <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course / Module
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Submitted
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
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                      No reviews match this filter.
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
                      <td className="px-4 py-3 text-slate-600">
                        {row.teacher}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.submitted}
                      </td>
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
