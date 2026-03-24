import type { ComponentType } from "react";
import Link from "next/link";
import {
  Archive,
  ClipboardCheck,
  FileBarChart2,
  FileSearch,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type ComplianceHubCard = {
  title: string;
  href: string;
  summary: string;
  status: string;
  icon: ComponentType<{ className?: string }>;
};

const HUB_CARDS: ComplianceHubCard[] = [
  {
    title: "Compliance Dashboard",
    href: "/operations/compliance/compliance-dashboard",
    summary: "Visual summary of overall compliance score and status.",
    status: "Score: 94% | Status: On track",
    icon: LayoutDashboard,
  },
  {
    title: "Security & Audit",
    href: "/operations/compliance/compliance-audit",
    summary: "Internal and external audit checklists (ISO, GDPR, etc.).",
    status: "ISO: 2 items need review",
    icon: ClipboardCheck,
  },
  {
    title: "Audit Logs",
    href: "/operations/compliance/audit-logs",
    summary: "Track sensitive system actions and configuration changes.",
    status: "Events (24h): 428",
    icon: FileSearch,
  },
  {
    title: "Data Retention",
    href: "/operations/compliance/data-retention",
    summary: "Manage how long data is stored and when it is purged.",
    status: "Retention: 30 days policy active",
    icon: Archive,
  },
  {
    title: "GDPR Compliance",
    href: "/operations/compliance/gdpr-compliance",
    summary: "Data privacy, PII access, and user rights tooling.",
    status: "GDPR: Compliant",
    icon: ShieldCheck,
  },
  {
    title: "Compliance Reports",
    href: "/operations/compliance/compliance-reports",
    summary: "Generate official compliance documentation and exports.",
    status: "Last report: 5 days ago",
    icon: FileBarChart2,
  },
];

export default function ComplianceHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Compliance Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Central navigation for audits, retention, GDPR, logs, and compliance reporting.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HUB_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className="block rounded-xl text-inherit no-underline outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Card className="h-full border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <span className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                    Access
                  </span>
                </div>
                <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                <p className="mt-3 text-sm font-medium text-slate-900">{item.status}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
