"use client";

import * as React from "react";
import Link from "next/link";

import { Card } from "@/app/components/ui/Card";

type SessionRow = {
  id: string;
  sessionId: string;
  ip: string;
  lastActivity: string;
};

const INITIAL_SESSIONS: SessionRow[] = [
  { id: "s1", sessionId: "SESS-8A11", ip: "10.10.1.44", lastActivity: "2 min ago" },
  { id: "s2", sessionId: "SESS-4F9C", ip: "172.16.4.19", lastActivity: "5 min ago" },
  { id: "s3", sessionId: "SESS-7B02", ip: "203.0.113.10", lastActivity: "11 min ago" },
];

export default function TokenManagementPage() {
  const [sessions, setSessions] = React.useState(INITIAL_SESSIONS);
  const terminate = (id: string) => setSessions((prev) => prev.filter((s) => s.id !== id));

  return (
    <div className="space-y-4 bg-slate-50 text-slate-900">
      <Link href="/operations/access" className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500">
        Back to Access Hub
      </Link>
      <Card className="border-slate-200 bg-white shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Token Management</h1>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Last Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-t border-slate-200 text-slate-700">
                  <td className="px-4 py-3 font-mono text-slate-900">{session.sessionId}</td>
                  <td className="px-4 py-3">{session.ip}</td>
                  <td className="px-4 py-3">{session.lastActivity}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => terminate(session.id)} className="rounded-md border border-indigo-400 bg-indigo-400 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500">Terminate Session</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
