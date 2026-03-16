"use client";

import * as React from "react";

import { Card } from "../../../components/ui/Card";

type Role = "Primary" | "Co-teacher";

interface CoTeacher {
  id: string;
  name: string;
  role: Role;
  workload: number; // %
}

interface CoTeachingCourse {
  id: string;
  course: string;
  group: string;
  semester: string;
  faculty: string;
  teachers: CoTeacher[];
}

const MOCK_COURSES: CoTeachingCourse[] = [
  {
    id: "c1",
    course: "SE301 – Software Architecture",
    group: "ENG-3A",
    semester: "2025–2026 · Fall",
    faculty: "Engineering",
    teachers: [
      { id: "t1", name: "Dr. Nina Kozlova", role: "Primary", workload: 60 },
      { id: "t2", name: "Mr. Alex Petrov", role: "Co-teacher", workload: 40 },
    ],
  },
  {
    id: "c2",
    course: "FIN201 – Corporate Finance",
    group: "BUS-2B",
    semester: "2025–2026 · Fall",
    faculty: "Business",
    teachers: [
      { id: "t3", name: "Prof. Timur Akhmetov", role: "Primary", workload: 70 },
      { id: "t4", name: "Ms. Aida Suleimen", role: "Co-teacher", workload: 30 },
    ],
  },
];

export default function CoTeachingPage() {
  const [courses, setCourses] = React.useState<CoTeachingCourse[]>(MOCK_COURSES);

  const updateTeacher = (courseId: string, teacherId: string, changes: Partial<CoTeacher>) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              teachers: c.teachers.map((t) =>
                t.id === teacherId ? { ...t, ...changes } : t,
              ),
            }
          : c,
      ),
    );
  };

  const setPrimary = (courseId: string, teacherId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              teachers: c.teachers.map((t) => ({
                ...t,
                role: t.id === teacherId ? "Primary" : "Co-teacher",
              })),
            }
          : c,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Co-teaching</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage courses with multiple lead teachers and split workloads. Each course has one
          <span className="font-semibold"> Primary</span> owner for grade entries.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <Card key={c.id} className="border-teal-100 bg-white/80">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">{c.course}</p>
              <p className="text-xs text-slate-600">
                {c.group} · {c.semester}
              </p>
              <p className="text-xs text-slate-500">{c.faculty}</p>
            </div>
            <div className="mt-3 space-y-2">
              {c.teachers.map((t) => (
                <div
                  key={t.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {t.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px]">
                        <label className="inline-flex items-center gap-1 text-slate-600">
                          <input
                            type="radio"
                            name={`primary-${c.id}`}
                            checked={t.role === "Primary"}
                            onChange={() => setPrimary(c.id, t.id)}
                            className="h-3 w-3 text-teal-600 focus:ring-teal-500"
                          />
                          <span>Primary</span>
                        </label>
                        <span className="inline-flex rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                          {t.role === "Primary" ? "Grade owner" : "Co-teacher"}
                        </span>
                      </div>
                    </div>
                    <div className="w-28 text-right">
                      <label className="block text-[11px] font-medium text-slate-600">
                        Workload
                      </label>
                      <div className="mt-0.5 flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={t.workload}
                          onChange={(e) =>
                            updateTeacher(c.id, t.id, {
                              workload: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                            })
                          }
                          className="h-7 w-14 rounded-md border border-slate-200 bg-white px-1 text-xs text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-100"
                        />
                        <span className="text-xs text-slate-600">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                    <div
                      className="h-1.5 rounded-full bg-teal-600"
                      style={{ width: `${Math.min(t.workload, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

