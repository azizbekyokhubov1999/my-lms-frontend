"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ExamResult {
  id: number;
  courseName: string;
  examDate: string;
  grade: number;
  status: "Passed" | "Failed";
  feedback: string;
  sectionBreakdown: { section: string; score: number; max: number }[];
}

const MOCK_RESULTS: ExamResult[] = [
  {
    id: 1,
    courseName: "Algorithms and Data Structures",
    examDate: "Mar 5, 2026",
    grade: 87,
    status: "Passed",
    feedback: "Strong performance on graph algorithms. Consider reviewing dynamic programming.",
    sectionBreakdown: [
      { section: "Multiple Choice", score: 22, max: 25 },
      { section: "Short Answer", score: 18, max: 25 },
      { section: "Problem Solving", score: 28, max: 35 },
      { section: "Essay", score: 19, max: 15 },
    ],
  },
  {
    id: 2,
    courseName: "Distributed Systems",
    examDate: "Feb 28, 2026",
    grade: 72,
    status: "Passed",
    feedback: "Good understanding of consensus protocols. Focus on fault-tolerance concepts.",
    sectionBreakdown: [
      { section: "Theory", score: 30, max: 40 },
      { section: "Case Studies", score: 22, max: 30 },
      { section: "Design Problems", score: 20, max: 30 },
    ],
  },
  {
    id: 3,
    courseName: "Research Methods",
    examDate: "Feb 20, 2026",
    grade: 45,
    status: "Failed",
    feedback: "Needs improvement in methodology design and citation standards.",
    sectionBreakdown: [
      { section: "Research Design", score: 8, max: 20 },
      { section: "Literature Review", score: 12, max: 25 },
      { section: "Ethics & Citations", score: 15, max: 25 },
      { section: "Analysis", score: 10, max: 30 },
    ],
  },
];

interface DetailsModalProps {
  result: ExamResult | null;
  onClose: () => void;
}

function DetailsModal({ result, onClose }: DetailsModalProps) {
  if (!result) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 id="modal-title" className="text-base font-semibold text-slate-900">
            Exam breakdown: {result.courseName}
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            {result.examDate} • Grade: {result.grade}/100
          </p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-2 font-medium text-slate-700">Section</th>
                <th className="pb-2 font-medium text-slate-700">Score</th>
                <th className="pb-2 text-right font-medium text-slate-700">
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {result.sectionBreakdown.map((row) => {
                const pct =
                  row.max > 0 ? Math.round((row.score / row.max) * 100) : 0;
                return (
                  <tr key={row.section} className="border-b border-slate-100">
                    <td className="py-2 text-slate-800">{row.section}</td>
                    <td className="py-2 text-slate-700">
                      {row.score} / {row.max}
                    </td>
                    <td className="py-2 text-right font-medium text-slate-700">
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {result.feedback}
          </p>
        </div>
        <div className="flex justify-end border-t border-slate-200 px-4 py-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ExamResultsPage() {
  const [selectedResult, setSelectedResult] = React.useState<ExamResult | null>(
    null,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Exam results
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          View your exam grades, feedback, and section breakdowns.
        </p>
      </section>

      {/* GPA statistics */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">GPA summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Card className="rounded-lg border-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Current GPA
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">3.42</p>
            <p className="mt-0.5 text-xs text-slate-600">Out of 4.0 scale</p>
          </Card>
          <Card className="rounded-lg border-slate-200">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total credits earned
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">78</p>
            <p className="mt-0.5 text-xs text-slate-600">Credit hours completed</p>
          </Card>
        </div>
      </section>

      {/* Results table */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">All results</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Exam date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Feedback
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MOCK_RESULTS.map((result) => (
                  <tr
                    key={result.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {result.courseName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {result.examDate}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      {result.grade}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                          result.status === "Passed"
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-red-50 text-red-700",
                        )}
                      >
                        {result.status}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-slate-600">
                      {result.feedback}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedResult(result)}
                      >
                        View details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <DetailsModal
        result={selectedResult}
        onClose={() => setSelectedResult(null)}
      />
    </div>
  );
}
