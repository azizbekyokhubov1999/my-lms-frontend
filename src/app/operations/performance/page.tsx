import Link from "next/link";
import { BarChart3, Database, Gauge, Layers, SlidersHorizontal, Wrench } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type PerformanceCard = {
  title: string;
  href: string;
  summary: string;
  metric: string;
  cta: "Analyze" | "Open";
  icon: React.ComponentType<{ className?: string }>;
};

const HUB_CARDS: PerformanceCard[] = [
  {
    title: "Performance Dashboard",
    href: "/operations/performance/performance-dashboard",
    summary: "Overall system speed and latency metrics.",
    metric: "Avg Load Time: 1.2s",
    cta: "Open",
    icon: Gauge,
  },
  {
    title: "Query Performance",
    href: "/operations/performance/query-performance",
    summary: "Analysis of slow database queries and execution times.",
    metric: "Slow Queries: 14",
    cta: "Analyze",
    icon: Database,
  },
  {
    title: "Caching Management",
    href: "/operations/performance/caching",
    summary: "Monitor cache hit rates and clear system cache.",
    metric: "Cache Hit Rate: 92%",
    cta: "Open",
    icon: Layers,
  },
  {
    title: "Bottleneck Analysis",
    href: "/operations/performance/bottleneck-analysis",
    summary: "Identifying resource constraints and system lags.",
    metric: "Top Bottleneck: DB I/O",
    cta: "Analyze",
    icon: BarChart3,
  },
  {
    title: "System Optimization",
    href: "/operations/performance/optimization",
    summary: "Tasks for image compression, lazy loading, and code splitting.",
    metric: "Optimization Tasks: 7",
    cta: "Open",
    icon: Wrench,
  },
  {
    title: "Performance Reports",
    href: "/operations/performance/performance-reports",
    summary: "Generate weekly and monthly performance audits.",
    metric: "Last Audit: 2 days ago",
    cta: "Open",
    icon: SlidersHorizontal,
  },
];

export default function PerformanceHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Performance Optimization Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Centralized analysis workspace for speed, bottlenecks, caching, and optimization strategy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {HUB_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <Link
                  href={item.href}
                  className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:border-indigo-400"
                >
                  {item.cta}
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
