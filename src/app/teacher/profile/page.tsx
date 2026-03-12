"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const COURSES = [
  { id: "1", name: "CS 440 - Machine Learning", code: "CS 440" },
  { id: "2", name: "CS 210 - Data Structures", code: "CS 210" },
  { id: "3", name: "RES 301 - Research Methods", code: "RES 301" },
];

const DEFAULT_TAGS = ["Software Engineering", "Data Science", "Machine Learning", "Research Methods"];

export default function TeacherProfilePage() {
  const [aboutMe, setAboutMe] = React.useState(
    "I have over 15 years of experience in computer science education and research. My work focuses on machine learning applications in education and scalable software systems."
  );
  const [researchInterests, setResearchInterests] = React.useState(
    "Machine learning in education, automated grading systems, intelligent tutoring systems, and learning analytics."
  );
  const [tags, setTags] = React.useState<string[]>(DEFAULT_TAGS);
  const [newTag, setNewTag] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Your professional profile visible to students and colleagues.
        </p>
      </section>

      {/* Professional Card */}
      <Card className="overflow-hidden rounded-lg border-slate-200 p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex shrink-0 items-center justify-center bg-slate-100 p-8 sm:w-48">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-teal-100 text-4xl font-bold text-teal-700">
              T
            </div>
          </div>
          <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold text-slate-900">Dr. Sarah Mitchell</h2>
            <p className="mt-0.5 text-sm text-slate-600">Ph.D. in Computer Science</p>
            <p className="mt-1 text-sm font-medium text-teal-700">Department of Computer Science</p>
            <p className="mt-2 text-xs text-slate-500">teacher@university.edu</p>
          </div>
        </div>
      </Card>

      {/* Public Bio */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Public bio</h3>
        <p className="mt-0.5 text-xs text-slate-500">Editable fields shown on your profile</p>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="about-me" className="block text-xs font-medium text-slate-700">
              About me
            </label>
            <textarea
              id="about-me"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Write a short professional bio..."
            />
          </div>
          <div>
            <label htmlFor="research" className="block text-xs font-medium text-slate-700">
              Research interests
            </label>
            <textarea
              id="research"
              value={researchInterests}
              onChange={(e) => setResearchInterests(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="List your research interests..."
            />
          </div>
          <Button
            type="button"
            variant="primary"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleSave}
          >
            {saved ? "Saved ✓" : "Save bio"}
          </Button>
        </div>
      </Card>

      {/* Course Portfolio */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Course portfolio</h3>
        <p className="mt-0.5 text-xs text-slate-500">Courses you are currently leading</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COURSES.map((c) => (
            <Link
              key={c.id}
              href={`/teacher/courses/${c.id}`}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 transition-colors hover:border-teal-300 hover:bg-teal-50/30"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-teal-100 text-sm font-bold text-teal-700">
                {c.code}
              </div>
              <span className="text-sm font-medium text-slate-900">{c.name}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Expertise Tags */}
      <Card className="rounded-lg border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-900">Expertise tags</h3>
        <p className="mt-0.5 text-xs text-slate-500">Add tags to highlight your areas of expertise</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-0.5 rounded-full p-0.5 text-teal-600 hover:bg-teal-200 hover:text-teal-900"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <form onSubmit={handleAddTag} className="mt-4 flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag (e.g., Software Engineering)"
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary" size="sm">
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
}
