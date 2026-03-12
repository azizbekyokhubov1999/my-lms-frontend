"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface SyllabusItem {
  id: string;
  type: "module" | "lecture";
  title: string;
  status?: "watched" | "current" | "locked";
  duration?: string;
  lectureId?: string;
}

interface Material {
  id: string;
  title: string;
  type: "PDF" | "Video";
  size?: string;
}

interface Grade {
  category: string;
  score: number;
  max: number;
  weight?: string;
}

/** Mock preview data keyed by course id (matches teacher course ids) */
const PREVIEW_DATA: Record<
  string,
  { title: string; instructor: { name: string; email: string; office: string }; syllabus: SyllabusItem[]; materials: Material[]; grades: Grade[] }
> = {
  "1": {
    title: "Machine Learning (CS 440)",
    instructor: { name: "Prof. Sarah Chen", email: "sarah.chen@university.edu", office: "CS 401" },
    syllabus: [
      { id: "m1", type: "module", title: "Module 1: Introduction" },
      { id: "l1", type: "lecture", title: "Welcome & Syllabus", status: "watched", duration: "15 min", lectureId: "l1" },
      { id: "m2", type: "module", title: "Module 2: Core Concepts" },
      { id: "l2", type: "lecture", title: "Lecture 1: Foundations", status: "current", duration: "45 min", lectureId: "l2" },
      { id: "l3", type: "lecture", title: "Lecture 2: Deep Dive", status: "locked", duration: "50 min", lectureId: "l3" },
      { id: "m3", type: "module", title: "Module 3: Applications" },
      { id: "l4", type: "lecture", title: "Case Studies", status: "locked", duration: "55 min", lectureId: "l4" },
    ],
    materials: [
      { id: "mat1", title: "Week 1–2 slides", type: "PDF", size: "2.1 MB" },
      { id: "mat2", title: "Lecture 1 recording", type: "Video", size: "120 MB" },
      { id: "mat3", title: "Syllabus", type: "PDF", size: "0.5 MB" },
    ],
    grades: [
      { category: "Assignments", score: 0, max: 50, weight: "30%" },
      { category: "Midterm", score: 0, max: 45, weight: "30%" },
      { category: "Final", score: 0, max: 50, weight: "40%" },
    ],
  },
  "2": {
    title: "Data Structures (CS 210)",
    instructor: { name: "Dr. James Wilson", email: "j.wilson@university.edu", office: "CS 302" },
    syllabus: [
      { id: "m1", type: "module", title: "Introduction" },
      { id: "l1", type: "lecture", title: "Welcome & Syllabus", status: "watched", duration: "15 min", lectureId: "l1" },
      { id: "m2", type: "module", title: "Trees and Graphs" },
      { id: "l2", type: "lecture", title: "Lecture 1: Trees", status: "current", duration: "45 min", lectureId: "l2" },
      { id: "l3", type: "lecture", title: "Lecture 2: Graphs", status: "locked", duration: "50 min", lectureId: "l3" },
    ],
    materials: [
      { id: "mat1", title: "Course slides", type: "PDF", size: "1.8 MB" },
      { id: "mat2", title: "Reading list", type: "PDF", size: "0.3 MB" },
    ],
    grades: [
      { category: "Assignments", score: 0, max: 50, weight: "40%" },
      { category: "Final", score: 0, max: 50, weight: "60%" },
    ],
  },
  "3": {
    title: "Research Methods (RES 301)",
    instructor: { name: "Dr. Emma Davis", email: "e.davis@university.edu", office: "RES 101" },
    syllabus: [
      { id: "m1", type: "module", title: "Introduction" },
      { id: "l1", type: "lecture", title: "Qualitative Methods Overview", status: "watched", duration: "60 min", lectureId: "l1" },
    ],
    materials: [{ id: "mat1", title: "Course reader", type: "PDF", size: "5.1 MB" }],
    grades: [
      { category: "Assignments", score: 0, max: 45, weight: "45%" },
      { category: "Midterm", score: 0, max: 30, weight: "25%" },
      { category: "Final", score: 0, max: 30, weight: "30%" },
    ],
  },
};

const DEFAULT_PREVIEW = {
  title: "Course",
  instructor: { name: "Instructor", email: "instructor@university.edu", office: "—" },
  syllabus: [] as SyllabusItem[],
  materials: [] as Material[],
  grades: [] as Grade[],
};

type TabKey = "syllabus" | "materials" | "grades";

