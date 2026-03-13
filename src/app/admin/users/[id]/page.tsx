"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const MOCK_USERS: Record<string, { name: string; email: string; role: string; status: string; createdAt: string; lastLogin: string | null }> = {
  u1: { name: "Alex Johnson", email: "alex.johnson@edu.edu", role: "Teacher", status: "Active", createdAt: "2024-08-15", lastLogin: "2026-03-06 09:12" },
  u2: { name: "Jordan Lee", email: "jordan.lee@edu.edu", role: "Student", status: "Active", createdAt: "2025-01-10", lastLogin: "2026-03-06 08:45" },
  u3: { name: "Sam Chen", email: "sam.chen@edu.edu", role: "Student", status: "Active", createdAt: "2025-02-01", lastLogin: "2026-03-05 14:20" },
  u4: { name: "Riley Davis", email: "riley.davis@edu.edu", role: "Student", status: "Pending", createdAt: "2026-03-01", lastLogin: null },
  u5: { name: "Morgan Kim", email: "morgan.kim@edu.edu", role: "Teacher", status: "Active", createdAt: "2024-09-20", lastLogin: "2026-03-06 07:30" },
  u6: { name: "Casey Brown", email: "casey.brown@edu.edu", role: "Student", status: "Banned", createdAt: "2025-03-12", lastLogin: "2026-02-28 11:00" },
  u7: { name: "System Admin", email: "admin@edu.edu", role: "Admin", status: "Active", createdAt: "2023-01-01", lastLogin: "2026-03-06 10:00" },
};

const MOCK_ACCESS_LOGS: Record<string, Array<{ id: string; action: string; ip: string; at: string }>> = {
  u1: [
    { id: "l1", action: "Login", ip: "192.168.1.10", at: "2026-03-06 09:12" },
    { id: "l2", action: "View Gradebook", ip: "192.168.1.10", at: "2026-03-06 09:15" },
    { id: "l3", action: "Login", ip: "192.168.1.10", at: "2026-03-05 08:00" },
    { id: "l4", action: "Logout", ip: "192.168.1.10", at: "2026-03-04 17:22" },
    { id: "l5", action: "Login", ip: "10.0.0.5", at: "2026-03-04 08:05" },
  ],
  u2: [
    { id: "l6", action: "Login", ip: "192.168.1.22", at: "2026-03-06 08:45" },
    { id: "l7", action: "Submit Assignment", ip: "192.168.1.22", at: "2026-03-06 08:50" },
    { id: "l8", action: "Login", ip: "192.168.1.22", at: "2026-03-05 14:00" },
  ],
  u3: [
    { id: "l9", action: "Login", ip: "192.168.1.33", at: "2026-03-05 14:20" },
    { id: "l10", action: "Failed login", ip: "192.168.1.33", at: "2026-03-05 14:19" },
  ],
  u4: [],
  u5: [
    { id: "l11", action: "Login", ip: "192.168.1.55", at: "2026-03-06 07:30" },
    { id: "l12", action: "Login", ip: "192.168.1.55", at: "2026-03-04 09:00" },
  ],
  u6: [
    { id: "l13", action: "Login", ip: "192.168.1.66", at: "2026-02-28 11:00" },
  ],
  u7: [
    { id: "l14", action: "Login", ip: "10.0.0.1", at: "2026-03-06 10:00" },
    { id: "l15", action: "Access Admin Panel", ip: "10.0.0.1", at: "2026-03-06 10:01" },
  ],
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = (params?.id as string) ?? "";
  const user = MOCK_USERS[id];
  const logs = (id && MOCK_ACCESS_LOGS[id]) ?? [];

  if (!user) {
    return (
      <div>
        <p className="text-slate-600">User not found.</p>
        <Link href="/admin/users" className="mt-2 inline-block text-sm font-medium text-blue-700 hover:underline">
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/users" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Users
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{user.name}</h1>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => alert("View Activity Trail (Demo)")}>
            View Activity Trail
          </Button>
          <Button variant="primary" size="sm" onClick={() => alert("Reset Password (Demo)")}>
            Reset Password
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Profile
          </h2>
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs font-medium text-slate-500">Name</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Email</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Role</dt>
              <dd className="mt-0.5">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {user.role}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Status</dt>
              <dd className="mt-0.5">
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
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Created</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{user.createdAt}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Last Login</dt>
              <dd className="mt-0.5 text-sm text-slate-900">{user.lastLogin ?? "—"}</dd>
            </div>
          </dl>
        </Card>

        <Card className="flex flex-col p-0">
          <div className="border-b border-slate-100 px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Access logs
            </h2>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">No access logs for this user.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <li key={log.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <div>
                      <span className="font-medium text-slate-900">{log.action}</span>
                      <span className="ml-2 text-slate-500">{log.ip}</span>
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">{log.at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
