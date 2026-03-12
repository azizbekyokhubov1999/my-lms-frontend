"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type CourseStatus = "Draft" | "In Review" | "Published" | "Rejected";

interface Lecture {
  id: string;
  title: string;
  durationMinutes?: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lectures: Lecture[];
}

/** Mock course detail by id */
const COURSES_BY_ID: Record<
  string,
  {
    title: string;
    code: string;
    status: CourseStatus;
    studentCount: number;
    averageProgress: number;
    totalAssignmentsSubmitted: number;
    activeDiscussions: number;
    modules: Module[];
  }
> = {
  "1": {
    title: "Machine Learning",
    code: "CS 440",
    status: "Published",
    studentCount: 84,
    averageProgress: 67,
    totalAssignmentsSubmitted: 312,
    activeDiscussions: 12,
    modules: [
      { id: "m1", title: "Introduction", order: 0, lectures: [{ id: "l1", title: "Welcome & Syllabus", durationMinutes: 15 }] },
      { id: "m2", title: "Core Concepts", order: 1, lectures: [{ id: "l2", title: "Lecture 1: Foundations", durationMinutes: 45 }, { id: "l3", title: "Lecture 2: Deep Dive", durationMinutes: 50 }] },
      { id: "m3", title: "Applications", order: 2, lectures: [{ id: "l4", title: "Case Studies", durationMinutes: 55 }] },
    ],
  },
  "2": {
    title: "Data Structures",
    code: "CS 210",
    status: "In Review",
    studentCount: 62,
    averageProgress: 45,
    totalAssignmentsSubmitted: 186,
    activeDiscussions: 8,
    modules: [
      { id: "m1", title: "Introduction", order: 0, lectures: [{ id: "l1", title: "Welcome & Syllabus", durationMinutes: 15 }] },
      { id: "m2", title: "Trees and Graphs", order: 1, lectures: [{ id: "l2", title: "Lecture 1: Trees", durationMinutes: 45 }, { id: "l3", title: "Lecture 2: Graphs", durationMinutes: 50 }] },
    ],
  },
  "3": {
    title: "Research Methods",
    code: "RES 301",
    status: "Published",
    studentCount: 45,
    averageProgress: 72,
    totalAssignmentsSubmitted: 120,
    activeDiscussions: 5,
    modules: [
      { id: "m1", title: "Introduction", order: 0, lectures: [{ id: "l1", title: "Qualitative Methods Overview", durationMinutes: 60 }] },
    ],
  },
  "4": { title: "Database Systems", code: "CS 350", status: "Draft", studentCount: 0, averageProgress: 0, totalAssignmentsSubmitted: 0, activeDiscussions: 0, modules: [] },
  "5": { title: "Digital Signal Processing", code: "EE 320", status: "Published", studentCount: 38, averageProgress: 58, totalAssignmentsSubmitted: 95, activeDiscussions: 4, modules: [{ id: "m1", title: "Filter Design", order: 0, lectures: [{ id: "l1", title: "Intro to Filters", durationMinutes: 50 }] }] },
  "6": { title: "Organizational Behavior", code: "BUS 210", status: "Published", studentCount: 52, averageProgress: 81, totalAssignmentsSubmitted: 208, activeDiscussions: 10, modules: [{ id: "m1", title: "Team Dynamics", order: 0, lectures: [{ id: "l1", title: "Team Formation", durationMinutes: 45 }] }] },
  "7": { title: "Algorithms", code: "CS 220", status: "Rejected", studentCount: 0, averageProgress: 0, totalAssignmentsSubmitted: 0, activeDiscussions: 0, modules: [] },
};

function getStatusStyles(status: CourseStatus) {
  switch (status) {
    case "Draft": return "bg-slate-100 text-slate-700";
    case "In Review": return "bg-amber-100 text-amber-800";
    case "Published": return "bg-emerald-100 text-emerald-800";
    case "Rejected": return "bg-red-100 text-red-800";
    default: return "bg-slate-100 text-slate-600";
  }
}

export default function TeacherCourseDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const course = id ? COURSES_BY_ID[id] : null;

  if (!course) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/courses" className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to Courses
        </Link>
        <Card className="rounded-lg border-slate-200 p-6">
          <p className="text-sm text-slate-600">Course not found.</p>
          <Link href="/teacher/courses">
            <Button type="button" variant="outline" size="sm" className="mt-3">
              Back to Courses
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/teacher/courses" className="text-xs font-medium text-teal-600 hover:underline">
            ← Back to Courses
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
            {course.title}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">{course.code}</p>
        </div>
        <Link href={`/teacher/courses/builder/${id}`}>
          <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
            Edit in Builder
          </Button>
        </Link>
      </section>

      {/* Overview */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Overview</h2>
        <div className="mt-3 flex flex-wrap gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</p>
            <span className={cn("mt-0.5 inline-flex rounded-full px-2.5 py-0.5 text-sm font-semibold", getStatusStyles(course.status))}>
              {course.status}
            </span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Students</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-900">{course.studentCount}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Average progress</p>
            <p className="mt-0.5 text-lg font-semibold text-slate-900">{course.averageProgress}%</p>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Quick stats</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
            <p className="text-xs font-medium text-slate-600">Total assignments submitted</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{course.totalAssignmentsSubmitted}</p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3">
            <p className="text-xs font-medium text-slate-600">Active discussions</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{course.activeDiscussions}</p>
          </div>
        </div>
      </Card>

      {/* Syllabus View */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Syllabus</h2>
        <p className="mt-0.5 text-xs text-slate-500">Modules and lectures (read-only)</p>
        {course.modules.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No modules yet. Edit in builder to add content.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {course.modules.map((mod, i) => (
              <li key={mod.id} className="rounded-lg border border-slate-200 bg-slate-50/30 p-3">
                <p className="font-medium text-slate-900">
                  Module {i + 1}: {mod.title}
                </p>
                {mod.lectures.length > 0 ? (
                  <ul className="mt-2 space-y-1 pl-4">
                    {mod.lectures.map((lec) => (
                      <li key={lec.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <span className="text-slate-400">•</span>
                        {lec.title}
                        {lec.durationMinutes != null && (
                          <span className="text-xs text-slate-500">({lec.durationMinutes} min)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">No lectures</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
