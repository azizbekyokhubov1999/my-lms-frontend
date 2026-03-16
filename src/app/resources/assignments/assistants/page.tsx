"use client";

import * as React from "react";

import { Card } from "../../../components/ui/Card";

type Role = "Primary" | "Assistant";

interface AssistantMember {
  id: string;
  name: string;
  role: Role;
  sessions: string;
}

interface AssistantCourse {
  id: string;
  course: string;
  group: string;
  semester: string;
  primaryTeacher: string;
  assistants: AssistantMember[];
}

const MOCK_ASSISTANT_COURSES: AssistantCourse[] = [
  {
    id: "ac1",
    course: "CS101 – Introduction to Programming",
    group: "ENG-1A (200 students)",
    semester: "2025–2026 · Fall",
    primaryTeacher: "Dr. Nina Kozlova",
    assistants: [
      {
        id: "ta1",
        name: "TA – Amir Bekov",
        role: "Assistant",
        sessions: "Labs: Wed 10:00 (Lab 1), Fri 14:00 (Lab 2)",
      },
      {
        id: "ta2",
        name: "TA – Aida Suleimen",
        role: "Assistant",
        sessions: "Seminars: Tue 16:00 (Group A), Thu 16:00 (Group B)",
      },
    ],
  },
  {
    id: "ac2",
    course: "SE301 – Software Architecture",
    group: "ENG-3A (120 students)",
    semester: "2025–2026 · Fall",
    primaryTeacher: "Dr. Nina Kozlova",
    assistants: [
      {
        id: "ta3",
        name: "TA – Daniyar U.",
        role: "Assistant",
        sessions: "Labs: Mon 09:00 (Design studio)",
      },
    ],
  },
];

export default function AssistantAssignmentPage() {
  const [courses] = React.useState<AssistantCourse[]>(MOCK_ASSISTANT_COURSES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Assistant assignments
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Link teaching assistants to primary teachers and specific seminar / lab sessions for large
          groups.
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
              <p className="text-xs text-slate-500">
                Primary:{" "}
                <span className="font-medium text-slate-800">
                  {c.primaryTeacher}
                </span>
              </p>
            </div>
            <div className="mt-3 space-y-2">
              {c.assistants.map((ta) => (
                <div
                  key={ta.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-slate-900">{ta.name}</p>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                      {ta.role}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {ta.sessions}
                  </p>
                </div>
              ))}
              {c.assistants.length === 0 && (
                <p className="text-xs text-slate-500">
                  No assistants assigned yet.
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

