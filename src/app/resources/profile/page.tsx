"use client";

import { Briefcase, Lock, Mail, MapPin, Phone, User } from "lucide-react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const PROFILE = {
  fullName: "Resource Officer",
  employeeId: "EMP-2047",
  role: "Resource Officer",
  department: "Resource & Human Capital",
  assignedFaculties: ["Engineering", "Business", "Law", "Medicine", "Arts & Sciences"],
  officeLocation: "Central Admin, Building A, Room 312",
  email: "resource-officer@university.edu",
  phone: "+1 (555) 123-4567",
  extension: "x 4521",
  lastLogin: "2026-03-06, 09:42 AM",
  twoFactorEnabled: true,
};

export default function ResourceOfficerProfilePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile & settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Your identity, professional details, contact information, and account security.
        </p>
      </div>

      {/* 1. User Identity */}
      <Card className="border-teal-100 bg-teal-50/30">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-teal-200 bg-teal-100 text-teal-700">
            <User className="h-12 w-12" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">{PROFILE.fullName}</h2>
            <p className="text-sm font-medium text-teal-700">{PROFILE.role}</p>
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-600">Employee ID</span> · {PROFILE.employeeId}
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Professional Details */}
      <Card className="border-teal-100">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <Briefcase className="h-4 w-4 text-teal-600" />
          Professional details
        </h2>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs font-medium text-slate-500">Department</dt>
            <dd className="mt-0.5 text-slate-900">{PROFILE.department}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Assigned faculties to monitor</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {PROFILE.assignedFaculties.map((f) => (
                <span
                  key={f}
                  className="rounded-md bg-teal-50 px-2.5 py-1 text-sm font-medium text-teal-800"
                >
                  {f}
                </span>
              ))}
            </dd>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
            <div>
              <dt className="text-xs font-medium text-slate-500">Office location</dt>
              <dd className="mt-0.5 text-slate-800">{PROFILE.officeLocation}</dd>
            </div>
          </div>
        </dl>
      </Card>

      {/* 3. Contact Information */}
      <Card className="border-teal-100 bg-teal-50/20">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Contact information
        </h2>
        <ul className="mt-4 space-y-4">
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Mail className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Corporate email</p>
              <p className="font-medium text-slate-900">{PROFILE.email}</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Phone</p>
              <p className="font-medium text-slate-900">{PROFILE.phone}</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-xs font-medium text-slate-500">Internal extension</p>
              <p className="font-medium text-slate-900">{PROFILE.extension}</p>
            </div>
          </li>
        </ul>
      </Card>

      {/* 4. Account Security */}
      <Card className="border-teal-100">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <Lock className="h-4 w-4 text-teal-600" />
          Account security
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-slate-500">Last login</p>
            <p className="mt-0.5 text-slate-800">{PROFILE.lastLogin}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="outline"
              className="border-teal-300 text-teal-800 hover:bg-teal-50 hover:border-teal-400"
              onClick={() => alert("Change password (Demo)")}
            >
              Change password
            </Button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <p className="text-xs font-medium text-slate-500">Two-Factor Authentication</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-800">
              {PROFILE.twoFactorEnabled ? (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden />
                  Enabled
                </>
              ) : (
                <>
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden />
                  Not enabled
                </>
              )}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
