"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

type RoleRow = {
  id: string;
  role: string;
  users: number;
  permissionSet: string;
};

const INITIAL_ROLES: RoleRow[] = [
  { id: "r1", role: "IT Admin", users: 3, permissionSet: "Full Access" },
  { id: "r2", role: "Security Analyst", users: 6, permissionSet: "Security + Logs" },
  { id: "r3", role: "Support Engineer", users: 12, permissionSet: "Operations Read/Write" },
];

export default function AccessManagementPage() {
  const [roles] = React.useState(INITIAL_ROLES);

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Role-Based Access Control</h1>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Users</th>
                <th className="px-4 py-3">Permissions</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-medium text-slate-900">{row.role}</td>
                  <td className="px-4 py-3">{row.users}</td>
                  <td className="px-4 py-3">{row.permissionSet}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="rounded-md border border-indigo-400 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">Edit Permissions</button>
                      <button type="button" className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">Assign Role</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
