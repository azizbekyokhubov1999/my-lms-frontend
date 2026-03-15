"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import * as React from "react";

import { Button } from "../../../../components/ui/Button";
import { Card } from "../../../../components/ui/Card";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const MOCK_PROGRAM_NAMES: Record<string, string> = {
  p1: "BSc Software Development",
  p2: "BSc Computer Science",
  p3: "MBA Business Administration",
  p4: "LLB Law",
  p5: "BEng Electrical Engineering",
};

interface TreeNode {
  id: string;
  type: "module" | "course";
  name: string;
  code?: string;
  credits?: number;
  children?: TreeNode[];
}

const MOCK_STRUCTURE: Record<string, TreeNode[]> = {
  p1: [
    {
      id: "m1", type: "module", name: "CS Fundamentals", children: [
        { id: "c1", type: "course", name: "Intro to Python", code: "CS101", credits: 6 },
        { id: "c2", type: "course", name: "Data Structures", code: "CS102", credits: 6 },
      ],
    },
    {
      id: "m2", type: "module", name: "Software Engineering", children: [
        { id: "c3", type: "course", name: "Software Design", code: "SE201", credits: 6 },
        { id: "c4", type: "course", name: "Databases", code: "SE202", credits: 6 },
      ],
    },
  ],
  p2: [
    { id: "m3", type: "module", name: "Core CS", children: [{ id: "c5", type: "course", name: "Algorithms", code: "CS201", credits: 6 }] },
  ],
};

const defaultStructure: TreeNode[] = MOCK_STRUCTURE.p1;

function TreeItem({ node, depth, programId }: { node: TreeNode; depth: number; programId: string }) {
  const [open, setOpen] = React.useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isModule = node.type === "module";

  return (
    <div className="relative">
      <div
        style={{ paddingLeft: depth * 24 }}
        className={cn(
          "group flex items-center gap-2 rounded-lg border py-2.5 pr-3 transition-colors",
          "border-blue-200 bg-blue-50/50 hover:bg-blue-100/50",
          "print:border-blue-300",
          depth === 0 && "border-blue-300 bg-blue-100/70 font-medium",
        )}
      >
        {hasChildren && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-blue-800 hover:bg-blue-200/80"
            aria-expanded={open}
          >
            <svg className={cn("h-4 w-4 transition-transform", open && "rotate-90")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <span className="w-6 shrink-0" />}
        <span className={cn("h-4 w-4 shrink-0 rounded border-2 border-blue-600", isModule ? "bg-blue-100" : "bg-white")} title={node.type} />
        <div className="min-w-0 flex-1">
          <span className="text-blue-900">{node.name}</span>
          {node.code && <span className="ml-2 font-mono text-xs text-blue-700">({node.code})</span>}
          {node.credits != null && <span className="ml-2 text-xs text-blue-600">{node.credits} cr</span>}
        </div>
        <span className="text-xs font-medium uppercase text-blue-600 opacity-80">{node.type}</span>
      </div>
      {hasChildren && open && (
        <div className="mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} depth={depth + 1} programId={programId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProgramStructurePage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const programName = id ? MOCK_PROGRAM_NAMES[id] ?? "Program" : "Program";
  const structure = id && MOCK_STRUCTURE[id] ? MOCK_STRUCTURE[id] : defaultStructure;

  return (
    <div className="min-h-screen bg-[#e8f4fc]">
      {/* Blueprint-style grid background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative space-y-6 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link href={`/academic/programs/${id}`} className="text-sm font-medium text-blue-800 hover:text-blue-900">
              ← Program
            </Link>
            <h1 className="mt-1 text-2xl font-semibold text-blue-900">Program Structure</h1>
            <p className="mt-0.5 text-sm text-blue-800/80">{programName}</p>
          </div>
          <Button
            type="button"
            className="border-2 border-blue-700 bg-white text-blue-800 hover:bg-blue-50 focus-visible:ring-blue-600"
            onClick={() => alert("Add Module (Demo)")}
          >
            + Add Module
          </Button>
        </div>

        <Card className="overflow-hidden border-2 border-blue-200 bg-white/95 shadow-none print:border-blue-300" style={{ boxShadow: "0 0 0 1px rgba(29, 78, 216, 0.2)" }}>
          <div className="border-b-2 border-blue-200 bg-blue-50/80 px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-900">Structure (Modules & Courses)</h2>
            <p className="mt-0.5 text-xs text-blue-700/80">Hierarchical view. Add modules, then courses under each module.</p>
          </div>
          <div className="space-y-0.5 p-4">
            {structure.length === 0 ? (
              <p className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/50 py-8 text-center text-sm text-blue-700">
                No modules yet. Click &quot;Add Module&quot; to start.
              </p>
            ) : (
              structure.map((node) => <TreeItem key={node.id} node={node} depth={0} programId={id} />)
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
