"use client";

import Link from "next/link";

import { Card } from "../../components/ui/Card";

const ANALYST = {
  name: "AQAD Analyst",
  email: "aqad@university.edu",
  employeeId: "AQAD-2047",
  department: "AQAD",
  specializedSubjects: ["Course Design & Outcomes", "Assessment & Rubrics", "Proctoring Compliance"],
  performanceRating: "Exceeds expectations",
};

export default function AqadProfilePage() {
  return (
    <div className="space-y-6">
      <section>
        <Link href="/aqad" className="text-xs font-medium text-indigo-600 hover:underline">
          ← AQAD Dashboard
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Your AQAD account and analyst details.
        </p>
      </section>

      <Card className="rounded-lg border-slate-200 p-6">
        <h2 className="text-sm font-semibold text-slate-900">Analyst details</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-1">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{ANALYST.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{ANALYST.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Employee ID</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{ANALYST.employeeId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Department</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{ANALYST.department}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Specialized subjects</dt>
            <dd className="mt-0.5 text-sm text-slate-900">
              <ul className="list-inside list-disc space-y-0.5">
                {ANALYST.specializedSubjects.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Performance rating</dt>
            <dd className="mt-0.5 text-sm font-medium text-slate-900">{ANALYST.performanceRating}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
