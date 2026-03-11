"use client";

import * as React from "react";
import { useAuthContext } from "@/context/AuthContext";

const ROLES = [
  { role: "STUDENT" as const, label: "Login as Student" },
  { role: "TEACHER" as const, label: "Login as Teacher" },
  { role: "AQAD" as const, label: "Login as AQAD" },
] as const;

export function RoleSwitcher() {
  const isDev = process.env.NODE_ENV === "development";
  const { devSwitchRole } = useAuthContext();

  if (!isDev || !devSwitchRole) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
      aria-label="Dev Role Switcher"
    >
      <span className="px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
        Dev Role
      </span>
      {ROLES.map(({ role, label }) => (
        <button
          key={role}
          type="button"
          onClick={() => devSwitchRole(role)}
          className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
