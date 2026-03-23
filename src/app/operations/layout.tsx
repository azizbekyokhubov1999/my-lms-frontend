"use client";

import {
  Activity,
  Cpu,
  ShieldAlert,
  ShieldCheck,
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

type NavGroup = {
  label: string;
  icon: IconKey;
  items: NavLeaf[];
};

const SYSTEM_HEALTH_GROUP: NavGroup = {
  label: "System Health",
  icon: "activity",
  items: [
    { label: "Server", href: "/operations/system-health/server", icon: "activity" },
    { label: "Database", href: "/operations/system-health/db", icon: "activity" },
    { label: "Network", href: "/operations/system-health/network", icon: "activity" },
    { label: "Uptime", href: "/operations/system-health/uptime", icon: "activity" },
    { label: "Latency", href: "/operations/system-health/latency", icon: "activity" },
  ],
};

const INTEGRATIONS_GROUP: NavGroup = {
  label: "Integrations",
  icon: "zap",
  items: [
    { label: "Teams", href: "/operations/integrations/teams", icon: "zap" },
    { label: "1C", href: "/operations/integrations/onec", icon: "zap" },
    { label: "aSc", href: "/operations/integrations/asc", icon: "zap" },
    { label: "Classmate", href: "/operations/integrations/classmate", icon: "zap" },
    {
      label: "Webhooks",
      href: "/operations/integrations/webhooks",
      icon: "zap",
    },
    {
      label: "Sync Jobs",
      href: "/operations/integrations/sync-jobs",
      icon: "zap",
    },
    {
      label: "Connections",
      href: "/operations/integrations/connections",
      icon: "zap",
    },
  ],
};

const INCIDENTS_GROUP: NavGroup = {
  label: "Incidents",
  icon: "shieldAlert",
  items: [
    {
      label: "Overview",
      href: "/operations/incidents/overview",
      icon: "shieldAlert",
    },
    {
      label: "Critical Logs",
      href: "/operations/incidents/critical-logs",
      icon: "shieldAlert",
    },
    { label: "Alerts", href: "/operations/incidents/alerts", icon: "shieldAlert" },
    { label: "Create", href: "/operations/incidents/create", icon: "shieldAlert" },
    { label: "History", href: "/operations/incidents/history", icon: "shieldAlert" },
  ],
};

const PRE_GROUP_LEAVES: NavLeaf[] = [
  { label: "Dashboard", href: "/operations/dashboard", icon: "cpu" },
];

const POST_GROUP_LEAVES: NavLeaf[] = [
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

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const closeMobile = React.useCallback(() => setMobileOpen(false), []);

  const SystemHealthIcon = ICONS[SYSTEM_HEALTH_GROUP.icon];
  const IntegrationsIcon = ICONS[INTEGRATIONS_GROUP.icon];
  const IncidentsIcon = ICONS[INCIDENTS_GROUP.icon];

  return (
    <div className="operations-clean-light min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-indigo-400/40 bg-slate-950/95 px-3 sm:px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-indigo-400/50 bg-indigo-400/10 px-3 py-2 text-slate-100 hover:bg-indigo-400/20 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="text-sm font-semibold">{mobileOpen ? "Close" : "Menu"}</span>
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold uppercase tracking-wide text-slate-100">
              IT Operations Command Center
            </h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 md:hidden"
            aria-hidden
            onClick={closeMobile}
          />
        )}

        <aside
          className={cn(
            "z-50 hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex",
            mobileOpen ? "fixed left-0 top-14 h-[calc(100vh-3.5rem)]" : "hidden",
          )}
        >
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {PRE_GROUP_LEAVES.map((leaf) => {
                const Icon = ICONS[leaf.icon];
                const active = isActive(leaf.href);

                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                        : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-indigo-400" : "text-slate-100/70",
                      )}
                    />
                    <span>{leaf.label}</span>
                  </Link>
                );
              })}

              <div className="pt-3">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-md border border-indigo-400/30 bg-indigo-400/10">
                    <SystemHealthIcon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-100/70">
                    {SYSTEM_HEALTH_GROUP.label}
                  </div>
                </div>

                <div className="space-y-1 pl-4">
                  {SYSTEM_HEALTH_GROUP.items.map((item) => {
                    const Icon = ICONS[item.icon];
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                            : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-indigo-400" : "text-slate-100/70",
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-md border border-indigo-400/30 bg-indigo-400/10">
                    <IntegrationsIcon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-100/70">
                    {INTEGRATIONS_GROUP.label}
                  </div>
                </div>

                <div className="space-y-1 pl-4">
                  {INTEGRATIONS_GROUP.items.map((item) => {
                    const Icon = ICONS[item.icon];
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                            : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-indigo-400" : "text-slate-100/70",
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3">
                <div className="flex items-center gap-2 px-1 pb-2">
                  <div className="h-8 w-8 flex items-center justify-center rounded-md border border-indigo-400/30 bg-indigo-400/10">
                    <IncidentsIcon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-100/70">
                    {INCIDENTS_GROUP.label}
                  </div>
                </div>

                <div className="space-y-1 pl-4">
                  {INCIDENTS_GROUP.items.map((item) => {
                    const Icon = ICONS[item.icon];
                    const active = isActive(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                            : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-indigo-400" : "text-slate-100/70",
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 space-y-2">
                {POST_GROUP_LEAVES.map((leaf) => {
                  const Icon = ICONS[leaf.icon];
                  const active = isActive(leaf.href);

                  return (
                    <Link
                      key={leaf.href}
                      href={leaf.href}
                      onClick={closeMobile}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                          : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          active ? "text-indigo-400" : "text-slate-100/70",
                        )}
                      />
                      <span>{leaf.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          <div className="border-t border-indigo-400/40 p-4">
            <div className="space-y-2">
              {BOTTOM_LEAVES.map((leaf) => {
                const Icon = ICONS[leaf.icon];
                const active = isActive(leaf.href);

                return (
                  <Link
                    key={leaf.href}
                    href={leaf.href}
                    onClick={closeMobile}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-indigo-400/60 bg-indigo-400/10 text-slate-100"
                        : "border-indigo-400/20 bg-slate-950/30 text-slate-100/70 hover:bg-indigo-400/10 hover:border-indigo-400/50 hover:text-slate-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        active ? "text-indigo-400" : "text-slate-100/70",
                      )}
                    />
                    <span>{leaf.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-slate-50">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

