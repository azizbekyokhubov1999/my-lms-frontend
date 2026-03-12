"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";

interface RubricCriterion {
  id: string;
  name: string;
  points: number;
  description?: string;
}

interface Rubric {
  id: string;
  title: string;
  criteria: RubricCriterion[];
}

const STORAGE_KEY = "teacher-rubrics";

function loadRubrics(): Rubric[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRubrics(rubrics: Rubric[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rubrics));
}

export default function RubricsPage() {
  const [rubrics, setRubrics] = React.useState<Rubric[]>([]);
  const [createMode, setCreateMode] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCriteria, setNewCriteria] = React.useState<RubricCriterion[]>([]);

  React.useEffect(() => {
    setRubrics(loadRubrics());
  }, []);

  const startCreate = () => {
    setCreateMode(true);
    setNewTitle("");
    setNewCriteria([{ id: "c1", name: "", points: 0, description: "" }]);
  };

  const cancelCreate = () => {
    setCreateMode(false);
    setNewTitle("");
    setNewCriteria([]);
  };

  const addCriterion = () => {
    setNewCriteria((prev) => [
      ...prev,
      { id: "c" + Date.now(), name: "", points: 0, description: "" },
    ]);
  };

  const updateCriterion = (id: string, updates: Partial<RubricCriterion>) => {
    setNewCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const removeCriterion = (id: string) => {
    setNewCriteria((prev) => prev.filter((c) => c.id !== id));
  };

  const saveRubric = () => {
    const filtered = newCriteria.filter((c) => c.name.trim());
    const rubric: Rubric = {
      id: "r" + Date.now(),
      title: newTitle.trim() || "Untitled Rubric",
      criteria: filtered.map((c) => ({
        ...c,
        name: c.name.trim(),
        points: Math.max(0, c.points),
      })),
    };
    setRubrics((prev) => {
      const next = [...prev, rubric];
      saveRubrics(next);
      return next;
    });
    cancelCreate();
  };

  const deleteRubric = (id: string) => {
    setRubrics((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveRubrics(next);
      return next;
    });
  };

  const totalPoints = (r: Rubric) =>
    r.criteria.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="space-y-6">
      <section>
        <Link href="/teacher/assignments" className="text-xs font-medium text-teal-600 hover:underline">
          ← Back to Assignments
        </Link>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl">
          Grading Rubrics
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Define criteria and point values to use when grading assignments.
        </p>
      </section>

      {createMode ? (
        <Card className="rounded-lg border-teal-200 bg-teal-50/30 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Create rubric</h3>
          <div className="mt-4 space-y-4">
            <Input
              label="Rubric title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Research Paper Rubric"
            />
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-700">Criteria</label>
                <Button type="button" variant="secondary" size="sm" onClick={addCriterion}>
                  + Add criterion
                </Button>
              </div>
              <ul className="mt-2 space-y-3">
                {newCriteria.map((c, i) => (
                  <li
                    key={c.id}
                    className="flex flex-wrap items-start gap-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="min-w-[160px] flex-1">
                      <Input
                        value={c.name}
                        onChange={(e) => updateCriterion(c.id, { name: e.target.value })}
                        placeholder={`Criterion ${i + 1} (e.g., Clarity)`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-slate-600">Points</label>
                      <input
                        type="number"
                        min={0}
                        value={c.points}
                        onChange={(e) =>
                          updateCriterion(c.id, { points: parseInt(e.target.value, 10) || 0 })
                        }
                        className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCriterion(c.id)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-slate-500">
                Total: {newCriteria.reduce((s, c) => s + Math.max(0, c.points), 0)} points
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="primary" className="bg-teal-600 hover:bg-teal-700" onClick={saveRubric}>
                Save rubric
              </Button>
              <Button type="button" variant="secondary" onClick={cancelCreate}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="rounded-lg border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Your rubrics</h3>
            <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700" onClick={startCreate}>
              + Create rubric
            </Button>
          </div>
        </Card>
      )}

      <ul className="space-y-4">
        {rubrics.map((rubric) => (
            <li key={rubric.id}>
              <Card className="rounded-lg border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">{rubric.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {rubric.criteria.length} criteria · {totalPoints(rubric)} points total
                    </p>
                    <ul className="mt-3 space-y-1">
                      {rubric.criteria.map((c) => (
                        <li key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                          <span className="font-medium">{c.name}</span>
                          <span className="text-slate-500">—</span>
                          <span className="font-semibold text-teal-700">{c.points} pts</span>
                          {c.description && (
                            <span className="text-slate-500">· {c.description}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => deleteRubric(rubric.id)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="mt-4">
                  <Link href={`/teacher/assignments/create?rubric=${rubric.id}`}>
                    <Button type="button" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                      Use in assignment
                    </Button>
                  </Link>
                </div>
              </Card>
            </li>
        ))}
      </ul>

      {rubrics.length === 0 && !createMode && (
        <Card className="rounded-lg border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">No rubrics yet.</p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="mt-3 bg-teal-600 hover:bg-teal-700"
            onClick={startCreate}
          >
            Create your first rubric
          </Button>
        </Card>
      )}
    </div>
  );
}
