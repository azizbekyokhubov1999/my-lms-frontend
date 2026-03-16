"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type PermissionScope = "course" | "student_data";
type PermissionLevel = "edit" | "view" | "read-only";

interface TeacherPermission {
  resource: string; // course code or "Student data"
  scope: PermissionScope;
  level: PermissionLevel;
  temporaryUntil?: string; // ISO date
}

interface TeacherAccess {
  id: string;
  name: string;
  permissions: TeacherPermission[];
}

interface AccessHistoryEntry {
  id: string;
  at: string;
  teacherName: string;
  action: "Granted" | "Revoked" | "Temporary set" | "Temporary expired";
  resource: string;
  details: string;
  performedBy: string;
}

const MOCK_TEACHERS = [
  { id: "t1", name: "Dr. Nina Kozlova" },
  { id: "t2", name: "Prof. Timur Akhmetov" },
  { id: "t3", name: "Dr. Aigerim Sadykova" },
  { id: "t4", name: "Assoc. Prof. Malik Nurgaliyev" },
  { id: "t5", name: "Mr. Alex Petrov" },
];

const MOCK_COURSES = ["CS101", "SE301", "LAW201", "MED301", "BUS101"];

const PERFORMED_BY = "Resource Manager";

const initialTeachers: TeacherAccess[] = [
  {
    id: "t1",
    name: "Dr. Nina Kozlova",
    permissions: [
      { resource: "CS101", scope: "course", level: "edit" },
      { resource: "SE301", scope: "course", level: "edit" },
      { resource: "Student data", scope: "student_data", level: "view" },
    ],
  },
  {
    id: "t2",
    name: "Prof. Timur Akhmetov",
    permissions: [
      { resource: "BUS101", scope: "course", level: "edit" },
      { resource: "Student data", scope: "student_data", level: "view" },
    ],
  },
  {
    id: "t3",
    name: "Dr. Aigerim Sadykova",
    permissions: [
      { resource: "LAW201", scope: "course", level: "edit" },
      { resource: "Student data", scope: "student_data", level: "view" },
    ],
  },
  {
    id: "t4",
    name: "Assoc. Prof. Malik Nurgaliyev",
    permissions: [
      { resource: "MED301", scope: "course", level: "edit" },
      { resource: "Student data", scope: "student_data", level: "view" },
    ],
  },
  {
    id: "t5",
    name: "Mr. Alex Petrov",
    permissions: [],
  },
];

const initialHistory: AccessHistoryEntry[] = [
  {
    id: "h1",
    at: "2026-03-01 14:30",
    teacherName: "Mr. Alex Petrov",
    action: "Temporary set",
    resource: "CS101",
    details: "Read-only until 2026-04-01",
    performedBy: PERFORMED_BY,
  },
  {
    id: "h2",
    at: "2026-02-28 09:00",
    teacherName: "Dr. Nina Kozlova",
    action: "Granted",
    resource: "Student data",
    details: "View access",
    performedBy: PERFORMED_BY,
  },
];

function formatPermission(p: TeacherPermission): string {
  const level = p.level === "read-only" ? "Read-only" : p.level === "edit" ? "Edit" : "View";
  const temp = p.temporaryUntil ? ` (until ${p.temporaryUntil})` : "";
  return `${p.resource}: ${level}${temp}`;
}

