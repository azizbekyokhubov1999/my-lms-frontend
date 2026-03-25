"use client";

import {
  Activity,
  ArrowLeft,
  ChevronLeft,
  Cpu,
  Menu,
  ShieldAlert,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import "./operations-clean-light.css";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type IconKey = "activity" | "cpu" | "zap" | "shieldAlert" | "shieldCheck";

const ICONS: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  activity: Activity,
  cpu: Cpu,
  zap: Zap,
  shieldAlert: ShieldAlert,
  shieldCheck: ShieldCheck,
};

type NavLeaf = {
  label: string;
  href: string;
  icon: IconKey;
};

const PRE_GROUP_LEAVES: NavLeaf[] = [
  { label: "Dashboard", href: "/operations/dashboard", icon: "cpu" },
];

const POST_GROUP_LEAVES: NavLeaf[] = [
  { label: "System Health", href: "/operations/system-health", icon: "activity" },
  { label: "Integrations", href: "/operations/integrations", icon: "zap" },
  { label: "Incidents", href: "/operations/incidents", icon: "shieldAlert" },
  { label: "Security", href: "/operations/security", icon: "shieldCheck" },
  { label: "Backup", href: "/operations/backup", icon: "activity" },
  { label: "Performance", href: "/operations/performance", icon: "cpu" },
  { label: "Access", href: "/operations/access", icon: "shieldCheck" },
  { label: "Compliance", href: "/operations/compliance", icon: "shieldCheck" },
  { label: "Maintenance", href: "/operations/maintenance", icon: "activity" },
  { label: "Capacity", href: "/operations/capacity", icon: "cpu" },
  { label: "Reports", href: "/operations/reports", icon: "zap" },
];

const BOTTOM_LEAVES: NavLeaf[] = [
  { label: "Profile", href: "/operations/profile", icon: "shieldCheck" },
  { label: "Settings", href: "/operations/settings", icon: "cpu" },
];

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  const toggleCollapse = React.useCallback(() => {
    setIsCollapsed((c) => !c);
  }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const renderLeaf = (leaf: NavLeaf) => {
    const Icon = ICONS[leaf.icon];
    const active = isActive(leaf.href);

    return (
      <Link
        key={leaf.href}
        href={leaf.href}
        title={leaf.label}
        onClick={closeMobile}
        aria-current={active ? "page" : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-300",
          isCollapsed && "lg:justify-center lg:gap-0 lg:px-2",
          active
            ? "border-indigo-400 bg-indigo-50 text-slate-900"
            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-400/60 hover:bg-indigo-50/80 hover:text-slate-900",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors duration-300",
            active ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400",
          )}
        />
        <span
          className={cn(
            "min-w-0 flex-1 truncate transition-all duration-300",
            isCollapsed && "lg:hidden",
          )}
        >
          {leaf.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="operations-clean-light min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-60 flex h-14 items-center justify-between gap-3 border-b border-indigo-400/40 bg-slate-950/95 px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border-2 border-indigo-400 bg-indigo-400/10 p-2 text-indigo-400 transition-colors hover:bg-indigo-400/20 lg:hidden"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-100">
              IT Operations Command Center
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {mobileOpen ? (
          <div
            className="fixed inset-0 top-14 z-40 bg-slate-950/60 backdrop-blur-[1px] transition-opacity duration-300 lg:hidden"
            aria-hidden
            onClick={closeMobile}
          />
        ) : null}

        <aside
          className={cn(
            "relative z-50 flex shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out",
            "fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-72 -translate-x-full",
            mobileOpen && "translate-x-0",
            "lg:static lg:z-auto lg:translate-x-0 lg:pt-0",
            isCollapsed ? "lg:w-16" : "lg:w-72",
          )}
        >
          <Link
            href="/"
            onClick={closeMobile}
            className={cn(
              "mb-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-400",
              isCollapsed && "lg:justify-center lg:px-2",
            )}
            title={isCollapsed ? "Back to Hub" : undefined}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className={cn("min-w-0 truncate transition-all", isCollapsed && "lg:hidden")}>
              Back to Hub
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "absolute z-70 hidden h-9 w-9 items-center justify-center rounded-full border-2 border-indigo-400 bg-white text-indigo-400 shadow-md transition-all duration-300 ease-in-out hover:bg-indigo-50 lg:flex",
              "top-8 -right-[18px]",
              isCollapsed && "rotate-180",
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <nav className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden p-3 pt-4">
            <div className="space-y-2">
              {PRE_GROUP_LEAVES.map(renderLeaf)}

              <div className="space-y-2 pt-3">
                {POST_GROUP_LEAVES.map(renderLeaf)}
              </div>
            </div>
          </nav>

          <div className="border-t border-slate-200 p-3">
            <div className="space-y-2">{BOTTOM_LEAVES.map(renderLeaf)}</div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-slate-50">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
