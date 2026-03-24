import Link from "next/link";
import { Activity, CalendarClock, ClipboardList, FileBarChart2, LifeBuoy, RotateCcw } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type BackupCard = {
  title: string;
  href: string;
  summary: string;
  metric: string;
  icon: React.ComponentType<{ className?: string }>;
};

const CARDS: BackupCard[] = [
  {
    title: "Backup Dashboard",
    href: "/operations/backup/backup-dashboard",
    summary: "Real-time status of the latest backup activities.",
    metric: "Last backup: 2h ago",
    icon: Activity,
  },
  {
    title: "Backup Schedule",
    href: "/operations/backup/backup-schedule",
    summary: "Manage automation windows and retention settings.",
    metric: "Daily full: 02:00 AM",
    icon: CalendarClock,
  },
  {
    title: "Backup History",
    href: "/operations/backup/backup-history",
    summary: "Track success and failure outcomes across all runs.",
    metric: "Success rate: 98.6%",
    icon: ClipboardList,
  },
  {
    title: "Restore Center",
    href: "/operations/backup/restore",
    summary: "Point-in-time recovery and restoration workflows.",
    metric: "Fastest restore: 31m",
    icon: RotateCcw,
  },
  {
    title: "Disaster Recovery",
    href: "/operations/backup/disaster-recovery",
    summary: "Run procedures, drills, and readiness checks.",
    metric: "Next drill: 5 days",
    icon: LifeBuoy,
  },
  {
    title: "Backup Reports",
    href: "/operations/backup/backup-reports",
    summary: "Export backup health reports in PDF and Excel.",
    metric: "Reports generated: 24",
    icon: FileBarChart2,
  },
];

export default function BackupHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Backup Command Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Centralize backup, restore, and disaster recovery operations from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <Link
                  href={item.href}
                  className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:border-indigo-400"
                >
                  Open
                </Link>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{item.metric}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
