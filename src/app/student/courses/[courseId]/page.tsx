"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type LectureStatus = "watched" | "current" | "locked";

interface SyllabusItem {
  id: string;
  type: "module" | "lecture";
  title: string;
  status?: LectureStatus;
  duration?: string;
  lectureId?: string;
}

// Mock data per course (keyed by courseId)
const COURSE_DATA: Record<
  string,
  {
    title: string;
    instructor: { name: string; email: string; office: string };
    syllabus: SyllabusItem[];
    materials: { id: string; title: string; type: "PDF" | "Video"; size?: string; url: string }[];
    grades: { category: string; score: number; max: number; weight?: string }[];
  }
> = {
  algorithms: {
    title: "Algorithms and Data Structures",
    instructor: { name: "Prof. Daniel Kim", email: "daniel.kim@university.edu", office: "CS 302" },
    syllabus: [
      { id: "m1", type: "module", title: "Module 1: Foundations" },
      { id: "l1", type: "lecture", title: "Lecture 1: Introduction", status: "watched", duration: "45 min", lectureId: "1" },
      { id: "l2", type: "lecture", title: "Lecture 2: Core concepts", status: "current", duration: "50 min", lectureId: "2" },
      { id: "l3", type: "lecture", title: "Lecture 3: Case studies", status: "locked", duration: "55 min", lectureId: "3" },
      { id: "m2", type: "module", title: "Module 2: Advanced topics" },
      { id: "l4", type: "lecture", title: "Lecture 4: Graph algorithms", status: "locked", duration: "60 min", lectureId: "4" },
    ],
    materials: [
      { id: "mat1", title: "Week 1–2 slides", type: "PDF", size: "2.1 MB", url: "#" },
      { id: "mat2", title: "Lecture 1 recording", type: "Video", size: "120 MB", url: "#" },
      { id: "mat3", title: "Reading list", type: "PDF", size: "0.5 MB", url: "#" },
    ],
    grades: [
      { category: "Assignments", score: 42, max: 50, weight: "30%" },
      { category: "Midterm", score: 38, max: 45, weight: "30%" },
      { category: "Final", score: 0, max: 50, weight: "40%" },
    ],
  },
  "distributed-systems": {
    title: "Distributed Systems for Learning Platforms",
    instructor: { name: "Dr. Alexandra Rivera", email: "a.rivera@university.edu", office: "EE 410" },
    syllabus: [
      { id: "m1", type: "module", title: "Module 1: Introduction" },
      { id: "l1", type: "lecture", title: "Lecture 1: Foundations", status: "watched", duration: "45 min", lectureId: "1" },
      { id: "l2", type: "lecture", title: "Lecture 2: Core concepts", status: "watched", duration: "75 min", lectureId: "2" },
      { id: "l3", type: "lecture", title: "Lecture 3: Case studies", status: "current", duration: "60 min", lectureId: "3" },
      { id: "l4", type: "lecture", title: "Lecture 4: Project guidelines", status: "locked", duration: "50 min", lectureId: "4" },
    ],
    materials: [
      { id: "mat1", title: "Lecture slides (PDF)", type: "PDF", size: "2.3 MB", url: "#" },
      { id: "mat2", title: "Lecture 2 recording", type: "Video", size: "180 MB", url: "#" },
      { id: "mat3", title: "Design doc template", type: "PDF", size: "0.2 MB", url: "#" },
    ],
    grades: [
      { category: "Assignments", score: 28, max: 35, weight: "35%" },
      { category: "Midterm", score: 30, max: 40, weight: "35%" },
      { category: "Final", score: 0, max: 40, weight: "30%" },
    ],
  },
  "research-methods": {
    title: "Research Methods in Education",
    instructor: { name: "Dr. Priya Menon", email: "p.menon@university.edu", office: "ED 205" },
    syllabus: [
      { id: "m1", type: "module", title: "Module 1: Methodology" },
      { id: "l1", type: "lecture", title: "Lecture 1–6", status: "watched", duration: "Various", lectureId: "6" },
    ],
    materials: [
      { id: "mat1", title: "Course reader", type: "PDF", size: "5.1 MB", url: "#" },
      { id: "mat2", title: "Citation guide", type: "PDF", size: "0.8 MB", url: "#" },
    ],
    grades: [
      { category: "Assignments", score: 35, max: 45, weight: "45%" },
      { category: "Midterm", score: 22, max: 30, weight: "25%" },
      { category: "Final", score: 28, max: 30, weight: "30%" },
    ],
  },
};

const DEFAULT_COURSE = {
  title: "Course",
  instructor: { name: "Instructor", email: "instructor@university.edu", office: "—" },
  syllabus: [] as SyllabusItem[],
  materials: [] as { id: string; title: string; type: "PDF" | "Video"; size?: string; url: string }[],
  grades: [] as { category: string; score: number; max: number; weight?: string }[],
};

type TabKey = "syllabus" | "materials" | "grades";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = (params?.courseId as string) || "";
  const data = (courseId && COURSE_DATA[courseId]) || { ...DEFAULT_COURSE, title: courseId || "Course" };
  const [activeTab, setActiveTab] = React.useState<TabKey>("syllabus");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "syllabus", label: "Syllabus" },
    { key: "materials", label: "Materials" },
    { key: "grades", label: "Grades" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/student/courses"
          className="text-sm font-medium text-sky-600 hover:text-sky-700"
        >
          ← My courses
        </Link>
        <h1 className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
          {data.title}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,280px]">
        <div className="min-w-0 space-y-6">
          {/* Tabs */}
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
                      ? "border-sky-600 text-sky-600"
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
                    const href =
                      status !== "locked" && item.lectureId
                        ? `/student/courses/${courseId}/lecture/${item.lectureId}`
                        : undefined;
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
                              status === "current" && "bg-sky-100 text-sky-700",
                              status === "locked" && "bg-slate-200 text-slate-500",
                            )}
                            aria-label={status}
                          >
                            {status === "watched" ? "✓" : status === "current" ? "▶" : "🔒"}
                          </span>
                          <div className="min-w-0 flex-1">
                            {href ? (
                              <Link href={href} className="font-medium text-slate-900 hover:text-sky-600">
                                {item.title}
                              </Link>
                            ) : (
                              <span className="font-medium">{item.title}</span>
                            )}
                            {item.duration && (
                              <p className="text-xs text-slate-500">{item.duration}</p>
                            )}
                          </div>
                          {status === "current" && href && (
                            <Link
                              href={href}
                              className="shrink-0 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-700"
                            >
                              Open
                            </Link>
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
                      <a
                        href={m.url}
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Download
                      </a>
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
                        <th className="px-4 py-2.5 text-left font-medium text-slate-700">
                          Category
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium text-slate-700">
                          Score
                        </th>
                        <th className="px-4 py-2.5 text-right font-medium text-slate-700">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.grades.map((g) => (
                        <tr key={g.category}>
                          <td className="px-4 py-2.5 font-medium text-slate-900">
                            {g.category}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-700">
                            {g.score} / {g.max}
                          </td>
                          <td className="px-4 py-2.5 text-right text-slate-500">
                            {g.weight ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Instructor info — sidebar */}
        <div>
          <Card className="sticky top-24">
            <h2 className="text-sm font-semibold text-slate-900">Instructor</h2>
            <p className="mt-2 font-medium text-slate-900">{data.instructor.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{data.instructor.office}</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={`mailto:${data.instructor.email}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Email
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                Chat
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
