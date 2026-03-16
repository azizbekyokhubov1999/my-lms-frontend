"use client";

import { Card } from "../../components/ui/Card";

const RESOURCE_OFFICER = {
  name: "Resource Officer",
  role: "Resource & Staffing Officer",
  email: "resource-officer@university.edu",
  department: "Central Resources",
  phone: "+1 (555) 123-4567",
  scope: "Teacher assignments, workload, access, replacements, and reporting across all departments.",
};

export default function ResourceOfficerProfilePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile & settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Resource officer information and workspace settings.
        </p>
      </div>

      <Card className="border-teal-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Resource officer</h2>
        <p className="mt-0.5 text-xs text-slate-600">Current logged-in resource officer (demo).</p>
        <dl className="mt-4 space-y-3">
          <div>
            <dt className="text-xs font-medium text-slate-500">Name</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{RESOURCE_OFFICER.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Role</dt>
            <dd className="mt-0.5 text-slate-800">{RESOURCE_OFFICER.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Department</dt>
            <dd className="mt-0.5 text-slate-800">{RESOURCE_OFFICER.department}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Email</dt>
            <dd className="mt-0.5 text-slate-800">{RESOURCE_OFFICER.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Phone</dt>
            <dd className="mt-0.5 text-slate-800">{RESOURCE_OFFICER.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Scope</dt>
            <dd className="mt-0.5 text-sm text-slate-600">{RESOURCE_OFFICER.scope}</dd>
          </div>
        </dl>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Settings</h2>
        <p className="mt-0.5 text-xs text-slate-600">Workspace preferences (demo).</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
          <li>· Notifications: department alerts and overload warnings</li>
          <li>· Default reporting period: current academic year</li>
          <li>· Language: English</li>
        </ul>
      </Card>
    </div>
  );
}
