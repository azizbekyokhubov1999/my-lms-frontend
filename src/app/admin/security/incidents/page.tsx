"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type IncidentType = "suspicious_login" | "failed_passwords" | "ip_whitelist";

interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  detail: string;
  ip?: string;
  user?: string;
  count?: number;
  at: string;
  severity: "high" | "medium";
}

const MOCK_INCIDENTS: Incident[] = [
  { id: "1", type: "suspicious_login", title: "Suspicious Login Attempt", detail: "Login from new device/country", ip: "192.168.1.100", user: "alex.johnson@edu.edu", at: "2026-03-06 10:22", severity: "high" },
  { id: "2", type: "failed_passwords", title: "Multiple Failed Passwords", detail: "5 failed attempts in 2 minutes", user: "unknown@external.com", ip: "10.0.0.55", count: 5, at: "2026-03-06 09:45", severity: "high" },
  { id: "3", type: "ip_whitelist", title: "IP Whitelist Violation", detail: "Admin access from non-whitelisted IP", ip: "203.0.113.42", at: "2026-03-06 08:30", severity: "high" },
  { id: "4", type: "suspicious_login", title: "Suspicious Login Attempt", detail: "Unusual time/location", ip: "198.51.100.1", user: "jordan.lee@edu.edu", at: "2026-03-05 23:15", severity: "medium" },
  { id: "5", type: "failed_passwords", title: "Multiple Failed Passwords", detail: "3 failed attempts", user: "support@edu.edu", ip: "192.168.2.10", count: 3, at: "2026-03-05 14:00", severity: "medium" },
];

export default function SecurityIncidentsPage() {
  const [incidents, setIncidents] = React.useState<Incident[]>(MOCK_INCIDENTS);
  const [blockedIps, setBlockedIps] = React.useState<Set<string>>(new Set());

  const handleInvestigate = (incident: Incident) => {
    alert(`Investigate (demo): ${incident.title}\nUser: ${incident.user ?? "—"}\nIP: ${incident.ip ?? "—"}`);
  };

  const handleBlockIp = (ip: string) => {
    if (!confirm(`Block IP ${ip}? All requests from this IP will be denied.`)) return;
    setBlockedIps((prev) => new Set(prev).add(ip));
    setIncidents((prev) => prev.filter((i) => i.ip !== ip));
  };

  const byType = {
    suspicious_login: incidents.filter((i) => i.type === "suspicious_login"),
    failed_passwords: incidents.filter((i) => i.type === "failed_passwords"),
    ip_whitelist: incidents.filter((i) => i.type === "ip_whitelist"),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/security" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Security
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Security Incidents</h1>
          <p className="mt-1 text-sm text-slate-600">
            High-priority dashboard: suspicious logins, failed passwords, IP whitelist violations.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/security"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Authentication
          </Link>
          <Link
            href="/admin/security/incidents"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Incidents
          </Link>
          <Link
            href="/admin/security/encryption"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Encryption
          </Link>
          <Link
            href="/admin/security/audit-logs"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Audit Logs
          </Link>
          <Link
            href="/admin/security/access-control"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Access Control
          </Link>
        </nav>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Suspicious Login Attempts
          </h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">{byType.suspicious_login.length}</p>
          <p className="text-xs text-slate-500">New device or location</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Multiple Failed Passwords
          </h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">{byType.failed_passwords.length}</p>
          <p className="text-xs text-slate-500">Brute-force risk</p>
        </Card>
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            IP Whitelist Violations
          </h2>
          <p className="mt-1 text-2xl font-bold text-slate-900">{byType.ip_whitelist.length}</p>
          <p className="text-xs text-slate-500">Non-whitelisted access</p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent incidents
          </h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {incidents.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-slate-500">No open incidents.</li>
          ) : (
            incidents.map((incident) => (
              <li key={incident.id} className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        incident.severity === "high" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800",
                      )}
                    >
                      {incident.severity}
                    </span>
                    <span className="font-medium text-slate-900">{incident.title}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{incident.detail}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {incident.ip && <>IP: {incident.ip}</>}
                    {incident.user && <> · {incident.user}</>}
                    {incident.count != null && <> · {incident.count} attempts</>}
                    {" · "}
                    {incident.at}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleInvestigate(incident)}>
                    Investigate
                  </Button>
                  {incident.ip && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-700 border-red-200 hover:bg-red-50"
                      onClick={() => handleBlockIp(incident.ip!)}
                    >
                      Block IP
                    </Button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
