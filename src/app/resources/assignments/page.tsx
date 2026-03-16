"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AssignmentStatus = "Active" | "Completed";

interface AssignmentRow {
  id: string;
  teacherName: string;
  faculty: string;
  course: string;
  group: string;
  semester: string;
  status: AssignmentStatus;
}

const MOCK_ASSIGNMENTS: AssignmentRow[] = [
  {
    id: "a1",
    teacherName: "Dr. Nina Kozlova",
    faculty: "Engineering",
    course: "SE301 – Software Architecture",
    group: "ENG-3A",
    semester: "2025–2026 · Fall",
    status: "Active",
  },
  {
    id: "a2",
    teacherName: "Prof. Timur Akhmetov",
    faculty: "Business",
    course: "FIN201 – Corporate Finance",
    group: "BUS-2B",
    semester: "2025–2026 · Fall",
    status: "Active",
  },
  {
    id: "a3",
    teacherName: "Dr. Aigerim Sadykova",
    faculty: "Law",
    course: "LAW101 – Constitutional Law",
    group: "LAW-1C",
    semester: "2024–2025 · Spring",
    status: "Completed",
  },
];

const STATUS_STYLES: Record<AssignmentStatus, string> = {
  Active: "bg-emerald-100 text-emerald-800",
  Completed: "bg-slate-100 text-slate-700",
};

export default function AssignmentsListPage() {
  const [search, setSearch] = React.useState("");
  const [facultyFilter, setFacultyFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<AssignmentStatus | "">("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_ASSIGNMENTS.filter((a) => {
      const matchesSearch =
        !q ||
        a.teacherName.toLowerCase().includes(q) ||
        a.course.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q) ||
        a.semester.toLowerCase().includes(q);
      const matchesFaculty = !facultyFilter || a.faculty === facultyFilter;
      const matchesStatus = !statusFilter || a.status === statusFilter;
      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [search, facultyFilter, statusFilter]);

  const faculties = Array.from(new Set(MOCK_ASSIGNMENTS.map((a) => a.faculty)));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Assignments</h1>
          <p className="mt-1 text-sm text-slate-600">
            Course and group assignments for teachers across faculties.
          </p>
        </div>
        <Link
          href="/resources/assignments/create"
          className="inline-flex h-9 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-800"
        >
          + Create assignment
        </Link>
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="w-full max-w-xs">
            <Input
              type="search"
              label="Search"
              placeholder="Search by teacher, course, group…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Faculty
              </label>
              <select
                value={facultyFilter}
                onChange={(e) => setFacultyFilter(e.target.value)}
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | "")}
                className="mt-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Faculty</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Course</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Student group</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Semester</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                    No assignments match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{a.teacherName}</td>
                    <td className="px-4 py-3 text-slate-700">{a.faculty}</td>
                    <td className="px-4 py-3 text-slate-700">{a.course}</td>
                    <td className="px-4 py-3 text-slate-700">{a.group}</td>
                    <td className="px-4 py-3 text-slate-700">{a.semester}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          STATUS_STYLES[a.status],
                        )}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

