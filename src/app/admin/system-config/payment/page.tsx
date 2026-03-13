"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const GATEWAYS = [
  { id: "stripe", name: "Stripe", description: "Cards and global payments" },
  { id: "payme", name: "Payme", description: "Regional payment provider" },
  { id: "click", name: "Click", description: "Local payment method" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "UZS", "CAD", "AUD"];

export default function PaymentSettingsPage() {
  const [activeGateway, setActiveGateway] = React.useState<string>("stripe");
  const [currency, setCurrency] = React.useState("USD");
  const [taxEnabled, setTaxEnabled] = React.useState(true);
  const [taxRate, setTaxRate] = React.useState("10");
  const [taxLabel, setTaxLabel] = React.useState("VAT");
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/system-config" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← System Config
          </Link>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Payment Settings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose a payment gateway and set global currency and tax rules.
          </p>
        </div>
        <nav className="flex gap-2">
          <Link
            href="/admin/system-config"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            General
          </Link>
          <Link
            href="/admin/system-config/email-templates"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Email Templates
          </Link>
          <Link
            href="/admin/system-config/payment"
            className="inline-flex h-9 items-center rounded-md bg-slate-100 px-3 text-sm font-medium text-slate-900"
          >
            Payment
          </Link>
          <Link
            href="/admin/system-config/integrations"
            className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Integrations
          </Link>
        </nav>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Payment Gateway
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select the primary gateway for processing payments.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            {GATEWAYS.map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setActiveGateway(gw.id)}
                className={cn(
                  "flex w-full flex-col rounded-xl border-2 p-4 text-left transition-colors sm:w-48",
                  activeGateway === gw.id
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <span className="font-semibold text-slate-900">{gw.name}</span>
                <span className="mt-0.5 text-xs text-slate-600">{gw.description}</span>
                {activeGateway === gw.id && (
                  <span className="mt-2 text-xs font-medium text-blue-700">Active</span>
                )}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Global Currency
          </h2>
          <div className="mt-4 max-w-xs">
            <label htmlFor="currency" className="block text-sm font-medium text-slate-800">
              Currency
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Tax Rules
          </h2>
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={taxEnabled}
                onChange={(e) => setTaxEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-sm font-medium text-slate-800">Enable tax on payments</span>
            </label>
            {taxEnabled && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Tax label"
                  type="text"
                  value={taxLabel}
                  onChange={(e) => setTaxLabel(e.target.value)}
                  placeholder="e.g. VAT, GST"
                />
                <Input
                  label="Tax rate (%)"
                  type="text"
                  inputMode="decimal"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="10"
                />
              </div>
            )}
          </div>
        </Card>

        <div>
          <Button type="submit" variant="primary">
            {saved ? "Saved" : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
