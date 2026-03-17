"use client";

import Link from "next/link";

import { Card } from "../../components/ui/Card";

const DIRECTOR = {
  name: "Deputy Director",
  role: "Deputy Director",
  email: "deputy.director@university.edu",
  department: "Executive",
};

export default function DirectorProfilePage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-0.5 text-sm text-slate-600">Executive profile and workspace.</p>
      </div>
      <Card className="border-slate-200 bg-white">
        <dl className="space-y-3">
          <div>
            <dt className="text-xs font-medium text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{DIRECTOR.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Role</dt>
            <dd className="text-slate-800">{DIRECTOR.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Department</dt>
            <dd className="text-slate-800">{DIRECTOR.department}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Email</dt>
            <dd className="text-slate-800">{DIRECTOR.email}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
