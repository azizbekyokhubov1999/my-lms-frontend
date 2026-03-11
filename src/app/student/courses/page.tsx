"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

type CourseStatus = "all" | "in-progress" | "completed";

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  lastLecturePath: string;
  lastAccessed: string; // ISO date or formatted e.g. "Mar 5, 2026"
  status: Exclude<CourseStatus, "all">;
}

const COURSES: Course[] = [
  {
    id: "algorithms",
    title: "Algorithms and Data Structures",
    instructor: "Prof. Daniel Kim",
    progress: 45,
    lastLecturePath: "/student/courses/algorithms/lecture/2",
    lastAccessed: "2026-03-05",
    status: "in-progress",
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems for Learning Platforms",
    instructor: "Dr. Alexandra Rivera",
    progress: 70,
    lastLecturePath: "/student/courses/distributed-systems/lecture/3",
    lastAccessed: "2026-03-04",
    status: "in-progress",
  },
  {
    id: "research-methods",
    title: "Research Methods in Education",
    instructor: "Dr. Priya Menon",
    progress: 100,
    lastLecturePath: "/student/courses/research-methods/lecture/6",
    lastAccessed: "2026-03-01",
    status: "completed",
  },
];

function formatLastAccessed(iso: string): string {
  const d = new Date(iso + "Z");
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MyCoursesPage() {
  const [filter, setFilter] = React.useState<CourseStatus>("all");

  const filteredCourses =
    filter === "all"
      ? COURSES
      : COURSES.filter((course) => course.status === filter);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            My courses
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Continue where you left off or review completed courses.
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Filter
        </span>
        {[
          { key: "all", label: "All" },
          { key: "in-progress", label: "In progress" },
          { key: "completed", label: "Completed" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key as CourseStatus)}
            className={
              filter === item.key
                ? "rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-sky-600 hover:text-sky-700"
            }
          >
            {item.label}
          </button>
        ))}
      </section>

      <section>
        {filteredCourses.length === 0 ? (
          <p className="text-sm text-slate-600">
            No courses match this filter. Try selecting a different status.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col">
                <Link
                  href={`/student/courses/${course.id}`}
                  className="group flex flex-col flex-1 min-w-0"
                >
                  <div className="h-24 w-full overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Course
                    </span>
                  </div>
                  <div className="mt-3 flex-1 min-w-0">
                    <h2 className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 truncate">
                      {course.title}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-600">
                      {course.instructor}
                    </p>
                  </div>
                </Link>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Progress</span>
                    <span className="font-medium text-slate-800">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky-600 transition-[width]"
                      style={{ width: `${course.progress}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  Last accessed: {formatLastAccessed(course.lastAccessed)}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    View course
                  </Link>
                  {course.progress < 100 && (
                    <Link
                      href={course.lastLecturePath}
                      className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-center text-xs font-medium text-white hover:bg-sky-700"
                    >
                      Continue
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
