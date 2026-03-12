"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type SectionKey = "video" | "document" | "assessment";

interface ChecklistTemplate {
  id: string;
  version: string;
  name: string;
  updatedAt: string;
  sections: {
    video: string[];
    document: string[];
    assessment: string[];
  };
}

const DEFAULT_TEMPLATE: ChecklistTemplate = {
  id: "t1",
  version: "v2.1",
  name: "Default course review template",
  updatedAt: "2026-03-01",
  sections: {
    video: [
      "Video resolution HD (720p minimum)",
      "Audio clear and synced",
      "English subtitles or transcript available",
      "No copyrighted material without clearance",
    ],
    document: [
      "Syllabus matches course catalog",
      "Readings and references are current (within 5 years or justified)",
      "No factual errors in materials",
      "Attributions and citations complete",
    ],
    assessment: [
      "Learning outcomes map to assessment items",
      "Rubrics are explicit and shared with students",
      "Midterm and final difficulty appropriate for level",
      "No duplicate or redundant questions across attempts",
    ],
  },
};

const REVIEWS_USING_CHECKLIST = [
  { reviewId: "1", courseName: "CS 440 - Machine Learning", checklistVersion: "v2.1", reviewedAt: "Mar 6, 2026" },
  { reviewId: "2", courseName: "CS 210 - Data Structures", checklistVersion: "v2.1", reviewedAt: "Mar 5, 2026" },
  { reviewId: "3", courseName: "RES 301 - Research Methods", checklistVersion: "v2.0", reviewedAt: "Mar 4, 2026" },
  { reviewId: "4", courseName: "CS 350 - Database Systems", checklistVersion: "v2.1", reviewedAt: "Mar 3, 2026" },
];

const SECTION_LABELS: Record<SectionKey, string> = {
  video: "Video quality",
  document: "Document accuracy",
  assessment: "Assessment alignment",
};

export default function QualityChecklistPage() {
  const [template, setTemplate] = React.useState<ChecklistTemplate>(DEFAULT_TEMPLATE);
  const [saved, setSaved] = React.useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad" className="text-xs font-medium text-indigo-600 hover:underline">
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Quality checklist
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage templates for course reviews. Video quality, document accuracy, and assessment alignment. See which checklist version was used for each review.
        </p>
      </section>

      {/* Template management */}
      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Checklist template</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{template.version} • Updated {template.updatedAt}</span>
            <Button type="button" variant="primary" size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
              Save template
            </Button>
            {saved && <span className="text-xs text-emerald-600">Saved.</span>}
          </div>
        </div>
        <Card className="mt-3 rounded-lg border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800">{template.name}</p>
          <div className="mt-4 space-y-6">
            {(Object.keys(template.sections) as SectionKey[]).map((key) => (
              <div key={key}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {SECTION_LABELS[key]}
                </h3>
                <ul className="mt-2 space-y-2">
                  {template.sections[key].map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50/50 px-3 py-2 text-sm text-slate-800"
                    >
                      <span className="text-slate-400">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Which checklist version was used for which review */}
      <section>
        <h2 className="text-sm font-semibold text-slate-900">
          Checklist version by review
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Auditors can see which checklist version was used for each course review.
        </p>
        <Card className="mt-3 overflow-hidden rounded-lg border-slate-200 p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Checklist version
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">
                    Reviewed at
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {REVIEWS_USING_CHECKLIST.map((row) => (
                  <tr key={row.reviewId} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {row.courseName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800">
                        {row.checklistVersion}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.reviewedAt}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/aqad/reviews/${row.reviewId}`}
                        className="text-xs font-medium text-indigo-600 hover:underline"
                      >
                        View review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      <p className="text-xs text-slate-500">
        Related: <Link href="/aqad/standards" className="font-medium text-indigo-600 hover:underline">Standards &amp; rubrics</Link> for course quality checklist items and exam policies.
      </p>
    </div>
  );
}
