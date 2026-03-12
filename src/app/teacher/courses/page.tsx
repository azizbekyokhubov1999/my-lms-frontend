"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type CourseStatus = "Draft" | "In Review" | "Published" | "Rejected";

interface CourseCard {
  id: string;
  title: string;
  code: string;
  status: CourseStatus;
  studentCount: number;
  imagePlaceholder?: string;
}

const COURSES: CourseCard[] = [
  { id: "1", title: "Machine Learning", code: "CS 440", status: "Published", studentCount: 84 },
  { id: "2", title: "Data Structures", code: "CS 210", status: "In Review", studentCount: 62 },
  { id: "3", title: "Research Methods", code: "RES 301", status: "Published", studentCount: 45 },
  { id: "4", title: "Database Systems", code: "CS 350", status: "Draft", studentCount: 0 },
  { id: "5", title: "Digital Signal Processing", code: "EE 320", status: "Published", studentCount: 38 },
  { id: "6", title: "Organizational Behavior", code: "BUS 210", status: "Published", studentCount: 52 },
  { id: "7", title: "Algorithms", code: "CS 220", status: "Rejected", studentCount: 0 },
];

const STATUS_OPTIONS: { value: CourseStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Draft", label: "Draft" },
  { value: "In Review", label: "In Review" },
  { value: "Published", label: "Published" },
  { value: "Rejected", label: "Rejected" },
];

function getStatusStyles(status: CourseStatus) {
  switch (status) {
    case "Draft":
      return "bg-slate-100 text-slate-700";
    case "In Review":
      return "bg-amber-100 text-amber-800";
    case "Published":
      return "bg-emerald-100 text-emerald-800";
    case "Rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function TeacherCoursesPage() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<CourseStatus | "all">("all");

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch =
      search.trim() === "" ||
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            My Courses
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your courses. Create new ones or open existing to edit content and view students.
          </p>
        </div>
        <Link href="/teacher/courses/builder/new">
          <Button
            type="button"
            variant="primary"
            className="shrink-0 bg-teal-600 hover:bg-teal-700"
          >
            + Create New Course
          </Button>
        </Link>
      </section>

      {/* Search & Filter */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <label htmlFor="course-search" className="sr-only">
            Search by course name
          </label>
          <input
            id="course-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name or code..."
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label="Search courses"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-xs font-medium text-slate-600">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CourseStatus | "all")}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Course Grid */}
      <section>
        {filteredCourses.length === 0 ? (
          <Card className="rounded-lg border-slate-200 p-12 text-center">
            <p className="text-sm text-slate-600">
              No courses match your search or filter.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try changing the search term or status filter, or create a new course.
            </p>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <li key={course.id}>
                <Card className="overflow-hidden rounded-lg border-slate-200 p-0 transition-shadow hover:shadow-md">
                  {/* Course Image placeholder */}
                  <div
                    className="h-32 w-full bg-linear-to-br from-teal-100 to-teal-200 flex items-center justify-center"
                    aria-hidden
                  >
                    <span className="text-4xl font-bold text-teal-600/60">
                      {course.code.split(" ").map((w) => w[0]).join("")}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-slate-900 line-clamp-2">
                        {course.title}
                      </h2>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                          getStatusStyles(course.status),
                        )}
                      >
                        {course.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{course.code}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium text-slate-900">{course.studentCount}</span>
                      {" "}students
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Link href={`/teacher/courses/${course.id}`} className="text-sm font-medium text-teal-600 hover:underline">
                        Open course →
                      </Link>
                      <Link href={`/teacher/courses/builder/${course.id}`}>
                        <Button type="button" variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
