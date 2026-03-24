"use client";

import Link from "next/link";
import * as React from "react";
import { useRouter } from "next/navigation";

import { Card } from "../../../components/ui/Card";
import { Incident, Severity, loadIncidents, saveIncidents } from "../_shared";

function randomIncidentId() {
  return `INC-${Math.floor(10000 + Math.random() * 90000)}`;
}

export default function CreateIncidentPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [service, setService] = React.useState("Operations");
  const [description, setDescription] = React.useState("");
  const [urgency, setUrgency] = React.useState<Severity>("high");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !service.trim() || !description.trim()) {
      setError("Title, service, and description are required.");
      return;
    }

    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const id = randomIncidentId();
      const incident: Incident = {
        id,
        title: title.trim(),
        service: service.trim(),
        severity: urgency,
        urgency,
        status: "Open",
        createdAt: now,
        assignedTo: null,
        timeline: [
          { ts: now, label: "Detected", detail: "Incident manually reported." },
          { ts: now, label: "Investigating", detail: description.trim() },
        ],
      };
      const list = loadIncidents();
      saveIncidents([incident, ...list].slice(0, 200));
      router.push(`/operations/incidents/incident-detail?id=${encodeURIComponent(id)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 bg-slate-50">
      <div>
        <Link
          href="/operations/incidents"
          className="inline-flex items-center rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20"
        >
          Back to Incident Overview
        </Link>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create Incident</h1>
        <p className="mt-1 text-sm text-slate-600">Report a system failure with urgency levels.</p>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Service
              </label>
              <input
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Severity)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Description
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg border border-indigo-400/60 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-indigo-400/20 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Incident"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}

