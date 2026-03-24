"use client";

import * as React from "react";
import { ClipboardList } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

type ChangeStatus = "Pending" | "Approved" | "Implemented";

type ChangeRequest = {
  id: string;
  title: string;
  requester: string;
  risk: "Low" | "Medium" | "High";
  status: ChangeStatus;
};

const INITIAL: ChangeRequest[] = [
  {
    id: "CHG-1204",
    title: "Resize autoscaling group (web tier)",
    requester: "Platform SRE",
    risk: "Low",
    status: "Pending",
  },
  {
    id: "CHG-1203",
    title: "TLS 1.3 enforcement on edge proxies",
    requester: "Security Engineering",
    risk: "Medium",
    status: "Pending",
  },
  {
    id: "CHG-1202",
    title: "DB parameter group — shared_buffers tune",
    requester: "DBA",
    risk: "High",
    status: "Approved",
  },
  {
    id: "CHG-1198",
    title: "Rotate internal JWT signing keys",
    requester: "Identity",
    risk: "Medium",
    status: "Implemented",
  },
];

function statusBadge(status: ChangeStatus) {
  if (status === "Pending")
    return "border-amber-500/40 bg-amber-50 text-amber-800";
  if (status === "Approved")
    return "border-indigo-400/50 bg-indigo-50 text-indigo-800";
  return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
}

function randomId() {
  return `CHG-${Math.floor(1000 + Math.random() * 9000)}`;
}

export default function ChangeManagementPage() {
  const [changes, setChanges] = React.useState<ChangeRequest[]>(INITIAL);
  const [title, setTitle] = React.useState("");
  const [requester, setRequester] = React.useState("");
  const [risk, setRisk] = React.useState<ChangeRequest["risk"]>("Low");

  const submitChange = (e: React.FormEvent) => {
    e.preventDefault();
    const t = title.trim();
    const r = requester.trim();
    if (!t || !r) return;
    setChanges((prev) => [
      {
        id: randomId(),
        title: t,
        requester: r,
        risk,
        status: "Pending",
      },
      ...prev,
    ]);
    setTitle("");
    setRequester("");
    setRisk("Low");
  };

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <ClipboardList className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Change management</h1>
        <p className="mt-1 text-sm text-slate-600">
          CAB-tracked requests: submit, approve, and verify production changes.
        </p>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Change requests</h2>
        <p className="mt-1 text-xs text-slate-600">
          Status reflects workflow — pending review, approved for window, or implemented.
        </p>

        <ul className="mt-4 space-y-3">
          {changes.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-indigo-400">{c.id}</p>
                <p className="mt-1 font-medium text-slate-900">{c.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  Requested by <span className="font-medium text-slate-800">{c.requester}</span>
                  {" · "}
                  <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-medium text-slate-700">
                    Risk: {c.risk}
                  </span>
                </p>
              </div>
              <span
                className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusBadge(
                  c.status,
                )}`}
              >
                {c.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Request new change</h2>
        <p className="mt-1 text-xs text-slate-600">
          Opens a Pending record for CAB review (demo — no backend).
        </p>

        <form onSubmit={submitChange} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Change title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Enable read replica for reporting"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Requester
            </label>
            <input
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              placeholder="Team or name"
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Risk class
            </label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value as ChangeRequest["risk"])}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
            >
              Submit change request
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
