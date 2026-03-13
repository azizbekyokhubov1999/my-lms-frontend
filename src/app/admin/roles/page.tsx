"use client";

import Link from "next/link";
import * as React from "react";

import { Card } from "../../components/ui/Card";

/** All LMS roles: used for list, permissions, and user assignment */
export const LMS_ROLES = [
  { id: "admin", name: "Admin", description: "Superuser", userCount: 1 },
  { id: "rector", name: "Rector", description: "Executive overview", userCount: 0 },
  { id: "dean", name: "Dean / Department Head", description: "Academic management", userCount: 0 },
  { id: "aqad", name: "AQAD", description: "Quality assurance", userCount: 0 },
  { id: "teacher", name: "Teacher", description: "Content & Instruction", userCount: 2 },
  { id: "student", name: "Student", description: "Enrolled learner", userCount: 4 },
  { id: "applicant", name: "Applicant", description: "Pre-enrollment status", userCount: 0 },
  { id: "finance", name: "Finance / Accountant", description: "Payment management", userCount: 0 },
  { id: "support", name: "Support / IT Admin", description: "Technical helpdesk", userCount: 0 },
] as const;

const ROLES_WITH_COUNTS = LMS_ROLES;

export default function AdminRolesListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage roles and see how many users are assigned to each.
          </p>
        </div>
        <Link
          href="/admin/roles/permissions"
          className="inline-flex h-9 items-center justify-center rounded-md bg-blue-900 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
        >
          Permissions Matrix
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES_WITH_COUNTS.map((role) => (
          <Link key={role.id} href={`/admin/roles/${role.id}`}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <h2 className="font-semibold text-slate-900">{role.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{role.description}</p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {role.userCount} <span className="text-sm font-normal text-slate-500">user{role.userCount !== 1 ? "s" : ""}</span>
              </p>
              <span className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline">
                View users →
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
