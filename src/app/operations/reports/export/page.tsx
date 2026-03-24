"use client";

import { BarChart3, Download, ScrollText, Users } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

import { HubBackButton } from "../HubBackButton";

function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const SILOS = [
  {
    id: "logs",
    title: "Logs",
    description: "Application, edge, and auth logs (redacted sample extracts).",
    icon: ScrollText,
    stub: { lines: 128400, sources: 14 },
  },
  {
    id: "users",
    title: "Users",
    description: "Directory snapshot — roles, last login, MFA status.",
    icon: Users,
    stub: { accounts: 8420, active7d: 6120 },
  },
  {
    id: "metrics",
    title: "Metrics",
    description: "Time-series KPIs — CPU, latency, queue depth, business counters.",
    icon: BarChart3,
    stub: { series: 96, retentionDays: 400 },
  },
] as const;

export default function ExportCenterPage() {
  const exportPdf = (silo: (typeof SILOS)[number]) => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Export ${silo.title}</title>
      <style>body{font-family:system-ui;padding:24px;color:#0f172a}h1{font-size:18px}</style></head><body>
      <h1>Export: ${silo.title}</h1><p>${silo.description}</p><pre>${JSON.stringify(silo.stub, null, 2)}</pre>
      <p style="margin-top:16px;font-size:12px">Print → Save as PDF</p>
      <button type="button" onclick="window.print()" style="margin-top:12px;padding:12px 20px;border-radius:8px;border:2px solid #818cf8;background:#818cf8;color:#fff;font-weight:600;cursor:pointer;width:100%">Export now (print)</button>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
  };

  const exportXlsx = (silo: (typeof SILOS)[number]) => {
    const rows = [
      ["Silo", silo.title],
      ["Description", silo.description],
      ["Payload", JSON.stringify(silo.stub)],
    ];
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadText(`export-${silo.id}-${Date.now()}.xlsx`, csv, "text/csv;charset=utf-8");
  };

  const exportJson = (silo: (typeof SILOS)[number]) => {
    downloadText(
      `export-${silo.id}-${Date.now()}.json`,
      JSON.stringify({ silo: silo.id, title: silo.title, stub: silo.stub, at: new Date().toISOString() }, null, 2),
      "application/json;charset=utf-8",
    );
  };

  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <HubBackButton />
        <Download className="h-6 w-6 text-indigo-400" aria-hidden />
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Export center</h1>
        <p className="mt-1 text-sm text-slate-900/80">
          Data silos for bulk exports. Formats are demo downloads; wire to your lake and IAM policies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {SILOS.map((silo) => {
          const Icon = silo.icon;
          return (
            <Card
              key={silo.id}
              className="flex flex-col border-slate-200 bg-white shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
                <Icon className="h-6 w-6 text-indigo-400" aria-hidden />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">{silo.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-900/80">{silo.description}</p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => exportPdf(silo)}
                  className="w-full rounded-xl bg-indigo-400 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
                >
                  Export now — PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportXlsx(silo)}
                  className="w-full rounded-xl border-2 border-indigo-400 bg-white py-4 text-base font-semibold text-indigo-400 transition-colors hover:bg-indigo-50"
                >
                  Export now — XLSX
                </button>
                <button
                  type="button"
                  onClick={() => exportJson(silo)}
                  className="w-full rounded-xl border-2 border-indigo-400 bg-white py-4 text-base font-semibold text-indigo-400 transition-colors hover:bg-indigo-50"
                >
                  Export now — JSON
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
