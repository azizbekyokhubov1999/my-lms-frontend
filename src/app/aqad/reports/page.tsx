"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const EXECUTIVE_KPIS = [
  {
    label: "Overall compliance rate",
    value: "89%",
    subtext: "Lectures passed audit",
  },
  {
    label: "Re-review rate",
    value: "12%",
    subtext: "Needed second check",
  },
  {
    label: "NPS / student feedback",
    value: "72",
    subtext: "Out of 100",
  },
  {
    label: "SLA resolution time",
    value: "3.2 days",
    subtext: "Avg. complaint closure",
  },
];

const DEPARTMENTS = [
  { name: "IT", score: 8.4 },
  { name: "Business", score: 7.9 },
  { name: "Arts", score: 8.1 },
];

const GENERATED_REPORTS = [
  { id: "1", label: "February 2026", generatedAt: "Mar 1, 2026" },
  { id: "2", label: "January 2026", generatedAt: "Feb 1, 2026" },
  { id: "3", label: "December 2025", generatedAt: "Jan 1, 2026" },
];

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: () => void;
}

function GenerateReportModal({
  isOpen,
  onClose,
  onGenerate,
}: GenerateReportModalProps) {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;
    onGenerate();
    setStartDate("");
    setEndDate("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-report-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-4 py-3">
          <h2 id="generate-report-title" className="text-base font-semibold text-slate-900">
            Generate new report
          </h2>
          <p className="mt-0.5 text-xs text-slate-600">
            Select a date range for the quality report.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          <Input
            label="Start date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!startDate || !endDate}
              className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600"
            >
              Generate report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function QualityReportsPage() {
  const [semesterFilter, setSemesterFilter] = React.useState("2026-S1");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [generateModalOpen, setGenerateModalOpen] = React.useState(false);

  const handleGenerate = () => {
    setGenerateModalOpen(false);
    // In production: trigger report generation for selected date range
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Quality reports
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Executive metrics, departmental performance, and generated reports.
        </p>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="semester-filter"
            className="text-xs font-medium text-slate-600"
          >
            Academic semester
          </label>
          <select
            id="semester-filter"
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
          >
            <option value="2026-S1">2026 Spring (S1)</option>
            <option value="2025-F2">2025 Fall (F2)</option>
            <option value="2025-S1">2025 Spring (S1)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="category-filter"
            className="text-xs font-medium text-slate-600"
          >
            Course category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800"
          >
            <option value="all">All</option>
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="arts">Arts</option>
          </select>
        </div>
      </section>

      {/* Executive summary KPIs */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Executive summary
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXECUTIVE_KPIS.map((kpi) => (
            <Card key={kpi.label} className="rounded-lg border-slate-200">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {kpi.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {kpi.value}
              </p>
              <p className="mt-0.5 text-xs text-slate-600">{kpi.subtext}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Departmental performance bar chart */}
        <section>
          <h2 className="text-sm font-semibold text-slate-900">
            Departmental performance
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Quality score by department (out of 10)
          </p>
          <Card className="mt-3 rounded-lg border-slate-200">
            <div className="space-y-4 py-2">
              {DEPARTMENTS.map((dept) => {
                const widthPct = (dept.score / 10) * 100;
                return (
                  <div key={dept.name} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium text-slate-700">
                      {dept.name}
                    </span>
                    <div className="flex-1">
                      <div className="h-8 w-full overflow-hidden rounded-md bg-slate-100">
                        <div
                          className="h-full rounded-md bg-indigo-600 transition-all"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 shrink-0 text-right text-sm font-semibold text-slate-800">
                      {dept.score}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 border-t border-slate-100 pt-2 text-center text-[10px] text-slate-500">
              Bar chart placeholder — filter by semester/category above
            </p>
          </Card>
        </section>

        {/* Report generation */}
        <section>
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Generated reports
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Monthly quality reports
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setGenerateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-600"
            >
              Generate new report
            </Button>
          </div>
          <Card className="mt-3 rounded-lg border-slate-200">
            <ul className="divide-y divide-slate-100">
              {GENERATED_REPORTS.map((report) => (
                <li
                  key={report.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-1 py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {report.label}
                    </p>
                    <p className="text-xs text-slate-500">
                      Generated {report.generatedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm">
                      Download PDF
                    </Button>
                    <Button type="button" variant="secondary" size="sm">
                      Export CSV
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>

      <GenerateReportModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
}
