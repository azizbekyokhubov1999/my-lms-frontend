"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const KPI_CARDS = [
  {
    label: "Pending Reviews",
    value: "23",
    subtext: "Awaiting approval",
    trend: "up",
  },
  {
    label: "Audit Completion Rate",
    value: "94%",
    subtext: "Last 30 days",
    trend: "up",
  },
  {
    label: "Active Complaints",
    value: "7",
    subtext: "Under investigation",
    trend: "down",
  },
  {
    label: "Average Quality Score",
    value: "8.2",
    subtext: "Out of 10",
    trend: "up",
  },
];

const RECENT_REQUESTS = [
  {
    id: 1,
    module: "Introduction to Machine Learning",
    teacher: "Prof. Sarah Chen",
    course: "CS 440",
    submitted: "Mar 6, 2026",
    status: "Pending",
  },
  {
    id: 2,
    module: "Data Structures – Trees and Graphs",
    teacher: "Dr. James Wilson",
    course: "CS 210",
    submitted: "Mar 5, 2026",
    status: "Pending",
  },
  {
    id: 3,
    module: "Research Methodology – Qualitative Methods",
    teacher: "Dr. Emma Davis",
    course: "RES 301",
    submitted: "Mar 4, 2026",
    status: "In review",
  },
  {
    id: 4,
    module: "Database Systems – Normalization",
    teacher: "Prof. Michael Brown",
    course: "CS 350",
    submitted: "Mar 3, 2026",
    status: "Pending",
  },
  {
    id: 5,
    module: "Distributed Systems – Consensus Protocols",
    teacher: "Dr. Lisa Park",
    course: "CS 480",
    submitted: "Mar 2, 2026",
    status: "Pending",
  },
];

// Mock quality scores for last 6 months (Oct–Mar)
const QUALITY_TREND = [
  { month: "Oct", score: 7.4 },
  { month: "Nov", score: 7.8 },
  { month: "Dec", score: 7.6 },
  { month: "Jan", score: 8.0 },
  { month: "Feb", score: 8.1 },
  { month: "Mar", score: 8.2 },
];

export default function AqadOverviewPage() {
  const maxScore = Math.max(...QUALITY_TREND.map((d) => d.score));
  const minScore = Math.min(...QUALITY_TREND.map((d) => d.score));

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Quality assurance overview
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Monitor pending reviews, audits, complaints, and quality metrics.
        </p>
      </section>

      {/* KPI Cards */}
      <section>
        <h2 className="sr-only">Key performance indicators</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.map((card) => (
            <Card
              key={card.label}
              className="rounded-lg border-slate-200 bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-600">{card.subtext}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                    card.trend === "up"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700",
                  )}
                >
                  {card.trend === "up" ? "↑" : "↓"}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Requests & Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Requests Table */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent content requests
            </h2>
            <Link href="/aqad/reviews">
              <Button type="button" variant="outline" size="sm">
                View all
              </Button>
            </Link>
          </div>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                      Module
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
                  {RECENT_REQUESTS.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {row.module}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="block">{row.teacher}</span>
                        <span className="text-xs text-slate-500">
                          {row.course}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {row.submitted}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            row.status === "Pending"
                              ? "bg-amber-50 text-amber-800"
                              : "bg-indigo-50 text-indigo-800",
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href="/aqad/reviews">
                          <Button type="button" variant="secondary" size="sm">
                            Review
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Quality Trend Chart Placeholder */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Quality compliance trend
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Last 6 months (score out of 10)
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200">
            <div className="relative h-48 px-4 pt-2 pb-6">
              {/* SVG line chart placeholder */}
              <svg
                viewBox="0 0 300 140"
                className="h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={i * 35}
                    x2={300}
                    y2={i * 35}
                    stroke="#e2e8f0"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Line path */}
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={QUALITY_TREND.map((d, i) => {
                    const x = (i / (QUALITY_TREND.length - 1)) * 280 + 10;
                    const range = maxScore - minScore || 1;
                    const y =
                      120 - ((d.score - minScore) / range) * 100;
                    return `${x},${y}`;
                  }).join(" ")}
                />
                {/* Points */}
                {QUALITY_TREND.map((d, i) => {
                  const x = (i / (QUALITY_TREND.length - 1)) * 280 + 10;
                  const range = maxScore - minScore || 1;
                  const y = 120 - ((d.score - minScore) / range) * 100;
                  return (
                    <circle
                      key={d.month}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#4f46e5"
                    />
                  );
                })}
              </svg>
              {/* X-axis labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[10px] font-medium text-slate-500">
                {QUALITY_TREND.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 px-4 py-2 text-center text-xs text-slate-500">
              Line chart placeholder — integrate Chart.js or Recharts for
              production
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
