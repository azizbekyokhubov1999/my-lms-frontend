"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type TabKey = "profile" | "security" | "notifications";

interface SwitchProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-900"
        >
          {label}
        </label>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-900 focus-visible:ring-offset-2",
          checked ? "bg-blue-900" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition",
            checked ? "translate-x-5" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabKey>("profile");
  const [isSaving, setIsSaving] = React.useState(false);

  // Profile
  const [displayName, setDisplayName] = React.useState("Student Name");
  const [phoneNumber, setPhoneNumber] = React.useState("+1 (555) 000-0000");

  // Security
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [securityError, setSecurityError] = React.useState<string | null>(null);

  // Notifications
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [deadlineReminders, setDeadlineReminders] = React.useState(true);
  const [examResultNotifications, setExamResultNotifications] =
    React.useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    setSecurityError(null);

    if (activeTab === "security") {
      if (!currentPassword || !newPassword || !confirmPassword) {
        setSecurityError("All password fields are required.");
        setIsSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setSecurityError("New passwords do not match.");
        setIsSaving(false);
        return;
      }
      if (newPassword.length < 8) {
        setSecurityError("New password must be at least 8 characters.");
        setIsSaving(false);
        return;
      }
    }

    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (activeTab === "security") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSecurityError(null);
    }

    setIsSaving(false);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account preferences and security options.
        </p>
      </section>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav
          className="-mb-px flex gap-6"
          aria-label="Settings sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "border-b-2 py-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "border-blue-900 text-blue-900"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <Card>
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Profile information
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Update your display name, avatar, and contact details.
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xl font-bold text-slate-500">
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-800">
                  Avatar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full max-w-xs text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-900 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Phone number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Change password
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Update your password to keep your account secure.
              </p>
            </div>

            <div className="max-w-md space-y-4">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                helperText="Must be at least 8 characters."
              />
              <Input
                label="Confirm new password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                error={securityError ?? undefined}
              />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Notification preferences
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Choose which notifications you want to receive.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <Switch
                id="email-alerts"
                label="Email alerts"
                description="Receive course announcements and updates via email."
                checked={emailAlerts}
                onChange={setEmailAlerts}
              />
              <Switch
                id="deadline-reminders"
                label="Deadline reminders"
                description="Get reminded before assignment and exam deadlines."
                checked={deadlineReminders}
                onChange={setDeadlineReminders}
              />
              <Switch
                id="exam-results"
                label="Exam result notifications"
                description="Notify me when exam results are published."
                checked={examResultNotifications}
                onChange={setExamResultNotifications}
              />
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
          <Button
            type="button"
            variant="primary"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
