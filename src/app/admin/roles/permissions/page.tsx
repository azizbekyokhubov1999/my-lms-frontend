"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ROLE_IDS = ["admin", "rector", "dean", "aqad", "teacher", "student", "applicant", "finance", "support"] as const;
const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  rector: "Rector",
  dean: "Dean",
  aqad: "AQAD",
  teacher: "Teacher",
  student: "Student",
  applicant: "Applicant",
  finance: "Finance",
  support: "Support",
};

const PERMISSIONS = [
  { id: "delete_course", label: "Can Delete Course", category: "Courses" },
  { id: "edit_course", label: "Can Edit Course", category: "Courses" },
  { id: "create_course", label: "Can Create Course", category: "Courses" },
  { id: "view_course", label: "Can View Course", category: "Courses" },
  { id: "view_finance", label: "Can View Finance", category: "Finance" },
  { id: "edit_finance", label: "Can Edit Finance", category: "Finance" },
  { id: "manage_users", label: "Can Manage Users", category: "Identity" },
  { id: "manage_roles", label: "Can Manage Roles", category: "Identity" },
  { id: "view_gradebook", label: "Can View Gradebook", category: "Grading" },
  { id: "edit_grades", label: "Can Edit Grades", category: "Grading" },
  { id: "view_reports", label: "Can View Reports", category: "Reports" },
  { id: "export_data", label: "Can Export Data", category: "Reports" },
  { id: "access_admin", label: "Can Access Admin Panel", category: "System" },
  { id: "view_logs", label: "Can View System Logs", category: "System" },
];

// Default matrix per role
function getInitialMatrix(): Record<string, Record<string, boolean>> {
  const matrix: Record<string, Record<string, boolean>> = {};
  const teacherPerms = ["edit_course", "create_course", "view_course", "view_gradebook", "edit_grades", "view_reports", "export_data"];
  const studentPerms = ["view_course", "view_gradebook"];
  const supportPerms = ["view_course", "view_gradebook", "view_reports", "view_logs"];
  const rectorPerms = ["view_course", "view_gradebook", "view_reports", "export_data", "access_admin", "view_logs"];
  const deanPerms = ["view_course", "edit_course", "create_course", "view_gradebook", "edit_grades", "view_reports", "export_data", "manage_users"];
  const aqadPerms = ["view_course", "view_gradebook", "view_reports", "export_data", "view_logs"];
  const applicantPerms: string[] = [];
  const financePerms = ["view_finance", "edit_finance", "view_reports", "export_data"];

  const rolePerms: Record<string, string[]> = {
    admin: PERMISSIONS.map((p) => p.id),
    rector: rectorPerms,
    dean: deanPerms,
    aqad: aqadPerms,
    teacher: teacherPerms,
    student: studentPerms,
    applicant: applicantPerms,
    finance: financePerms,
    support: supportPerms,
  };

  ROLE_IDS.forEach((roleId) => {
    matrix[roleId] = {};
    PERMISSIONS.forEach((p) => {
      matrix[roleId][p.id] = (rolePerms[roleId] ?? []).includes(p.id);
    });
  });
  return matrix;
}

export default function AdminPermissionsPage() {
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, boolean>>>(getInitialMatrix);
  const [saved, setSaved] = React.useState(false);

  const toggle = (roleId: string, permissionId: string) => {
    setMatrix((prev) => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [permissionId]: !prev[roleId]?.[permissionId],
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const byCategory = React.useMemo(() => {
    const map: Record<string, typeof PERMISSIONS> = {};
    PERMISSIONS.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    return map;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/roles" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Roles
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Permissions Matrix</h1>
          <p className="mt-1 text-sm text-slate-600">
            Toggle specific rights for each role. Changes apply after Save.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleSave}>
          {saved ? "Saved" : "Save changes"}
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="w-48 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Permission
                </th>
                {ROLE_IDS.map((roleId) => (
                  <th
                    key={roleId}
                    className="min-w-[100px] px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {ROLE_LABELS[roleId]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(byCategory).map(([category, perms]) => (
                <React.Fragment key={category}>
                  <tr className="bg-slate-50/70">
                    <td colSpan={1 + ROLE_IDS.length} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {category}
                    </td>
                  </tr>
                  {perms.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2.5 font-medium text-slate-900">{p.label}</td>
                      {ROLE_IDS.map((roleId) => (
                        <td key={roleId} className="px-4 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggle(roleId, p.id)}
                            className={cn(
                              "inline-flex h-6 w-6 items-center justify-center rounded border transition-colors",
                              matrix[roleId]?.[p.id]
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-300 bg-white text-slate-400 hover:border-slate-400",
                            )}
                            aria-label={`${p.label} for ${ROLE_LABELS[roleId]}: ${matrix[roleId]?.[p.id] ? "on" : "off"}`}
                          >
                            {matrix[roleId]?.[p.id] ? (
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-[10px]">—</span>
                            )}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
