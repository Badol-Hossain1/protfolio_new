"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ExperienceItem, Project, Profile, SiteContent, SkillGroup } from "@/lib/types";

type Status = "idle" | "saving" | "saved" | "error";

const inputClass =
  "w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none transition-colors focus:border-accent";
const cardClass = "rounded-2xl border border-border bg-surface/70 p-5 backdrop-blur";
const sectionTitle = "font-mono text-xs uppercase tracking-[0.25em] text-accent";
const removeBtn =
  "rounded-lg border border-red-500/40 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10";
const addBtn =
  "rounded-full border border-dashed border-border px-5 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent";

function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={3}
          className={inputClass}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </label>
  );
}

export function AdminEditor({ initialContent }: { initialContent: SiteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dirty = JSON.stringify(content) !== JSON.stringify(initialContent);

  const setProfile = (patch: Partial<Profile>) =>
    setContent((c) => ({ ...c, profile: { ...c.profile, ...patch } }));
  const setProjects = (projects: Project[]) => setContent((c) => ({ ...c, projects }));
  const setExperience = (experience: ExperienceItem[]) => setContent((c) => ({ ...c, experience }));
  const setSkillGroups = (skillGroups: SkillGroup[]) => setContent((c) => ({ ...c, skillGroups }));

  const updateProject = (index: number, patch: Partial<Project>) =>
    setProjects(content.projects.map((p, i) => (i === index ? { ...p, ...patch } : p)));

  const updateExperience = (index: number, patch: Partial<ExperienceItem>) =>
    setExperience(content.experience.map((e, i) => (i === index ? { ...e, ...patch } : e)));

  const updateSkillGroup = (index: number, patch: Partial<SkillGroup>) =>
    setSkillGroups(content.skillGroups.map((g, i) => (i === index ? { ...g, ...patch } : g)));

  const save = async () => {
    setStatus("saving");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("saved");
        router.refresh();
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Save failed");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error — is the server running?");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const splitList = (value: string, separator: string) =>
    value.split(separator).map((item) => item.trim()).filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="sticky top-0 z-10 -mx-6 mb-8 border-b border-border bg-background/85 px-6 py-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Content editor</h1>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="font-mono text-xs text-muted transition-colors hover:text-accent"
            >
              view site ↗
            </a>
            <button type="button" onClick={logout} className="font-mono text-xs text-muted transition-colors hover:text-accent">
              log out
            </button>
            {dirty && (
              <button
                type="button"
                onClick={() => setContent(initialContent)}
                className="font-mono text-xs text-muted transition-colors hover:text-foreground"
              >
                discard changes
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={!dirty || status === "saving"}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-background transition-opacity disabled:opacity-40"
            >
              {status === "saving" ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
        <p aria-live="polite" className="mt-1 h-4 font-mono text-[10px] text-muted">
          {status === "saved" && !dirty && "✓ Saved — live on the site"}
          {status === "error" && <span className="text-red-400">✗ {errorMsg}</span>}
          {dirty && status !== "error" && "● Unsaved changes"}
        </p>
      </header>

      <div className="space-y-10">
        {/* ── Profile ─────────────────────────────────────────── */}
        <section className={cardClass}>
          <h2 className={`${sectionTitle} mb-5`}>Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" value={content.profile.name} onChange={(name) => setProfile({ name })} />
            <Field label="Role" value={content.profile.role} onChange={(role) => setProfile({ role })} />
            <Field
              label="Years of experience"
              type="number"
              value={String(content.profile.yearsExperience)}
              onChange={(value) => setProfile({ yearsExperience: Number(value) || 0 })}
            />
            <Field label="Location" value={content.profile.location} onChange={(location) => setProfile({ location })} />
            <Field label="Email" type="email" value={content.profile.email} onChange={(email) => setProfile({ email })} />
            <Field label="Availability" value={content.profile.availability} onChange={(availability) => setProfile({ availability })} />
            <div className="sm:col-span-2">
              <Field label="Headline" value={content.profile.headline} onChange={(headline) => setProfile({ headline })} />
            </div>
            <div className="sm:col-span-2">
              <Field label="Summary" textarea value={content.profile.summary} onChange={(summary) => setProfile({ summary })} />
            </div>
            <Field label="GitHub URL" value={content.profile.socials.github} onChange={(github) => setProfile({ socials: { ...content.profile.socials, github } })} />
            <Field label="LinkedIn URL" value={content.profile.socials.linkedin} onChange={(linkedin) => setProfile({ socials: { ...content.profile.socials, linkedin } })} />
          </div>
        </section>

        {/* ── Projects ────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={sectionTitle}>Projects ({content.projects.length})</h2>
            <button
              type="button"
              className={addBtn}
              onClick={() =>
                setProjects([
                  ...content.projects,
                  { title: "New project", description: "", highlight: "", tags: [] },
                ])
              }
            >
              + Add project
            </button>
          </div>
          {content.projects.map((project, index) => (
            <article key={index} className={cardClass}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(project.featured)}
                    onChange={(event) =>
                      setProjects(
                        content.projects.map((p, i) => ({
                          ...p,
                          // Only one project can be featured at a time
                          featured: event.target.checked ? i === index : false,
                        }))
                      )
                    }
                  />
                  Featured
                </label>
                <button type="button" className={removeBtn} onClick={() => setProjects(content.projects.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={project.title} onChange={(title) => updateProject(index, { title })} />
                <Field label="Highlight (one impressive metric)" value={project.highlight} onChange={(highlight) => updateProject(index, { highlight })} />
                <div className="sm:col-span-2">
                  <Field label="Description" textarea value={project.description} onChange={(description) => updateProject(index, { description })} />
                </div>
                <Field
                  label="Tags (comma-separated)"
                  value={project.tags.join(", ")}
                  onChange={(value) => updateProject(index, { tags: splitList(value, ",") })}
                  placeholder="React, TypeScript"
                />
                <Field label="Repo URL" value={project.repoUrl ?? ""} onChange={(repoUrl) => updateProject(index, { repoUrl: repoUrl || undefined })} placeholder="https://github.com/…" />
                <Field label="Live URL (optional)" value={project.liveUrl ?? ""} onChange={(liveUrl) => updateProject(index, { liveUrl: liveUrl || undefined })} placeholder="https://…" />
              </div>
            </article>
          ))}
        </section>

        {/* ── Experience ──────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={sectionTitle}>Experience ({content.experience.length})</h2>
            <button
              type="button"
              className={addBtn}
              onClick={() =>
                setExperience([
                  ...content.experience,
                  { role: "New role", company: "Company", period: "2024 — Present", points: [] },
                ])
              }
            >
              + Add entry
            </button>
          </div>
          {content.experience.map((item, index) => (
            <article key={index} className={cardClass}>
              <div className="mb-4 flex justify-end">
                <button type="button" className={removeBtn} onClick={() => setExperience(content.experience.filter((_, i) => i !== index))}>
                  Remove
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Role" value={item.role} onChange={(role) => updateExperience(index, { role })} />
                <Field label="Company" value={item.company} onChange={(company) => updateExperience(index, { company })} />
                <Field label="Period" value={item.period} onChange={(period) => updateExperience(index, { period })} placeholder="2023 — Present" />
                <div className="sm:col-span-3">
                  <Field
                    label="Points (one per line)"
                    textarea
                    value={item.points.join("\n")}
                    onChange={(value) => updateExperience(index, { points: splitList(value, "\n") })}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ── Skills ──────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={sectionTitle}>Skill groups ({content.skillGroups.length})</h2>
            <button
              type="button"
              className={addBtn}
              onClick={() => setSkillGroups([...content.skillGroups, { title: "New group", skills: [] }])}
            >
              + Add group
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.skillGroups.map((group, index) => (
              <article key={index} className={cardClass}>
                <div className="mb-4 flex justify-end">
                  <button type="button" className={removeBtn} onClick={() => setSkillGroups(content.skillGroups.filter((_, i) => i !== index))}>
                    Remove
                  </button>
                </div>
                <div className="space-y-4">
                  <Field label="Group title" value={group.title} onChange={(title) => updateSkillGroup(index, { title })} />
                  <Field
                    label="Skills (comma-separated)"
                    textarea
                    value={group.skills.join(", ")}
                    onChange={(value) => updateSkillGroup(index, { skills: splitList(value, ",") })}
                    placeholder="React, TypeScript, CSS"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
