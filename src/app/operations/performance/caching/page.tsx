"use client";

import * as React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

export default function CachingPage() {
  const [redisHitRate, setRedisHitRate] = React.useState(92);
  const [cdnHitRate, setCdnHitRate] = React.useState(88);

  const clearRedis = () => setRedisHitRate(62);
  const purgeCdn = () => setCdnHitRate(59);

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Caching Management</h1>
        </div>
        <Layers className="h-6 w-6 text-indigo-400" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Cache Hit Rate (Redis)</p>
          <p className={`mt-2 text-3xl font-bold ${redisHitRate < 80 ? "text-rose-500" : "text-emerald-500"}`}>{redisHitRate}%</p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${redisHitRate}%` }} />
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Cache Hit Rate (CDN)</p>
          <p className={`mt-2 text-3xl font-bold ${cdnHitRate < 80 ? "text-rose-500" : "text-emerald-500"}`}>{cdnHitRate}%</p>
          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-indigo-400" style={{ width: `${cdnHitRate}%` }} />
          </div>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={clearRedis} className="rounded-md border border-indigo-400 bg-indigo-400 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
            Clear Redis Cache
          </button>
          <button type="button" onClick={purgeCdn} className="rounded-md border border-indigo-400 px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
            Purge CDN
          </button>
        </div>
      </Card>
    </div>
  );
}
