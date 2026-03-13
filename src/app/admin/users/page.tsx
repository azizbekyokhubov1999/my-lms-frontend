"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type Status = "Active" | "Banned" | "Pending";

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: string;
  status: Status;
  lastLogin: string | null;
}

const LMS_ROLE_OPTIONS = [
  "Admin",
  "Rector",
  "Dean / Department Head",
  "AQAD",
  "Teacher",
  "Student",
  "Applicant",
  "Finance / Accountant",
  "Support / IT Admin",
];
const STATUSES: Status[] = ["Active", "Banned", "Pending"];

const MOCK_USERS: UserRow[] = [
  { id: "u1", email: "alex.johnson@edu.edu", name: "Alex Johnson", role: "Teacher", status: "Active", lastLogin: "2026-03-06 09:12" },
  { id: "u2", email: "jordan.lee@edu.edu", name: "Jordan Lee", role: "Student", status: "Active", lastLogin: "2026-03-06 08:45" },
  { id: "u3", email: "sam.chen@edu.edu", name: "Sam Chen", role: "Student", status: "Active", lastLogin: "2026-03-05 14:20" },
  { id: "u4", email: "riley.davis@edu.edu", name: "Riley Davis", role: "Student", status: "Pending", lastLogin: null },
  { id: "u5", email: "morgan.kim@edu.edu", name: "Morgan Kim", role: "Teacher", status: "Active", lastLogin: "2026-03-06 07:30" },
  { id: "u6", email: "casey.brown@edu.edu", name: "Casey Brown", role: "Student", status: "Banned", lastLogin: "2026-02-28 11:00" },
  { id: "u7", email: "admin@edu.edu", name: "System Admin", role: "Admin", status: "Active", lastLogin: "2026-03-06 10:00" },
];

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = React.useState<string>("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [lastLoginFilter, setLastLoginFilter] = React.useState<string>("");
  const [search, setSearch] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [bulkActionOpen, setBulkActionOpen] = React.useState(false);
  const [changeRoleOpen, setChangeRoleOpen] = React.useState(false);
  const [newRole, setNewRole] = React.useState<string>("Student");

  const filtered = React.useMemo(() => {
    return MOCK_USERS.filter((u) => {
      if (roleFilter && u.role !== roleFilter) return false;
      if (statusFilter && u.status !== statusFilter) return false;
      if (lastLoginFilter === "never" && u.lastLogin != null) return false;
      if (lastLoginFilter === "24h" && u.lastLogin == null) return false;
      if (lastLoginFilter === "24h" && u.lastLogin) {
        const t = new Date(u.lastLogin).getTime();
        if (Date.now() - t > 24 * 60 * 60 * 1000) return false;
      }
      if (lastLoginFilter === "7d" && u.lastLogin) {
        const t = new Date(u.lastLogin).getTime();
        if (Date.now() - t > 7 * 24 * 60 * 60 * 1000) return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [roleFilter, statusFilter, lastLoginFilter, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((u) => u.id)));
  };

  const handleDeactivateSelected = () => {
    alert(`Deactivate ${selectedIds.size} user(s)? (Demo)`);
    setBulkActionOpen(false);
    setSelectedIds(new Set());
  };

  const handleChangeRole = () => {
    alert(`Change role to ${newRole} for ${selectedIds.size} user(s)? (Demo)`);
    setChangeRoleOpen(false);
    setSelectedIds(new Set());
  };

  const handleExportCsv = () => {
    const headers = ["id", "name", "email", "role", "status", "lastLogin"];
    const rows = filtered.map((u) => [u.id, u.name, u.email, u.role, u.status, u.lastLogin ?? ""].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    setBulkActionOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage accounts, roles, and status. Use filters and bulk actions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/users/bulk-import"
            className="inline-flex h-8 items-center justify-center rounded-md border border-blue-900 px-3 text-xs font-medium text-blue-900 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
          >
            Bulk Import
          </Link>
          <Link
            href="/admin/users/create"
            className="inline-flex h-8 items-center justify-center rounded-md bg-blue-900 px-3 text-xs font-medium text-white transition-colors hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2"
          >
            Create User
          </Link>
        </div>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <Input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="">All roles</option>
            {LMS_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={lastLoginFilter}
            onChange={(e) => setLastLoginFilter(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="">Last login: Any</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="never">Never logged in</option>
          </select>
        </div>

        {selectedIds.size > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-medium text-slate-700">
              {selectedIds.size} selected
            </span>
            <div className="relative flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setBulkActionOpen((o) => !o)}>
                Bulk actions
              </Button>
              {bulkActionOpen && (
                <div className="absolute left-0 top-full z-10 mt-1 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => { setBulkActionOpen(false); setChangeRoleOpen(true); }}
                  >
                    Change Role
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    onClick={handleDeactivateSelected}
                  >
                    Deactivate Selected
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    onClick={handleExportCsv}
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>
            <Button variant="secondary" size="sm" onClick={() => setSelectedIds(new Set())}>
              Clear selection
            </Button>
          </div>
        )}

        {changeRoleOpen && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="text-sm text-slate-700">Set role for selected:</span>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {LMS_ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <Button size="sm" onClick={handleChangeRole}>Apply</Button>
            <Button variant="secondary" size="sm" onClick={() => setChangeRoleOpen(false)}>Cancel</Button>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-10 px-3 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Role</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Last Login</th>
                <th className="w-20 px-4 py-3 text-right font-medium text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/admin/users/${user.id}`} className="text-blue-700 hover:underline">
                      {user.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.lastLogin ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-sm font-medium text-blue-700 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-8 text-center text-slate-500">No users match the filters.</p>
        )}
      </Card>
    </div>
  );
}
