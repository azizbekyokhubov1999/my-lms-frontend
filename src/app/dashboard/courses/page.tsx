"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

type CourseStatus = "all" | "in-progress" | "completed";

interface Course {
  id: string;
  title: string;
  professor: string;
  progress: number;
  lastLecturePath: string;
  status: Exclude<CourseStatus, "all">;
}

const COURSES: Course[] = [
  {
    id: "algorithms",
    title: "Algorithms and Data Structures",
    professor: "Prof. Daniel Kim",
    progress: 45,
    lastLecturePath: "/dashboard/courses/algorithms/lecture/2",
    status: "in-progress",
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems for Learning Platforms",
    professor: "Dr. Alexandra Rivera",
    progress: 70,
    lastLecturePath: "/dashboard/courses/distributed-systems/lecture/3",
    status: "in-progress",
  },
  {
    id: "research-methods",
    title: "Research Methods in Education",
    professor: "Dr. Priya Menon",
    progress: 100,
    lastLecturePath: "/dashboard/courses/research-methods/lecture/6",
    status: "completed",
  },
];

export default function MyCoursesPage() {
  const [filter, setFilter] = React.useState<CourseStatus>("all");

  const filteredCourses =
    filter === "all"
      ? COURSES
      : COURSES.filter((course) => course.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filters */}
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
                ? "rounded-full bg-blue-900 px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-blue-900 hover:text-blue-900"
            }
          >
            {item.label}
          </button>
        ))}
      </section>

      {/* Course grid */}
      <section>
        {filteredCourses.length === 0 ? (
          <p className="text-sm text-slate-600">
            No courses match this filter. Try selecting a different status.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id}>
                <div className="flex flex-col gap-3">
                  {/* Image placeholder */}
                  <div className="h-28 w-full overflow-hidden rounded-md bg-slate-200">
                    <div className="flex h-full items-center justify-center text-xs font-medium uppercase tracking-wide text-slate-500">
                      Course image
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-600">
                      {course.professor}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Progress</span>
                      <span className="font-medium text-slate-800">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-200">
                      <div
                        className="h-1.5 rounded-full bg-blue-900"
                        style={{ width: `${course.progress}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={course.lastLecturePath}
                      className="inline-flex w-full items-center justify-center rounded-md bg-blue-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
                    >
                      Continue learning
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

