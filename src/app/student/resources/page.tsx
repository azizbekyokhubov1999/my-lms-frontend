"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface ResourceItem {
  id: string;
  title: string;
  type: "PDF" | "Link";
  description?: string;
  url: string;
}

const REGULATIONS: ResourceItem[] = [
  { id: "1", title: "Academic Integrity Policy", type: "PDF", description: "Rules on plagiarism and conduct", url: "#" },
  { id: "2", title: "Student Code of Conduct", type: "PDF", url: "#" },
  { id: "3", title: "Examination Regulations", type: "PDF", description: "Exam rules and proctoring", url: "#" },
  { id: "4", title: "Tuition and Fee Policy", type: "PDF", url: "#" },
];

const MANUALS: ResourceItem[] = [
  { id: "1", title: "LMS Student Guide", type: "PDF", description: "How to use the learning portal", url: "#" },
  { id: "2", title: "Exam Portal Manual", type: "PDF", description: "Technical requirements and steps", url: "#" },
  { id: "3", title: "Thesis Submission Guide", type: "PDF", url: "#" },
];

const LIBRARY_LINKS: ResourceItem[] = [
  { id: "1", title: "University Digital Library", type: "Link", description: "E-books, journals, databases", url: "#" },
  { id: "2", title: "Course Reserves", type: "Link", description: "Reserved readings by course", url: "#" },
  { id: "3", title: "Citation and Referencing", type: "Link", url: "#" },
];

function ResourceList({
  items,
  emptyMessage,
}: {
  items: ResourceItem[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-500">{emptyMessage}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.url}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white px-4 py-3",
              "text-sm font-medium text-slate-900 hover:border-sky-200 hover:bg-sky-50/50 hover:text-sky-800",
            )}
          >
            <div className="min-w-0 flex-1">
              <p>{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-xs font-normal text-slate-500">{item.description}</p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {item.type}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Resources
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          University regulations, manuals, and digital library links.
        </p>
      </section>

      {/* University regulations */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">University regulations</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Official policies and rules
        </p>
        <div className="mt-4">
          <ResourceList items={REGULATIONS} emptyMessage="No regulations listed." />
        </div>
      </Card>

      {/* Manuals */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Manuals</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Guides for LMS, exams, and procedures
        </p>
        <div className="mt-4">
          <ResourceList items={MANUALS} emptyMessage="No manuals available." />
        </div>
      </Card>

      {/* Digital library links */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Digital library</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Library portal and course reserves
        </p>
        <div className="mt-4">
          <ResourceList items={LIBRARY_LINKS} emptyMessage="No library links." />
        </div>
      </Card>
    </div>
  );
}
