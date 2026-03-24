import type { ComponentType } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Download,
  FileText,
  History,
  Wand2,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type ReportsHubCard = {
  title: string;
  href: string;
  summary: string;
  icon: ComponentType<{ className?: string }>;
};

const HUB_CARDS: ReportsHubCard[] = [
  {
    title: "Technical reports",
    href: "/operations/reports/technical-reports",
    summary: "Pre-built reports for Health, Incidents, and Security.",
    icon: FileText,
  },
  {
    title: "Report generator",
    href: "/operations/reports/report-generator",
    summary: "Custom report builder with date ranges and filters.",
    icon: Wand2,
  },
  {
    title: "Report history",
    href: "/operations/reports/report-history",
    summary: "Previously generated reports and archives.",
    icon: History,
  },
  {
    title: "Export center",
    href: "/operations/reports/export",
    summary: "One-click exports in PDF, Excel, and JSON formats.",
    icon: Download,
  },
  {
    title: "Scheduled reports",
    href: "/operations/reports/scheduled-reports",
    summary: "Automated daily, weekly, and monthly report deliveries.",
    icon: CalendarClock,
  },
];

export default function ReportsHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Performance (operations guide)
        </p>
        <p className="mt-1 text-lg font-semibold text-slate-900">
          Average generation time:{" "}
          <span className="text-indigo-400 tabular-nums">4.2s</span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Rolling p50 across technical report jobs (last 7 days, demo metric).
        </p>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Reports Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Generate, archive, export, and schedule IT operations reporting.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HUB_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.href}
              className="flex h-full flex-col border-slate-200 bg-white shadow-sm"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                <Icon className="h-5 w-5 text-indigo-400" aria-hidden />
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{item.summary}</p>
              <div className="mt-5">
                <Link
                  href={item.href}
                  prefetch
                  className="inline-flex w-full items-center justify-center rounded-lg border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                >
                  Open
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
