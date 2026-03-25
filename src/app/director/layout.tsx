"use client";

import {
  AlertTriangle,
  Award,
  BarChart2,
  ArrowLeft,
  Briefcase,
  CalendarCheck,
  CircleDollarSign,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Map,
  Settings,
  Target,
  TrendingUp,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "../components/ui/Button";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/director/dashboard": LayoutDashboard,
  "/director/kpi": Target,
  "/director/academic": GraduationCap,
  "/director/attendance": CalendarCheck,
  "/director/progression": TrendingUp,
  "/director/financial": CircleDollarSign,
  "/director/resources": Briefcase,
  "/director/quality": Award,
  "/director/comparative": BarChart2,
  "/director/strategic": Map,
  "/director/incidents": AlertTriangle,
  "/director/reports": FileBarChart,
  "/director/profile": UserCircle,
  "/director/settings": Settings,
};

const SIDEBAR_GROUPS: Array<{
  label: string;
  items: Array<{ href: string; label: string }>;
}> = [
  { label: "Core", items: [{ href: "/director/dashboard", label: "Dashboard" }, { href: "/director/kpi", label: "KPI Center" }] },
  { label: "Performance", items: [{ href: "/director/academic", label: "Academic" }, { href: "/director/attendance", label: "Attendance" }, { href: "/director/progression", label: "Progression" }] },
  { label: "Operations", items: [{ href: "/director/financial", label: "Financial" }, { href: "/director/resources", label: "Resources" }, { href: "/director/quality", label: "Quality" }] },
  { label: "Strategy", items: [{ href: "/director/comparative", label: "Comparative" }, { href: "/director/strategic", label: "Strategic Planning" }, { href: "/director/incidents", label: "Incidents" }] },
  { label: "Output", items: [{ href: "/director/reports", label: "Reports" }, { href: "/director/profile", label: "Profile" }, { href: "/director/settings", label: "Settings" }] },
];

function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function ChevronIcon({ left }: { left?: boolean }) {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={left ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

export default function DirectorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const showCollapsed = collapsed && !mobileOpen;

  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col">
      <Link
        href="/"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "mx-3 mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-400",
          showCollapsed && "justify-center px-2",
        )}
        title={showCollapsed ? "Back to Hub" : undefined}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        <span className={cn("min-w-0 truncate transition-all", showCollapsed && "lg:hidden")}>
          Back to Hub
        </span>
      </Link>

      <div
        className="flex-1 overflow-y-auto pb-10 p-3 sm:p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-500/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:hover:bg-slate-400/70"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgb(148 163 184 / 0.5) transparent" }}
      >
        <nav aria-label="Director navigation" className="flex flex-col gap-4">
          {SIDEBAR_GROUPS.map((group) => (
            <div key={group.label}>
              {!showCollapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-slate-600 text-white"
                        : "text-slate-50 hover:bg-slate-400/20 hover:text-white",
                      showCollapsed && "justify-center px-2",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                        isActive(item.href) ? "bg-slate-50 text-slate-700" : "bg-slate-700 text-slate-50",
                      )}
                    >
                      {React.createElement(ICONS[item.href] ?? LayoutDashboard, { className: "h-4 w-4" })}
                    </span>
                    {!showCollapsed && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-slate-600">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-600 bg-slate-750 px-3 sm:gap-4 sm:px-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 border-0 bg-slate-600 text-slate-200 hover:bg-slate-500 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden shrink-0 border-0 bg-slate-700 text-slate-200 hover:bg-slate-600 lg:inline-flex"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon left={!collapsed} />
        </Button>
        <div className="flex min-w-0 flex-1 items-center">
          <span className="rounded-md bg-slate-700 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
            Deputy Director
          </span>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-600/50 lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "flex flex-col shrink-0 border-r border-slate-500 bg-slate-600 transition-[width] duration-200 ease-out",
            "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 md:w-72 lg:sticky lg:top-0 lg:h-full lg:min-h-0",
            collapsed ? "lg:w-20" : "lg:w-64",
            mobileOpen ? "flex" : "hidden lg:flex",
          )}
        >
          {sidebarContent}
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-100 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