export default function AccessManagementPage() {
  const [teachers, setTeachers] = React.useState<TeacherAccess[]>(initialTeachers);
  const [history, setHistory] = React.useState<AccessHistoryEntry[]>(initialHistory);
  const nextHistoryIdRef = React.useRef(100);

  // Grant/Revoke form
  const [grantTeacherId, setGrantTeacherId] = React.useState("");
  const [grantResource, setGrantResource] = React.useState("");
  const [grantAction, setGrantAction] = React.useState<"Grant" | "Revoke">("Grant");
  const [grantLevel, setGrantLevel] = React.useState<PermissionLevel>("edit");

  // Temporary Access form
  const [tempTeacherId, setTempTeacherId] = React.useState("");
  const [tempExpiry, setTempExpiry] = React.useState("");
  const [tempResource, setTempResource] = React.useState("");

  const logHistory = React.useCallback((entry: Omit<AccessHistoryEntry, "id" | "at">) => {
    const d = new Date();
    const at = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const id = `h${++nextHistoryIdRef.current}`;
    setHistory((prev) => [{ ...entry, id, at }, ...prev]);
  }, []);

  const handleGrantRevoke = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantTeacherId || !grantResource) return;
    const teacher = teachers.find((t) => t.id === grantTeacherId);
    if (!teacher) return;

    if (grantAction === "Grant") {
      const existing = teacher.permissions.find((p) => p.resource === grantResource);
      if (existing) return;
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === grantTeacherId
            ? {
                ...t,
                permissions: [...t.permissions, { resource: grantResource, scope: grantResource === "Student data" ? "student_data" : "course", level: grantLevel }],
              }
            : t,
        ),
      );
      logHistory({
        teacherName: teacher.name,
        action: "Granted",
        resource: grantResource,
        details: `${grantLevel} access`,
        performedBy: PERFORMED_BY,
      });
    } else {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === grantTeacherId ? { ...t, permissions: t.permissions.filter((p) => p.resource !== grantResource) } : t,
        ),
      );
      logHistory({
        teacherName: teacher.name,
        action: "Revoked",
        resource: grantResource,
        details: "Access removed",
        performedBy: PERFORMED_BY,
      });
    }
    setGrantTeacherId("");
    setGrantResource("");
  };

  const handleTemporaryAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTeacherId || !tempExpiry || !tempResource) return;
    const teacher = teachers.find((t) => t.id === tempTeacherId);
    if (!teacher) return;

    const existing = teacher.permissions.find((p) => p.resource === tempResource);
    const newPerm: TeacherPermission = {
      resource: tempResource,
      scope: tempResource === "Student data" ? "student_data" : "course",
      level: "read-only",
      temporaryUntil: tempExpiry,
    };

    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id !== tempTeacherId) return t;
        const without = t.permissions.filter((p) => p.resource !== tempResource);
        return { ...t, permissions: [...without, newPerm] };
      }),
    );
    logHistory({
      teacherName: teacher.name,
      action: "Temporary set",
      resource: tempResource,
      details: `Read-only until ${tempExpiry}`,
      performedBy: PERFORMED_BY,
    });
    setTempTeacherId("");
    setTempExpiry("");
    setTempResource("");
  };

  const resourceOptions = React.useMemo(() => {
    const courses = MOCK_COURSES.map((c) => ({ value: c, label: c }));
    return [...courses, { value: "Student data", label: "Student data" }];
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Access management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Overview of teacher permissions, grant/revoke access to courses or student data, and set temporary read-only access. Every change is logged in Access History.
        </p>
      </div>

      {/* 1. Access Overview */}
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Access overview</h2>
        <p className="mt-0.5 text-xs text-slate-600">All teachers and their current system permissions.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Permissions</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Temporary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t) => {
                const tempPerms = t.permissions.filter((p) => p.temporaryUntil);
                return (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-medium text-slate-900">{t.name}</td>
                    <td className="max-w-md px-4 py-3">
                      <ul className="flex flex-wrap gap-x-2 gap-y-1 text-slate-700">
                        {t.permissions.length === 0 ? (
                          <li className="text-slate-500">No access</li>
                        ) : (
                          t.permissions.map((p) => (
                            <li key={p.resource} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
                              {formatPermission(p)}
                            </li>
                          ))
                        )}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {tempPerms.length > 0
                        ? tempPerms.map((p) => `${p.resource} until ${p.temporaryUntil}`).join("; ")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 2. Grant / Revoke Access */}
        <Card className="border-teal-100">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Grant / revoke access</h2>
          <p className="mt-0.5 text-xs text-slate-600">Add or remove a teacher&apos;s access to a course or student data.</p>
          <form onSubmit={handleGrantRevoke} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Teacher</label>
              <select
                value={grantTeacherId}
                onChange={(e) => setGrantTeacherId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                required
              >
                <option value="">Select teacher</option>
                {MOCK_TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Resource</label>
              <select
                value={grantResource}
                onChange={(e) => setGrantResource(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                required
              >
                <option value="">Course or student data</option>
                {resourceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            {grantAction === "Grant" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Level</label>
                <select
                  value={grantLevel}
                  onChange={(e) => setGrantLevel(e.target.value as PermissionLevel)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="edit">Edit</option>
                  <option value="view">View</option>
                </select>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={grantAction === "Grant" ? "primary" : "secondary"}
                size="sm"
                className={grantAction === "Grant" ? "bg-teal-600 hover:bg-teal-700" : ""}
                onClick={() => setGrantAction("Grant")}
              >
                Grant
              </Button>
              <Button
                type="button"
                variant={grantAction === "Revoke" ? "primary" : "secondary"}
                size="sm"
                className={grantAction === "Revoke" ? "bg-teal-600 hover:bg-teal-700" : ""}
                onClick={() => setGrantAction("Revoke")}
              >
                Revoke
              </Button>
            </div>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!grantTeacherId || !grantResource}>
              {grantAction} access
            </Button>
          </form>
        </Card>

        {/* 3. Temporary Access */}
        <Card className="border-teal-100">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Temporary access</h2>
          <p className="mt-0.5 text-xs text-slate-600">Set read-only access for a substitute teacher with an expiry date.</p>
          <form onSubmit={handleTemporaryAccess} className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Teacher</label>
              <select
                value={tempTeacherId}
                onChange={(e) => setTempTeacherId(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                required
              >
                <option value="">Select teacher</option>
                {MOCK_TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Resource (course or student data)</label>
              <select
                value={tempResource}
                onChange={(e) => setTempResource(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                required
              >
                <option value="">Select</option>
                {resourceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-600">
              Access level: <strong>Read-only</strong> (fixed for temporary access).
            </p>
            <Input
              type="date"
              label="Expires on"
              value={tempExpiry}
              onChange={(e) => setTempExpiry(e.target.value)}
              required
              min={new Date().toISOString().slice(0, 10)}
            />
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={!tempTeacherId || !tempExpiry || !tempResource}>
              Set temporary access
            </Button>
          </form>
        </Card>
      </div>

      {/* 4. Access History */}
      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Access history</h2>
        <p className="mt-0.5 text-xs text-slate-600">Security: every change is logged here.</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">When</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Teacher</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Action</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Resource</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Details</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Performed by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{h.at}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{h.teacherName}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        h.action === "Granted" && "bg-teal-100 text-teal-800",
                        h.action === "Revoked" && "bg-red-100 text-red-800",
                        (h.action === "Temporary set" || h.action === "Temporary expired") && "bg-amber-100 text-amber-800",
                      )}
                    >
                      {h.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{h.resource}</td>
                  <td className="max-w-[200px] px-4 py-3 text-slate-600">{h.details}</td>
                  <td className="px-4 py-3 text-slate-600">{h.performedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
