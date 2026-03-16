"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "../components/ui/Button";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS: Array<{ href: string; label: string; description: string }> = [
  { href: "/resources/dashboard", label: "Dashboard", description: "Overview" },
  { href: "/resources/teachers", label: "Teachers", description: "Profiles, Verification, Import" },
  { href: "/resources/assignments", label: "Assignments", description: "Course/Group, Co-teaching" },
  { href: "/resources/workload", label: "Workload", description: "Hours, Overload alerts" },
  { href: "/resources/performance", label: "Performance", description: "Metrics, Feedback, SLA" },
  { href: "/resources/replacements", label: "Replacements", description: "Transition workflow, Content transfer" },
  { href: "/resources/access", label: "Access", description: "Permissions, Revoke/Grant" },
  { href: "/resources/reports", label: "Reports", description: "Utilization, Planning" },
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

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const showCollapsed = collapsed && !mobileOpen;

  const sidebarContent = (
    <>
      <nav
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3 sm:p-4"
        aria-label="Resources navigation"
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "group flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-teal-500 text-teal-950"
                : "text-teal-50 hover:bg-teal-600 hover:text-white",
              showCollapsed && "justify-center px-2",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md bg-teal-800 text-xs font-semibold text-teal-50",
                isActive(item.href) && "bg-teal-50 text-teal-800",
              )}
            >
              {item.label[0]}
            </span>
            {!showCollapsed && (
              <span className="flex flex-col">
                <span>{item.label}</span>
                <span className="text-[11px] font-normal text-teal-100 group-hover:text-teal-50">
                  {item.description}
                </span>
              </span>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto border-t border-teal-800 p-3 sm:p-4">
        <button
          type="button"
          className={cn(
            "flex w-full min-h-[40px] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-teal-100 transition-colors hover:bg-teal-600 hover:text-white",
            showCollapsed && "justify-center px-2",
          )}
          onClick={() => alert("Log out (Demo)")}
        >
          <span className="shrink-0">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v3.75M15.75 9l-3-3m0 0l-3 3m3-3h8.25M8.25 21H5.625A2.25 2.25 0 013.375 18.75V5.625A2.25 2.25 0 015.625 3.375H8.25M15.75 21H18.375A2.25 2.25 0 0020.625 18.75V15.75m-6-6l3-3m0 0l3 3m-3-3v12" />
            </svg>
          </span>
          {!showCollapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-teal-800 bg-teal-700 px-3 shadow-sm sm:gap-4 sm:px-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <MenuIcon />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="hidden shrink-0 lg:inline-flex"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon left={!collapsed} />
        </Button>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-teal-600 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-teal-50">
              Resources
            </span>
            <span className="hidden text-sm text-teal-100 sm:inline">
              Teacher resources · workload · access
            </span>
          </div>
          <span className="text-xs font-medium text-teal-100">
            Department workspace
          </span>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "flex min-h-screen flex-col shrink-0 border-r border-teal-800 bg-teal-700 transition-[width] duration-200 ease-out",
            "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 md:w-72 lg:relative lg:top-0 lg:h-full lg:min-h-screen lg:max-h-full",
            collapsed ? "lg:w-20" : "lg:w-64",
            mobileOpen ? "flex" : "hidden lg:flex",
          )}
        >
          {sidebarContent}
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

