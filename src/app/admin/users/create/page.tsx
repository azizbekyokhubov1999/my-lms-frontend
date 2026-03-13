"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

const LMS_ROLES = [
  { id: "admin", name: "Admin", description: "Superuser" },
  { id: "rector", name: "Rector", description: "Executive overview" },
  { id: "dean", name: "Dean / Department Head", description: "Academic management" },
  { id: "aqad", name: "AQAD", description: "Quality assurance" },
  { id: "teacher", name: "Teacher", description: "Content & Instruction" },
  { id: "student", name: "Student", description: "Enrolled learner" },
  { id: "applicant", name: "Applicant", description: "Pre-enrollment status" },
  { id: "finance", name: "Finance / Accountant", description: "Payment management" },
  { id: "support", name: "Support / IT Admin", description: "Technical helpdesk" },
];

export default function AdminUserCreatePage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<string>("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`User created (Demo): ${name} / ${email} / ${role}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Users
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Create User</h1>
        <p className="mt-1 text-sm text-slate-600">
          Add a new user and assign a role.
        </p>
      </div>

      <Card className="max-w-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="e.g. Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane.doe@edu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helperText="Minimum 8 characters. User can change after first login."
          />
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-800">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {LMS_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.description})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary">
              Create User
            </Button>
            <Link
              href="/admin/users"
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
