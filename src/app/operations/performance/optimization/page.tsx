"use client";

import * as React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";

import { Card } from "@/app/components/ui/Card";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

const initialTasks: Task[] = [
  { id: "o1", title: "Lazy Loading", done: true },
  { id: "o2", title: "Image Optimization", done: false },
  { id: "o3", title: "Asset Minification", done: true },
];

export default function OptimizationPage() {
  const [tasks, setTasks] = React.useState(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="space-y-5 bg-slate-50 text-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/operations/performance" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Back to Performance Hub
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">System Optimization</h1>
        </div>
        <Wrench className="h-6 w-6 text-indigo-400" />
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Optimization Checklist</h2>
        <div className="mt-3 space-y-2">
          {tasks.map((task) => (
            <label key={task.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <span className="text-sm font-medium text-slate-800">{task.title}</span>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
