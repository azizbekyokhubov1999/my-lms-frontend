"use client";

import * as React from "react";

import { Card } from "../../components/ui/Card";

type AlertChannel = "slack" | "email";

type ThemeChoice = "deep-dark" | "midnight";

type SettingsState = {
  alertChannels: Record<AlertChannel, boolean>;
  slackWebhook: string;
  emailAddress: string;
  language: "en" | "ru" | "es";
  theme: ThemeChoice;
};

const STORAGE_KEY = "ops_settings_v1";

function formatThemeName(t: ThemeChoice) {
  if (t === "deep-dark") return "Deep Dark (Slate-950)";
  return "Midnight Indigo";
}

export default function OperationsSettingsPage() {
  const [settings, setSettings] = React.useState<SettingsState>(() => ({
    alertChannels: { slack: true, email: false },
    slackWebhook: "",
    emailAddress: "ops.admin@university.edu",
    language: "en",
    theme: "deep-dark",
  }));

  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as SettingsState;
      setSettings(parsed);
    } catch {
      // ignore
    }
  }, []);

  const save = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    setSavedAt(new Date().toISOString());
    window.setTimeout(() => setSavedAt(null), 2200);
  }, [settings]);

  const toggleChannel = React.useCallback((ch: AlertChannel, next: boolean) => {
    setSettings((prev) => ({
      ...prev,
      alertChannels: { ...prev.alertChannels, [ch]: next },
    }));
  }, []);

  const applyThemePreview = React.useCallback((theme: ThemeChoice) => {
    // This is a demo preview. The layout still uses slate-950 chrome.
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-100/70">
          System-wide preferences: alert notifications, language, and theme customization.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Alert Notifications
          </h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Configure where operational alerts should be delivered.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
              <span className="text-sm font-semibold text-slate-100">Slack</span>
              <input
                type="checkbox"
                checked={settings.alertChannels.slack}
                onChange={(e) => toggleChannel("slack", e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-indigo-400/20 bg-indigo-400/5 px-4 py-3">
              <span className="text-sm font-semibold text-slate-100">Email</span>
              <input
                type="checkbox"
                checked={settings.alertChannels.email}
                onChange={(e) => toggleChannel("email", e.target.checked)}
              />
            </label>
          </div>

          {settings.alertChannels.slack ? (
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Slack Webhook
              </label>
              <input
                value={settings.slackWebhook}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, slackWebhook: e.target.value }))
                }
                placeholder="https://hooks.slack.com/services/..."
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              />
            </div>
          ) : null}

          {settings.alertChannels.email ? (
            <div className="mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-100/70">
                Email Address
              </label>
              <input
                value={settings.emailAddress}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    emailAddress: e.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
              />
            </div>
          ) : null}
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950">
          <h2 className="text-sm font-semibold text-slate-100">Language</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            UI language preference (demo).
          </p>

          <div className="mt-4">
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  language: e.target.value as SettingsState["language"],
                }))
              }
              className="w-full rounded-lg border border-indigo-400/30 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400/60"
            >
              <option value="en">English</option>
              <option value="ru">Russian</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </Card>

        <Card className="border-indigo-400/30 bg-slate-950 lg:col-span-3">
          <h2 className="text-sm font-semibold text-slate-100">Theme</h2>
          <p className="mt-1 text-xs text-slate-100/60">
            Choose a theme preset (demo preview).
          </p>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(["deep-dark", "midnight"] as ThemeChoice[]).map((t) => {
              const selected = settings.theme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyThemePreview(t)}
                  className={`rounded-xl border px-4 py-4 text-left transition-colors ${
                    selected
                      ? "border-indigo-400/60 bg-indigo-400/10"
                      : "border-indigo-400/20 bg-slate-950/30 hover:border-indigo-400/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-100">
                    {formatThemeName(t)}
                  </p>
                  <p className="mt-1 text-xs text-slate-100/60">
                    Primary styling uses indigo-400. Text stays slate-100.
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {savedAt ? (
                <p className="text-sm text-slate-100/70">
                  Saved at {new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              ) : (
                <p className="text-sm text-slate-100/60">Changes are not persisted until Save.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    alertChannels: { slack: true, email: false },
                    slackWebhook: "",
                    emailAddress: "ops.admin@university.edu",
                    language: "en",
                    theme: "deep-dark",
                  })
                }
                className="rounded-xl border border-indigo-400/30 bg-slate-950/30 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/10"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={save}
                className="rounded-xl border border-indigo-400/60 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-slate-100 transition-colors hover:bg-indigo-400/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


