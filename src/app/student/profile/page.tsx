"use client";

import * as React from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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
        <label htmlFor={id} className="text-sm font-medium text-slate-900">
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2",
          checked ? "bg-sky-600" : "bg-slate-200",
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

const MOCK_PROFILE = {
  // Read-only from university DB
  name: "Alex Johnson",
  birthdate: "2002-05-14",
  nationalId: "AB 1234567",
  faculty: "School of Computer Science",
  studentId: "STU-2024-8842",
  groupNumber: "CS-2024-A",
  currentYear: 2,
  advisor: "Dr. Maria Chen",
  // Editable
  phone: "+1 (555) 123-4567",
  personalEmail: "alex.johnson@email.com",
  address: "123 Campus Ave, Apt 4B\nUniversity City, UC 12345",
};

export default function StudentProfilePage() {
  const [phone, setPhone] = React.useState(MOCK_PROFILE.phone);
  const [personalEmail, setPersonalEmail] = React.useState(MOCK_PROFILE.personalEmail);
  const [address, setAddress] = React.useState(MOCK_PROFILE.address);
  const [profileSaved, setProfileSaved] = React.useState(false);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = React.useState(false);

  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Student profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Your official ID, personal info, academic status, and account settings.
        </p>
      </section>

      {/* 1. Official ID Card — matches University branding (Unified Online University) */}
      <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="rounded-xl border-2 border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-slate-50/50 p-6 shadow-inner">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-stretch">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm">
                <span className="text-sm font-medium text-slate-400">Photo</span>
              </div>
              <div className="mt-4 flex flex-col sm:mt-0">
                <p className="text-xl font-bold tracking-tight text-slate-900">{MOCK_PROFILE.name}</p>
                <p className="mt-1 text-sm font-medium text-slate-600">{MOCK_PROFILE.faculty}</p>
                <p className="mt-2 font-mono text-base font-semibold tracking-wide text-slate-800">
                  {MOCK_PROFILE.studentId}
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-end justify-end border-t border-slate-200/60 pt-4 sm:border-t-0 sm:border-l sm:border-slate-200/60 sm:justify-end sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                  UO
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Unified Online University
                  </p>
                  <p className="text-[10px] text-slate-400">Student Portal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. Personal info — only Phone, Personal Email, Current Address are editable */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Personal info</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          You can edit phone, personal email, and address. Other fields are from the university database.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Full name" value={MOCK_PROFILE.name} disabled className="bg-slate-50" />
          <Input
            label="Birthdate"
            value={new Date(MOCK_PROFILE.birthdate + "Z").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            disabled
            className="bg-slate-50"
          />
          <Input label="National ID" value={MOCK_PROFILE.nationalId} disabled className="bg-slate-50" />
          <Input label="Phone number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input
            label="Personal email"
            type="email"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            className="sm:col-span-2"
          />
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-800">Current address</label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button type="button" variant="primary" onClick={handleSaveProfile}>
            Save changes
          </Button>
          {profileSaved && (
            <span className="text-sm text-emerald-600">Saved.</span>
          )}
        </div>
      </Card>

      {/* 3. Academic info — read-only from university database */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Academic info</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Faculty, group, and student ID from the university database (read-only)
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Faculty</dt>
            <dd className="mt-1 font-semibold text-slate-900">{MOCK_PROFILE.faculty}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Group number</dt>
            <dd className="mt-1 font-semibold text-slate-900">{MOCK_PROFILE.groupNumber}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Student ID</dt>
            <dd className="mt-1 font-mono font-semibold text-slate-900">{MOCK_PROFILE.studentId}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Current year</dt>
            <dd className="mt-1 font-semibold text-slate-900">Year {MOCK_PROFILE.currentYear}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Advisor / Curator</dt>
            <dd className="mt-1 font-semibold text-slate-900">{MOCK_PROFILE.advisor}</dd>
          </div>
        </dl>
      </Card>

      {/* 4. Account settings */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-900">Account settings</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Password change and notification preferences
        </p>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-medium text-slate-800">Change password</h3>
          <form onSubmit={handlePasswordChange} className="mt-3 max-w-md space-y-3">
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
              helperText="At least 8 characters."
            />
            <Input
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              error={passwordError ?? undefined}
            />
            <div className="flex items-center gap-2">
              <Button type="submit" variant="primary">
                Update password
              </Button>
              {passwordSuccess && (
                <span className="text-sm text-emerald-600">Password updated.</span>
              )}
            </div>
          </form>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h3 className="text-sm font-medium text-slate-800">Notification preferences</h3>
          <div className="mt-3 divide-y divide-slate-100">
            <Switch
              id="notif-email"
              label="Email notifications"
              description="Course updates, deadlines, and grade alerts via email."
              checked={emailNotifications}
              onChange={setEmailNotifications}
            />
            <Switch
              id="notif-push"
              label="Push notifications"
              description="Browser or app push for urgent reminders."
              checked={pushNotifications}
              onChange={setPushNotifications}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
