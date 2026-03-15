"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Button } from "../components/ui/Button";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const NAV_ITEMS: Array<{ href: string; label: string; tooltip: string; icon: React.ReactNode }> = [
  { href: "/finance/dashboard", label: "Dashboard", tooltip: "Overview", icon: <DashboardIcon /> },
  { href: "/finance/contracts", label: "Contracts", tooltip: "Management & Imports", icon: <ContractsIcon /> },
  { href: "/finance/payments", label: "Payments", tooltip: "Tracking & Recording", icon: <PaymentsIcon /> },
  { href: "/finance/reconciliation", label: "Reconciliation", tooltip: "1C Sync", icon: <ReconciliationIcon /> },
  { href: "/finance/debts", label: "Debt Management", tooltip: "Monitoring & Collection", icon: <DebtsIcon /> },
  { href: "/finance/blocking", label: "Blocking System", tooltip: "Access Control", icon: <BlockingIcon /> },
  { href: "/finance/reports", label: "Reports & Analytics", tooltip: "Financial Insights", icon: <ReportsIcon /> },
  { href: "/finance/audit", label: "Audit & Logs", tooltip: "Transaction History", icon: <AuditIcon /> },
  { href: "/finance/settings", label: "Settings", tooltip: "Language, notifications, security", icon: <SettingsIcon /> },
];

function DashboardIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
function ContractsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
function PaymentsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}
function ReconciliationIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}
function DebtsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}
function BlockingIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}
function ReportsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}
function AuditIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
function SearchIcon() {
  return (
    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

const STORAGE_KEY = "finance-sidebar-collapsed";
const MOCK_STUDENT_IDS = ["STU-10001", "STU-10002", "STU-10003", "STU-10004", "STU-10005", "STU-10042", "STU-10088", "STU-10105"];

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [studentSearch, setStudentSearch] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCollapsed(readCollapsed());
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const showCollapsed = collapsed && !mobileOpen;

  const searchResults = React.useMemo(() => {
    if (!studentSearch.trim()) return [];
    const q = studentSearch.trim().toLowerCase();
    return MOCK_STUDENT_IDS.filter((id) => id.toLowerCase().includes(q)).slice(0, 6);
  }, [studentSearch]);

  const handleSearchSelect = (id: string) => {
    setStudentSearch(id);
    setSearchOpen(false);
  };

  const sidebarContent = (
    <>
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-3 sm:p-4 overscroll-contain touch-pan-y" aria-label="Finance navigation">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={showCollapsed ? item.tooltip : undefined}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors touch-manipulation",
              isActive(item.href)
                ? "bg-emerald-400 text-emerald-900"
                : "text-emerald-100 hover:bg-emerald-800 hover:text-white",
              showCollapsed && "justify-center px-2",
            )}
          >
            <span className={cn("shrink-0", isActive(item.href) ? "text-emerald-900" : "text-emerald-200")}>{item.icon}</span>
            {!showCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto shrink-0 border-t border-emerald-800 p-3 sm:p-4">
        <Link
          href="/finance/profile"
          className={cn(
            "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-800 hover:text-white touch-manipulation",
            showCollapsed && "justify-center px-2",
          )}
          title={showCollapsed ? "Profile / Settings" : undefined}
        >
          <span className="shrink-0 text-emerald-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.116 17.116 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </span>
          {!showCollapsed && <span>Profile</span>}
        </Link>
        <button
          type="button"
          className={cn(
            "mt-1 flex w-full min-h-[44px] items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-800 hover:text-white touch-manipulation",
            showCollapsed && "justify-center px-2",
          )}
          title={showCollapsed ? "Log out" : undefined}
          onClick={() => alert("Log out (Demo)")}
        >
          <span className="shrink-0 text-emerald-200">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75M15.75 9l-3-3m0 0l-3 3m3-3h8.25M8.25 21H5.625a2.25 2.25 0 01-2.25-2.25V5.625a2.25 2.25 0 012.25-2.25h2.625M15.75 21h2.625a2.25 2.25 0 002.25-2.25V15.75m-6-6l3-3m0 0l3 3m-3-3v12" />
            </svg>
          </span>
          {!showCollapsed && <span>Log out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-emerald-50/30 px-3 shadow-sm print:hidden sm:gap-4 sm:px-4">
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

        <div ref={searchRef} className="relative flex-1 max-w-sm min-w-0">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Quick Search: Student ID..."
            value={studentSearch}
            onChange={(e) => {
              setStudentSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-300 focus:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            aria-label="Quick search by student ID"
            aria-expanded={searchOpen && searchResults.length > 0}
            aria-haspopup="listbox"
          />
          {searchOpen && searchResults.length > 0 && (
            <ul
              role="listbox"
              className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            >
              {searchResults.map((id) => (
                <li key={id} role="option">
                  <button
                    type="button"
                    onClick={() => handleSearchSelect(id)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="font-mono">{id}</span>
                    <span className="text-xs text-slate-500">Student</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searchOpen && studentSearch.trim() && searchResults.length === 0 && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-lg">
              No students found for &quot;{studentSearch}&quot;
            </div>
          )}
        </div>

        <span className="hidden shrink-0 text-sm font-medium text-slate-600 sm:inline">Finance</span>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 lg:hidden"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "flex flex-col shrink-0 border-r border-emerald-800 bg-emerald-900 transition-[width] duration-200 ease-out print:hidden",
            "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 md:w-72 lg:relative lg:top-0 lg:h-full lg:max-h-full",
            collapsed ? "lg:w-16" : "lg:w-56",
            mobileOpen ? "flex" : "hidden lg:flex",
          )}
        >
          {sidebarContent}
        </aside>

        <main data-finance-panel className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-emerald-50/30 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
