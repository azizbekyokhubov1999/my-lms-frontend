import type { ComponentType } from "react";
import Link from "next/link";
import {
  Cpu,
  FileBarChart2,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type CapacityHubCard = {
  title: string;
  href: string;
  summary: string;
  metric: string;
  icon: ComponentType<{ className?: string }>;
};

const HUB_CARDS: CapacityHubCard[] = [
  {
    title: "Resource usage",
    href: "/operations/capacity/resource-usage",
    summary: "Real-time monitoring of CPU, memory, and disk across servers.",
    metric: "Avg CPU: 42% · Peak RAM: 68%",
    icon: Cpu,
  },
  {
    title: "Capacity planning",
    href: "/operations/capacity/capacity-planning",
    summary: "Long-term infrastructure growth and hardware procurement planning.",
    metric: "Headroom: 14 months at current growth",
    icon: TrendingUp,
  },
  {
    title: "Predictive forecasting",
    href: "/operations/capacity/forecasting",
    summary: "AI-driven predictions for when clusters approach resource limits.",
    metric: "Disk forecast: limit in ~38 days (95% CI)",
    icon: Sparkles,
  },
  {
    title: "System scaling",
    href: "/operations/capacity/scaling",
    summary: "Vertical and horizontal scaling operations for workloads and pools.",
    metric: "Auto-scale groups: 4 active · 1 dry-run",
    icon: SlidersHorizontal,
  },
  {
    title: "Capacity reports",
    href: "/operations/capacity/capacity-reports",
    summary: "Resource utilization and efficiency audits for finance and SRE.",
    metric: "Disk space: 1.2 TB free · efficiency score 0.87",
    icon: FileBarChart2,
  },
];

export default function CapacityHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Capacity Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Monitor usage, plan growth, forecast limits, scale systems, and export audits.
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
              <p className="mt-3 text-sm font-medium text-slate-900">{item.metric}</p>
              <div className="mt-auto pt-5">
                <Link
                  href={item.href}
                  prefetch
                  className="inline-flex w-full items-center justify-center rounded-lg border-2 border-indigo-400 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition-colors hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                >
                  Analyze
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
