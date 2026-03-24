import type { ComponentType } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  History,
  PackageOpen,
  Server,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type MaintenanceHubCard = {
  title: string;
  href: string;
  summary: string;
  status: string;
  icon: ComponentType<{ className?: string }>;
};

const HUB_CARDS: MaintenanceHubCard[] = [
  {
    title: "System Maintenance",
    href: "/operations/maintenance/maintenance",
    summary: "Overall hardware and software health status.",
    status: "Last check: 4 hours ago | Status: Healthy",
    icon: Server,
  },
  {
    title: "System Updates",
    href: "/operations/maintenance/updates",
    summary: "Manage OS, Security, and App updates.",
    status: "Last update: 2 days ago",
    icon: PackageOpen,
  },
  {
    title: "Change Management",
    href: "/operations/maintenance/change-management",
    summary: "Tracking and approving system configuration changes.",
    status: "3 changes pending approval",
    icon: ClipboardList,
  },
  {
    title: "Maintenance Schedule",
    href: "/operations/maintenance/maintenance-schedule",
    summary: "Calendar view of planned downtime and windows.",
    status: "Next window: Sunday 02:00–04:00 UTC",
    icon: CalendarDays,
  },
  {
    title: "Maintenance History",
    href: "/operations/maintenance/maintenance-history",
    summary: "Log of all past maintenance activities and results.",
    status: "Last entry: backup verification — success",
    icon: History,
  },
];

export default function MaintenanceHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Maintenance Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Central access to system health, updates, changes, scheduling, and history.
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
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-400" aria-hidden />
                </div>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{item.status}</p>
              <div className="mt-auto pt-5">
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
