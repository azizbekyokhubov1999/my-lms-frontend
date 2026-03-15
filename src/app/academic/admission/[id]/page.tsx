"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

const MOCK_APPLICANTS: Record<string, { name: string; applicationId: string; faculty: string; program: string }> = {
  a1: { name: "Anna Petrova", applicationId: "APP-2026-001", faculty: "Engineering", program: "BSc Software Development" },
  a2: { name: "Ivan Kozlov", applicationId: "APP-2026-002", faculty: "Engineering", program: "BSc Computer Science" },
  a3: { name: "Maria Sokolova", applicationId: "APP-2026-003", faculty: "Business", program: "MBA Business Administration" },
  a4: { name: "Dmitri Volkov", applicationId: "APP-2026-004", faculty: "Law", program: "LLB Law" },
  a5: { name: "Elena Novikova", applicationId: "APP-2026-005", faculty: "Engineering", program: "BSc Software Development" },
};

const MOCK_DOCS = [
  { id: "d1", label: "Application form", type: "PDF" },
  { id: "d2", label: "Transcript", type: "PDF" },
  { id: "d3", label: "ID copy", type: "PDF" },
];

export default function ApplicantReviewPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const applicant = id ? MOCK_APPLICANTS[id] : null;

  const [evalScores, setEvalScores] = React.useState({ academic: "", motivation: "", language: "", notes: "" });

  if (!applicant) {
    return (
      <div className="space-y-6">
        <Link href="/academic/admission" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Admission Queue
        </Link>
        <p className="text-slate-600">Applicant not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/academic/admission" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Admission Queue
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{applicant.name}</h1>
          <p className="mt-0.5 text-sm text-slate-600">{applicant.applicationId} · {applicant.program}</p>
        </div>
        <Link
          href={`/academic/admission/${id}/decision`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700"
        >
          Make decision
        </Link>
      </div>

      {/* Split-screen */}
      <div className="grid min-h-[480px] gap-4 lg:grid-cols-2">
        {/* Left: Documents (PDFs) */}
        <Card className="flex flex-col p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Student documents</h2>
          <p className="mt-0.5 text-xs text-slate-600">PDFs submitted with the application.</p>
          <ul className="mt-4 flex-1 space-y-2">
            {MOCK_DOCS.map((doc) => (
              <li key={doc.id}>
                <button
                  type="button"
                  onClick={() => alert(`Open PDF: ${doc.label} (Demo)`)}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:bg-slate-100"
                >
                  <span className="rounded bg-rose-100 p-2 text-rose-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {doc.label} ({doc.type})
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Right: Academic evaluation form */}
        <Card className="flex flex-col p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Academic evaluation</h2>
          <p className="mt-0.5 text-xs text-slate-600">Evaluation form for this applicant.</p>
          <div className="mt-4 flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800">Academic readiness (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={evalScores.academic}
                onChange={(e) => setEvalScores((s) => ({ ...s, academic: e.target.value }))}
                className="mt-1 w-full max-w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Motivation / fit (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={evalScores.motivation}
                onChange={(e) => setEvalScores((s) => ({ ...s, motivation: e.target.value }))}
                className="mt-1 w-full max-w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Language proficiency (1–5)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={evalScores.language}
                onChange={(e) => setEvalScores((s) => ({ ...s, language: e.target.value }))}
                className="mt-1 w-full max-w-24 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800">Internal notes</label>
              <textarea
                value={evalScores.notes}
                onChange={(e) => setEvalScores((s) => ({ ...s, notes: e.target.value }))}
                rows={3}
                placeholder="Evaluation notes (not shared with applicant)"
                className="mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
