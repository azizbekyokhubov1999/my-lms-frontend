"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

interface UnassignedStudent {
  id: string;
  name: string;
  studentId: string;
  program: string;
}

const MOCK_UNASSIGNED: UnassignedStudent[] = [
  { id: "u1", name: "Alex Ivanov", studentId: "STU-10010", program: "BSc Software Development" },
  { id: "u2", name: "Sofia Kim", studentId: "STU-10011", program: "BSc Software Development" },
  { id: "u3", name: "Max Volkov", studentId: "STU-10012", program: "BSc Computer Science" },
  { id: "u4", name: "Daria Lee", studentId: "STU-10013", program: "BSc Software Development" },
];

const MOCK_GROUPS = [
  { id: "g1", name: "SD-24-01", program: "BSc Software Development" },
  { id: "g2", name: "SD-24-02", program: "BSc Software Development" },
  { id: "g3", name: "CS-23-01", program: "BSc Computer Science" },
];

export default function BulkAssignStudentsPage() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [targetGroupId, setTargetGroupId] = React.useState("");
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_UNASSIGNED;
    return MOCK_UNASSIGNED.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.program.toLowerCase().includes(q)
    );
  }, [search]);

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((s) => s.id)));
  };

  const handleAssign = () => {
    if (!targetGroupId || selectedIds.size === 0) return;
    const group = MOCK_GROUPS.find((g) => g.id === targetGroupId);
    alert(`Assigned ${selectedIds.size} student(s) to ${group?.name ?? targetGroupId} (Demo).`);
    router.push("/academic/groups");
  };

  const canSubmit = targetGroupId && selectedIds.size > 0;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/academic/groups" className="text-sm font-medium text-slate-600 hover:text-slate-900">
          ← Groups
        </Link>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Bulk Assign Students</h1>
        <p className="mt-0.5 text-sm text-slate-600">
          Select multiple unassigned students and assign them to a group in one click.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Unassigned students</h2>
          <p className="mt-0.5 text-xs text-slate-600">Select students to assign to a group.</p>
          <div className="mt-3">
            <Input
              type="search"
              placeholder="Search by name, ID, or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            />
          </div>
          <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="sticky top-0 border-b border-purple-200 bg-purple-100">
                  <th className="w-10 px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={toggleAll}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-3 py-2 font-medium text-purple-900">Student</th>
                  <th className="px-3 py-2 font-medium text-purple-900">Program</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className={cn("hover:bg-purple-50/50", selectedIds.has(s.id) && "bg-purple-50/70")}>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(s.id)}
                        onChange={() => toggle(s.id)}
                        aria-label={`Select ${s.name}`}
                      />
                    </td>
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-900">{s.name}</p>
                      <p className="text-xs font-mono text-slate-500">{s.studentId}</p>
                    </td>
                    <td className="px-3 py-2 text-slate-700">{s.program}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No unassigned students match your search.</p>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-900">Assign to group</h2>
          <p className="mt-0.5 text-xs text-slate-600">Choose the target group. All selected students will be added to it.</p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-800">Target group</label>
            <select
              value={targetGroupId}
              onChange={(e) => setTargetGroupId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
            >
              <option value="">— Select group —</option>
              {MOCK_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.program})
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50/50 p-4">
            <p className="text-sm font-medium text-purple-900">
              {selectedIds.size} student(s) selected
            </p>
            <p className="mt-0.5 text-xs text-slate-600">
              {targetGroupId ? `They will be assigned to ${MOCK_GROUPS.find((g) => g.id === targetGroupId)?.name ?? "the selected group"}.` : "Select a group to continue."}
            </p>
          </div>
          <Button
            type="button"
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500"
            onClick={handleAssign}
            disabled={!canSubmit}
          >
            Assign to group
          </Button>
        </Card>
      </div>
    </div>
  );
}
