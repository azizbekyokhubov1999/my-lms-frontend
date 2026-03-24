import Link from "next/link";
import {
  FileCheck2,
  FileText,
  Flame,
  KeyRound,
  Shield,
  ShieldCheck,
  ShieldEllipsis,
} from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type SecurityNavCard = {
  title: string;
  href: string;
  summary: string;
  cta: "Manage" | "View";
  icon: React.ComponentType<{ className?: string }>;
};

const SECURITY_CARDS: SecurityNavCard[] = [
  {
    title: "Security Dashboard",
    href: "/operations/security/security-dashboard",
    summary: "Risk Score: 92/100. Threat level remains controlled.",
    cta: "View",
    icon: Shield,
  },
  {
    title: "Security Logs",
    href: "/operations/security/security-logs",
    summary: "1,248 events in last 24h. 4 warnings require review.",
    cta: "View",
    icon: FileText,
  },
  {
    title: "Threat Detection",
    href: "/operations/security/threat-detection",
    summary: "Threat feed: 2 active anomalies under investigation.",
    cta: "Manage",
    icon: Flame,
  },
  {
    title: "API Keys",
    href: "/operations/security/api-keys",
    summary: "API Keys: 14 active credentials, 2 pending rotation.",
    cta: "Manage",
    icon: KeyRound,
  },
  {
    title: "Certificates",
    href: "/operations/security/certificates",
    summary: "Certificates: 2 expiring soon, renewal checks queued.",
    cta: "Manage",
    icon: ShieldCheck,
  },
  {
    title: "Firewall Rules",
    href: "/operations/security/firewall-rules",
    summary: "Firewall: 12 active rules and 3 staged policies.",
    cta: "Manage",
    icon: ShieldEllipsis,
  },
  {
    title: "Security Audit",
    href: "/operations/security/security-audit",
    summary: "Audit readiness at 96%. One control needs evidence.",
    cta: "View",
    icon: FileCheck2,
  },
];

export default function SecurityCommandCenterPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
            <Shield className="h-4 w-4" />
            Security Operations
          </div>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Security Command Center</h1>
          <p className="mt-1 text-sm text-slate-600">
            Centralized security controls, event monitoring, and audit readiness.
          </p>
        </div>

        <Link
          href="/operations/security/security-audit"
          className="inline-flex items-center justify-center rounded-lg border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
        >
          Generate Security Audit Report
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SECURITY_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.href} className="border-slate-200 bg-white shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>
                <Link
                  href={item.href}
                  className="rounded-md border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  {item.cta}
                </Link>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
