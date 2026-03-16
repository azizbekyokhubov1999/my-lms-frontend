"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

type TeacherStatus = "Pending" | "Verified" | "Active" | "Suspended";

interface TeacherDetail {
  id: string;
  name: string;
  status: TeacherStatus;
  subject: string;
  faculty: string;
  email: string;
  phone: string;
  cv: string;
  courses: string[];
}

const MOCK_TEACHER: TeacherDetail = {
  id: "t1",
  name: "Dr. Nina Kozlova",
  status: "Active",
  subject: "Software Engineering",
  faculty: "School of Engineering",
  email: "n.kozlova@university.kz",
  phone: "+7 (701) 555-12-34",
  cv: `PhD in Computer Science (Distributed Systems), National Research University.

10+ years of experience teaching Software Engineering, Distributed Systems, and Software Architecture.
Industry collaborations with fintech and telecom partners. Supervised 15+ MSc theses.`,
  courses: ["CS101 – Introduction to Programming", "SE301 – Software Architecture", "SE402 – Distributed Systems"],
};

const STATUS_STYLES: Record<TeacherStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Verified: "bg-sky-100 text-sky-800",
  Active: "bg-emerald-100 text-emerald-800",
  Suspended: "bg-rose-100 text-rose-800",
};

export default function TeacherDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  // In a real app we would fetch by id; for now reuse mock.
  const teacher = MOCK_TEACHER;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/resources/teachers"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Teachers
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {teacher.name}
          </h1>
          <p className="mt-0.5 text-sm text-slate-600">
            {teacher.subject} · {teacher.faculty}
          </p>
        </div>
        <span
          className={
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
            STATUS_STYLES[teacher.status]
          }
        >
          Status: {teacher.status}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1.4fr]">
        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Curriculum vitae
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
            {teacher.cv}
          </p>
        </Card>

        <div className="space-y-4">
          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Contact & identity
            </h2>
            <dl className="mt-2 space-y-1 text-sm text-slate-700">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Teacher ID</dt>
                <dd className="font-mono text-slate-800">{id || teacher.id}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Email</dt>
                <dd className="text-slate-800">{teacher.email}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500">Phone</dt>
                <dd className="text-slate-800">{teacher.phone}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assigned courses
            </h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-800">
              {teacher.courses.map((c) => (
                <li key={c} className="flex items-center justify-between gap-2">
                  <span>{c}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    Current
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

