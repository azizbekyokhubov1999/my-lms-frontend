import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

export default function VpnAccessPage() {
  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">VPN Access Dashboard</h1>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Active Connections</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">12</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Configuration</p>
            <p className="mt-1 text-sm text-slate-700">MFA Required | AES-256 | Split Tunnel Disabled</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
