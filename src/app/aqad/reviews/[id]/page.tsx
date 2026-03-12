"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// Mock audit data for the review
const MOCK_AUDIT = {
  courseName: "Advanced Algorithms",
  courseCode: "CS 450",
  instructor: "Prof. Sarah Chen",
  reviewDate: "Mar 6, 2026",
  checklistVersion: "v2.4",
  academicStandards: [
    { criterion: "Learning outcomes", status: "pass" as const, detail: "5 measurable outcomes; all aligned to Bloom's taxonomy." },
    { criterion: "Syllabus alignment", status: "pass" as const, detail: "Weekly topics and assessments match syllabus 100%." },
  ],
  contentQuality: [
    { criterion: "Video resolution", status: "pass" as const, detail: "1080p minimum; all lectures HD." },
    { criterion: "Audio clarity", status: "pass" as const, detail: "No background noise; consistent levels." },
    { criterion: "Subtitles", status: "flag" as const, detail: "Lecture 3 missing EN captions; requested." },
  ],
  assessmentIntegrity: [
    { criterion: "Quiz difficulty", status: "pass" as const, detail: "Aligned with outcomes; no ceiling effects." },
    { criterion: "Proctored exam settings", status: "pass" as const, detail: "Face + screen capture; rules documented." },
  ],
  reviewerComments: [
    { content: "Week 1–2: Intro and complexity. Learning outcomes 1–2 covered.", note: "Clear structure. No issues." },
    { content: "Week 3: Lecture 3 – Dynamic programming. Video 45 min.", note: "FLAG: Subtitles missing. Instructor notified." },
    { content: "Midterm: 20 MC + 2 long-form. Proctoring enabled.", note: "Settings verified. No changes needed." },
  ],
  timeline: [
    { step: "Submitted", date: "Feb 28, 2026", by: "Prof. Sarah Chen", status: "done" as const },
    { step: "Flagged", date: "Mar 2, 2026", by: "Jane Smith (AQAD)", status: "done" as const },
    { step: "Fixed", date: "Mar 5, 2026", by: "Prof. Sarah Chen", status: "done" as const },
    { step: "Approved", date: "Mar 6, 2026", by: "Jane Smith (AQAD)", status: "current" as const },
  ],
};

function StatusBadge({ status }: { status: "pass" | "flag" | "fail" }) {
  const styles = {
    pass: "bg-emerald-100 text-emerald-800",
    flag: "bg-amber-100 text-amber-800",
    fail: "bg-red-100 text-red-800",
  };
  const labels = { pass: "Pass", flag: "Flag", fail: "Fail" };
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", styles[status])}>
      {labels[status]}
    </span>
  );
}

export default function QualityAuditPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [exporting, setExporting] = React.useState(false);

  const handleExportPdf = () => {
    setExporting(true);
    try {
      window.print();
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Print: hide sidebar/header; use global .no-print in your CSS if needed */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@media print { .no-print, header, aside, [aria-label="AQAD dashboard navigation"] { display: none !important; } main { padding: 0 !important; } }`,
        }}
      />

      <section className="no-print">
        <Link href="/aqad/reviews" className="text-xs font-medium text-indigo-600 hover:underline">
          ← Back to Course Reviews
        </Link>
      </section>

      {/* 1. Header */}
      <header className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl print:text-lg">
          Quality Audit Checklist
        </h1>
        <p className="mt-1 text-sm text-slate-600 print:text-xs">
          Review ID: {id ?? "—"}
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:text-xs">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Course</dt>
            <dd className="mt-0.5 font-medium text-slate-900">
              {MOCK_AUDIT.courseName} <span className="text-slate-500">({MOCK_AUDIT.courseCode})</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Instructor</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{MOCK_AUDIT.instructor}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Review date</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{MOCK_AUDIT.reviewDate}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Checklist version</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{MOCK_AUDIT.checklistVersion}</dd>
          </div>
        </dl>
      </header>

      {/* 2. Audit Sections */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Audit sections</h2>
        <div className="mt-3 grid gap-4 lg:grid-cols-3">
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Academic Standards
            </h3>
            <ul className="mt-3 space-y-2">
              {MOCK_AUDIT.academicStandards.map((item) => (
                <li key={item.criterion} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.criterion}</p>
                    <p className="text-xs text-slate-600">{item.detail}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </Card>
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Content Quality
            </h3>
            <ul className="mt-3 space-y-2">
              {MOCK_AUDIT.contentQuality.map((item) => (
                <li key={item.criterion} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.criterion}</p>
                    <p className="text-xs text-slate-600">{item.detail}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </Card>
          <Card className="rounded-lg border-slate-200 p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Assessment Integrity
            </h3>
            <ul className="mt-3 space-y-2">
              {MOCK_AUDIT.assessmentIntegrity.map((item) => (
                <li key={item.criterion} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.criterion}</p>
                    <p className="text-xs text-slate-600">{item.detail}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* 3. Reviewer Comments — side-by-side */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Reviewer comments</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Content vs. auditor notes and flags
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="grid border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid-cols-2">
            <div>Content / Section</div>
            <div>Auditor notes &amp; flags</div>
          </div>
          <ul className="divide-y divide-slate-100">
            {MOCK_AUDIT.reviewerComments.map((row, i) => (
              <li key={i} className="grid gap-4 px-4 py-3 sm:grid-cols-2">
                <div className="text-sm text-slate-700">{row.content}</div>
                <div className="text-sm text-slate-800 font-medium">{row.note}</div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* 4. Decision Timeline — vertical stepper */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">Decision timeline</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          History of this review
        </p>
        <Card className="mt-3 rounded-lg border-slate-200 p-4">
          <ul className="relative space-y-0">
            {MOCK_AUDIT.timeline.map((item, i) => (
              <li key={item.step} className="relative flex gap-4 pb-8 last:pb-0">
                {i < MOCK_AUDIT.timeline.length - 1 && (
                  <span
                    className="absolute left-[11px] top-6 bottom-0 w-px bg-slate-200"
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    item.status === "current"
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-slate-200 text-slate-700",
                  )}
                >
                  {item.status === "current" ? "✓" : i + 1}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="font-medium text-slate-900">{item.step}</p>
                  <p className="text-xs text-slate-500">
                    {item.date} · {item.by}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* 5. Export PDF */}
      <section className="no-print">
        <Card className="rounded-lg border-slate-200 p-4">
          <p className="text-sm text-slate-600">
            Download this audit as a PDF using your browser&apos;s print dialog (Print → Save as PDF).
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={handleExportPdf}
            disabled={exporting}
            className="mt-3 bg-indigo-600 hover:bg-indigo-700"
          >
            {exporting ? "Opening print…" : "Export / Print to PDF"}
          </Button>
        </Card>
      </section>
    </div>
  );
}
