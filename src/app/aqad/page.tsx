"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// 1. Quality KPIs (4 cards per AQAD Guide)
const KPI_CARDS = [
  {
    label: "Courses Pending Review",
    value: "23",
    subtext: "Awaiting AQAD approval",
  },
  {
    label: "Average Compliance Rate",
    value: "94%",
    subtext: "University-wide",
  },
  {
    label: "Active Complaints",
    value: "7",
    subtext: "Under investigation",
  },
  {
    label: "Exams Flagged for Fraud",
    value: "2",
    subtext: "Require review",
  },
];

// 2. Review Priority Queue — courses with status "In Review" and SLA deadline
const REVIEW_QUEUE = [
  {
    id: "r1",
    courseName: "Research Methodology – Qualitative Methods",
    courseCode: "RES 301",
    teacher: "Dr. Emma Davis",
    status: "In Review",
    slaDeadline: "Mar 12, 2026",
    daysLeft: 6,
  },
  {
    id: "r2",
    courseName: "Advanced Algorithms",
    courseCode: "CS 450",
    teacher: "Prof. Sarah Chen",
    status: "In Review",
    slaDeadline: "Mar 10, 2026",
    daysLeft: 4,
  },
  {
    id: "r3",
    courseName: "Digital Signal Processing",
    courseCode: "EE 320",
    teacher: "Dr. James Wilson",
    status: "In Review",
    slaDeadline: "Mar 14, 2026",
    daysLeft: 8,
  },
  {
    id: "r4",
    courseName: "Organizational Behavior",
    courseCode: "BUS 210",
    teacher: "Dr. Lisa Park",
    status: "In Review",
    slaDeadline: "Mar 8, 2026",
    daysLeft: 2,
  },
];

// 3. Quality Trend — university overall quality score, last 6 months
const QUALITY_TREND = [
  { month: "Oct", score: 7.4 },
  { month: "Nov", score: 7.8 },
  { month: "Dec", score: 7.6 },
  { month: "Jan", score: 8.0 },
  { month: "Feb", score: 8.1 },
  { month: "Mar", score: 8.2 },
];

// 4. Risk Indicators — high dropout risk or low student feedback
const RISK_INDICATORS = [
  {
    id: "risk1",
    type: "dropout_risk" as const,
    label: "High dropout risk",
    courseName: "Physics 201",
    teacher: "Prof. Michael Brown",
    detail: "Dropout risk 34% (threshold 25%)",
    severity: "high" as const,
  },
  {
    id: "risk2",
    type: "low_feedback" as const,
    label: "Low student feedback",
    courseName: "Chemistry 101",
    teacher: "Dr. Emma Davis",
    detail: "Feedback score 3.2/5 (threshold 3.5)",
    severity: "medium" as const,
  },
  {
    id: "risk3",
    type: "dropout_risk" as const,
    label: "High dropout risk",
    courseName: "Biology 301",
    teacher: "Dr. Lisa Park",
    detail: "Dropout risk 28% (threshold 25%)",
    severity: "medium" as const,
  },
  {
    id: "risk4",
    type: "low_feedback" as const,
    label: "Low student feedback",
    courseName: "Statistics 200",
    teacher: "Prof. Sarah Chen",
    detail: "Feedback score 3.1/5 (threshold 3.5)",
    severity: "high" as const,
  },
];

export default function AqadOverviewPage() {
  const maxScore = Math.max(...QUALITY_TREND.map((d) => d.score));
  const minScore = Math.min(...QUALITY_TREND.map((d) => d.score));

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          AQAD Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Quality KPIs, review queue, trends, and risk indicators.
        </p>
      </section>

      {/* 1. Quality KPIs — 4 cards (monitoring-related ones link to /aqad/monitoring) */}
      <section>
        <h2 className="sr-only">Quality KPIs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPI_CARDS.map((card) => {
            const isMonitoring =
              card.label === "Exams Flagged for Fraud" ||
              card.label === "Active Complaints";
            const href =
              card.label === "Exams Flagged for Fraud"
                ? "/aqad/monitoring"
                : card.label === "Active Complaints"
                  ? "/aqad/complaints"
                  : null;
            const cardContent = (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="mt-0.5 text-xs text-slate-600">{card.subtext}</p>
              </>
            );
            return (
              <Card
                key={card.label}
                className={cn(
                  "rounded-lg border-slate-200 bg-white",
                  isMonitoring && href && "transition-colors hover:border-indigo-300 hover:shadow-sm",
                )}
              >
                {href ? (
                  <Link
                    href={href}
                    className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg -m-px p-px"
                    aria-label={`${card.label}: ${card.value}, view details`}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 2. Review Priority Queue — In Review + SLA deadline */}
      <section>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Review Priority Queue
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Courses with status &quot;In Review&quot; and SLA deadline
            </p>
          </div>
          <Link href="/aqad/reviews">
            <Button type="button" variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Teacher
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    SLA deadline
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {REVIEW_QUEUE.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-900">
                        {row.courseName}
                      </span>
                      <span className="ml-1 text-xs text-slate-500">
                        {row.courseCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.teacher}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-800">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "font-medium",
                          row.daysLeft <= 2
                            ? "text-amber-700"
                            : "text-slate-700",
                        )}
                      >
                        {row.slaDeadline}
                      </span>
                      <span className="ml-1 text-xs text-slate-500">
                        ({row.daysLeft} days left)
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

      {/* 3. Quality Trend Chart + 4. Risk Indicators */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quality Trend Chart — overall quality score, last 6 months */}
        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Quality Trend
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            University overall quality score over the last 6 months
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200">
            <div className="relative h-52 px-4 pt-2 pb-8">
              <svg
                viewBox="0 0 300 140"
                className="h-full w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="aqadLineGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
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
                <polyline
                  fill="none"
                  stroke="url(#aqadLineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={QUALITY_TREND.map((d, i) => {
                    const x = (i / (QUALITY_TREND.length - 1)) * 280 + 10;
                    const range = maxScore - minScore || 1;
                    const y = 120 - ((d.score - minScore) / range) * 100;
                    return `${x},${y}`;
                  }).join(" ")}
                />
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
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-6 text-[10px] font-medium text-slate-500">
                {QUALITY_TREND.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 px-4 py-2 text-center text-xs text-slate-500">
              Overall quality score (0–10)
            </div>
          </Card>
        </section>

        {/* 4. Risk Indicators — dropout risk & low feedback */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Risk Indicators
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            High dropout risk or low student feedback scores
          </p>
          <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
            <ul className="divide-y divide-slate-100">
              {RISK_INDICATORS.map((item) => (
                <li key={item.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                          item.severity === "high"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800",
                        )}
                      >
                        {item.type === "dropout_risk" ? "Dropout" : "Feedback"}
                      </span>
                      <p className="mt-1.5 font-medium text-slate-900">
                        {item.courseName}
                      </p>
                      <p className="text-xs text-slate-600">{item.teacher}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {item.detail}
                      </p>
                    </div>
                    <Link href="/aqad/monitoring" className="shrink-0">
                      <Button type="button" variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2">
              <Link
                href="/aqad/monitoring"
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                View all monitoring →
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