export default function CoursePreviewPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const data = (id && PREVIEW_DATA[id]) || { ...DEFAULT_PREVIEW, title: id ? `Course ${id}` : "Course" };
  const [activeTab, setActiveTab] = React.useState<TabKey>("syllabus");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "syllabus", label: "Syllabus" },
    { key: "materials", label: "Materials" },
    { key: "grades", label: "Grades" },
  ];

  return (
    <div className="space-y-6">
      {/* Preview banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3">
        <p className="text-sm font-semibold text-amber-900">
          PREVIEW MODE: This is how students see your course
        </p>
        <Link href={`/teacher/courses/builder/${id}`}>
          <Button type="button" variant="outline" size="sm" className="border-amber-600 text-amber-800 hover:bg-amber-100">
            Back to Builder
          </Button>
        </Link>
      </div>

      {/* Student-style course view */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          {data.title}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
        <div className="min-w-0 space-y-6">
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex gap-6" aria-label="Course sections">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "border-b-2 py-3 text-sm font-medium transition-colors",
                    activeTab === tab.key
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {activeTab === "syllabus" && (
            <Card>
              <h2 className="text-sm font-semibold text-slate-900">Syllabus</h2>
              <p className="mt-1 text-xs text-slate-500">
                Modules and lectures with status: Watched, Current, Locked.
              </p>
              <ul className="mt-4 space-y-1">
                {data.syllabus.length === 0 ? (
                  <li className="py-4 text-sm text-slate-500">No syllabus items.</li>
                ) : (
                  data.syllabus.map((item) => {
                    if (item.type === "module") {
                      return (
                        <li
                          key={item.id}
                          className="pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-500 first:pt-0"
                        >
                          {item.title}
                        </li>
                      );
                    }
                    const status = item.status || "locked";
                    return (
                      <li key={item.id}>
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                            status === "locked" && "bg-slate-50 text-slate-500",
                          )}
                        >
                          <span
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs",
                              status === "watched" && "bg-emerald-100 text-emerald-700",
                              status === "current" && "bg-teal-100 text-teal-700",
                              status === "locked" && "bg-slate-200 text-slate-500",
                            )}
                            aria-label={status}
                          >
                            {status === "watched" ? "✓" : status === "current" ? "▶" : "🔒"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-medium">{item.title}</span>
                            {item.duration && (
                              <p className="text-xs text-slate-500">{item.duration}</p>
                            )}
                          </div>
                          {status === "current" && (
                            <span
                              className="shrink-0 cursor-not-allowed rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500"
                              title="Preview: interactions disabled"
                            >
                              Open
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </Card>
          )}

          {activeTab === "materials" && (
            <Card>
              <h2 className="text-sm font-semibold text-slate-900">Materials</h2>
              <p className="mt-1 text-xs text-slate-500">
                PDF and video downloads for this course.
              </p>
              {data.materials.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No materials yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {data.materials.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/50 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{m.title}</p>
                        <p className="text-xs text-slate-500">
                          {m.type}
                          {m.size && ` · ${m.size}`}
                        </p>
                      </div>
                      <span
                        className="shrink-0 cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400"
                        title="Preview: download disabled"
                      >
                        Download
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {activeTab === "grades" && (
            <Card>
              <h2 className="text-sm font-semibold text-slate-900">Grades breakdown</h2>
              <p className="mt-1 text-xs text-slate-500">
                Scores for this course by category.
              </p>
              {data.grades.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No grades yet.</p>
              ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-4 py-2.5 text-left font-medium text-slate-700">Category</th>
                        <th className="px-4 py-2.5 text-right font-medium text-slate-700">Score</th>
                        <th className="px-4 py-2.5 text-right font-medium text-slate-700">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.grades.map((g) => (
                        <tr key={g.category}>
                          <td className="px-4 py-2.5 font-medium text-slate-900">{g.category}</td>
                          <td className="px-4 py-2.5 text-right text-slate-700">
                            {g.score} / {g.max}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-500">{g.weight ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Instructor sidebar — interactions disabled */}
        <div>
          <Card className="sticky top-24">
            <h2 className="text-sm font-semibold text-slate-900">Instructor</h2>
            <p className="mt-2 font-medium text-slate-900">{data.instructor.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{data.instructor.office}</p>
            <div className="mt-4 flex flex-col gap-2">
              <span
                className="inline-flex cursor-not-allowed justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-400"
                title="Preview: email disabled"
              >
                Email
              </span>
              <span
                className="inline-flex cursor-not-allowed justify-center gap-2 rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-400"
                title="Preview: chat disabled"
              >
                Chat
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
