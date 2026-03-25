"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ROLES: Record<string, { name: string; description: string }> = {
  admin: { name: "Admin", description: "Superuser" },
  rector: { name: "Rector", description: "Executive overview" },
  dean: { name: "Dean / Department Head", description: "Academic management" },
  aqad: { name: "AQAD", description: "Quality assurance" },
  teacher: { name: "Teacher", description: "Content & Instruction" },
  student: { name: "Student", description: "Enrolled learner" },
  applicant: { name: "Applicant", description: "Pre-enrollment status" },
  finance: { name: "Finance / Accountant", description: "Payment management" },
  support: { name: "Support / IT Admin", description: "Technical helpdesk" },
};

interface UserRow {
  id: string;
  name: string;
  email: string;
  status: string;
}

const USERS_BY_ROLE: Record<string, UserRow[]> = {
  admin: [{ id: "u7", name: "System Admin", email: "admin@edu.edu", status: "Active" }],
  rector: [],
  dean: [],
  aqad: [],
  teacher: [
    { id: "u1", name: "Alex Johnson", email: "alex.johnson@edu.edu", status: "Active" },
    { id: "u5", name: "Morgan Kim", email: "morgan.kim@edu.edu", status: "Active" },
  ],
  student: [
    { id: "u2", name: "Jordan Lee", email: "jordan.lee@edu.edu", status: "Active" },
    { id: "u3", name: "Sam Chen", email: "sam.chen@edu.edu", status: "Active" },
    { id: "u4", name: "Riley Davis", email: "riley.davis@edu.edu", status: "Pending" },
    { id: "u6", name: "Casey Brown", email: "casey.brown@edu.edu", status: "Banned" },
  ],
  applicant: [],
  finance: [],
  support: [],
};

export default function AdminRoleDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const role = id ? ROLES[id] : null;
  const users: UserRow[] = id ? USERS_BY_ROLE[id] : [];

  if (!role) {
    return (
      <div>
        <p className="text-slate-600">Role not found.</p>
        <Link href="/admin/roles" className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline">
          ← Back to Roles
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/roles" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Roles
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{role.name}</h1>
        <p className="text-sm text-slate-600">{role.description}</p>
        <Link
          href="/admin/roles/permissions"
          className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline"
        >
          Edit permissions →
        </Link>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Users in this role ({users.length})
        </h2>
        {users.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No users assigned to this role.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between py-3 first:pt-0">
                <div>
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="font-medium text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    user.status === "Active" && "bg-emerald-100 text-emerald-800",
                    user.status === "Banned" && "bg-red-100 text-red-800",
                    user.status === "Pending" && "bg-amber-100 text-amber-800",
                  )}
                >
                  {user.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
