"use client";

import { Activity, AlertTriangle, FileText, Shield } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

function downloadSample(section: string, title: string) {
  const body = `IT Operations — ${section}\n${title}\nGenerated: ${new Date().toISOString()}\n\n[Sample excerpt — connect to report service.]`;
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sample-${title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function requestLatest(section: string, title: string) {
  window.alert(
    `Request queued: "${title}" (${section}). You will receive an email when the latest run is ready (demo).`,
  );
}

const SECTIONS = [
  {
    id: "health",
    title: "System health",
    description: "Availability, SLOs, synthetic probes, and resource pools.",
    icon: Activity,
    items: [
      "Weekly uptime & error budget",
      "Regional latency & saturation",
      "Database replication health",
    ],
  },
  {
    id: "security",
    title: "Security audits",
    description: "Control testing, vulnerability posture, and access reviews.",
    icon: Shield,
    items: [
      "Quarterly ISO 27001 evidence pack",
      "TLS & certificate inventory",
      "IAM privileged access summary",
    ],
  },
  {
    id: "incidents",
    title: "Incident post-mortems",
    description: "RCA summaries, timelines, and corrective actions.",
    icon: AlertTriangle,
    items: [
      "Sev-1 outage — March database failover",
      "Sev-2 — CDN misconfiguration window",
      "Sev-3 — elevated 5xx on enroll API",
    ],
  },
] as const;

export default function TechnicalReportsPage() {
  return (
    <div className="space-y-8 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <FileText className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Technical reports</h1>
        <p className="mt-1 text-sm text-slate-900/80">
          Curated libraries by domain. Preview static samples or request the latest compiled run.
        </p>
      </div>

      {SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <section key={section.id}>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-400" aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
                <p className="text-sm text-slate-900/80">{section.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {section.items.map((item) => (
                <Card
                  key={item}
                  className="border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-medium text-slate-900">{item}</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => downloadSample(section.title, item)}
                        className="rounded-lg border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-400 shadow-sm transition-colors hover:bg-indigo-50"
                      >
                        View sample
                      </button>
                      <button
                        type="button"
                        onClick={() => requestLatest(section.title, item)}
                        className="rounded-lg bg-indigo-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                      >
                        Request latest
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
