"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

const PRIMARY_RESPONSIBILITIES = [
  "Academic Quality",
  "Financial Growth",
  "Strategic Planning",
  "Institutional Compliance",
  "Resource Allocation",
];

const ACTIVITY_LOG = [
  { id: "a1", action: "Approved 2026 Strategic Plan", at: "2025-03-05 14:30" },
  { id: "a2", action: "Escalated Quality Incident #402", at: "2025-03-04 11:00" },
  { id: "a3", action: "Signed off Q4 Financial Report", at: "2025-03-01 09:15" },
  { id: "a4", action: "Initiated KPI threshold review", at: "2025-02-28 16:00" },
];

const SUPER_VIEWER_DEPARTMENTS = [
  "Engineering",
  "Business",
  "Law",
  "Medicine",
  "Arts & Sciences",
  "Language",
  "Finance",
  "Quality (AQAD)",
];

const DEFAULT_CONTACT = {
  email: "deputy.director@university.edu",
  phone: "+998 71 123 4567",
  office: "Executive Wing, Room 101",
};

export default function DirectorProfilePage() {
  const [editContact, setEditContact] = React.useState(false);
  const [contact, setContact] = React.useState(DEFAULT_CONTACT);
  const [editForm, setEditForm] = React.useState(DEFAULT_CONTACT);

  const handleSaveContact = () => {
    setContact(editForm);
    setEditContact(false);
  };
  const handleCancelContact = () => {
    setEditForm(contact);
    setEditContact(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/director" className="text-sm font-medium text-slate-500 hover:text-slate-700">
          ← Deputy Director
        </Link>
      </div>

      {/* Strategic Profile Header */}
      <Card className="border-slate-200 bg-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dr. Elena Vasiliev</h1>
            <p className="mt-0.5 text-slate-600">Deputy Director</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PRIMARY_RESPONSIBILITIES.map((area) => (
                <li
                  key={area}
                  className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Activity Log */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Recent strategic actions
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">Summary of recent activity.</p>
        <ul className="mt-4 space-y-2">
          {ACTIVITY_LOG.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/30 px-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-800">{item.action}</span>
              <span className="text-xs text-slate-500">{item.at}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Contact Card with Edit mode */}
      <Card className="border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Professional contact
          </h2>
          {!editContact ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-500 text-slate-600 hover:bg-slate-500 hover:text-white"
              onClick={() => setEditContact(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="bg-slate-500 hover:bg-slate-600"
                onClick={handleSaveContact}
              >
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleCancelContact}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        {editContact ? (
          <div className="mt-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Office</label>
              <input
                type="text"
                value={editForm.office}
                onChange={(e) => setEditForm((p) => ({ ...p, office: e.target.value }))}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
              />
            </div>
          </div>
        ) : (
          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs font-medium text-slate-500">Email</dt>
              <dd className="text-slate-900">{contact.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Phone</dt>
              <dd className="text-slate-900">{contact.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Office</dt>
              <dd className="text-slate-900">{contact.office}</dd>
            </div>
          </dl>
        )}
      </Card>

      {/* Institutional Access */}
      <Card className="border-slate-200 bg-white">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Institutional access
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Departments where this user has Super-Viewer access.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {SUPER_VIEWER_DEPARTMENTS.map((dept) => (
            <li
              key={dept}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800"
            >
              <span className="h-2 w-2 rounded-full bg-slate-500" aria-hidden />
              {dept}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
