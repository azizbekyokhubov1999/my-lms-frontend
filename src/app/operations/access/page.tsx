import Link from "next/link";
import { FileText, Globe, KeyRound, ShieldCheck, ShieldUser, UserRoundCog, Vault } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type AccessHubCard = {
  title: string;
  href: string;
  summary: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ACCESS_CARDS: AccessHubCard[] = [
  {
    title: "Access Management",
    href: "/operations/access/access-management",
    summary: "Centralized user access governance and role controls.",
    status: "Active Policies: 18",
    icon: UserRoundCog,
  },
  {
    title: "API Keys Management",
    href: "/operations/access/api-keys-management",
    summary: "Securely manage service keys and integration credentials.",
    status: "API Keys: 5 Active",
    icon: KeyRound,
  },
  {
    title: "Token Management",
    href: "/operations/access/token-management",
    summary: "Track token lifecycle, expiry, and revocation actions.",
    status: "Expiring Tokens: 3",
    icon: Vault,
  },
  {
    title: "IP Whitelisting",
    href: "/operations/access/ip-whitelisting",
    summary: "Control trusted network ranges for sensitive endpoints.",
    status: "Whitelisted CIDRs: 12",
    icon: Globe,
  },
  {
    title: "VPN Access",
    href: "/operations/access/vpn-access",
    summary: "Monitor remote operator sessions and tunnel status.",
    status: "VPN: 12 Users Connected",
    icon: ShieldUser,
  },
  {
    title: "Access Logs",
    href: "/operations/access/access-logs",
    summary: "Audit login attempts, privileged actions, and denials.",
    status: "Events Today: 1,248",
    icon: FileText,
  },
  {
    title: "Access Audit",
    href: "/operations/access/access-audit",
    summary: "Review compliance checks and access review outcomes.",
    status: "Audit Score: 96%",
    icon: ShieldCheck,
  },
];

export default function AccessCommandHubPage() {
  return (
    <div className="space-y-6 bg-slate-50 text-slate-900">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Access Command Hub</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage identity, keys, tokens, VPN access, and audit visibility from one control center.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ACCESS_CARDS.map((item) => {
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
                  Manage
                </Link>
              </div>
              <h2 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
              <p className="mt-3 text-sm font-medium text-slate-900">{item.status}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
