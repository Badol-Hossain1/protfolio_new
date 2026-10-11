import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { DEFAULT_CONTENT, type SiteContent } from "@/lib/types";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

/** Minimal structural validation for content saved from the admin panel.
 *  Returns an error string, or null when the shape is acceptable. */
export function validateContent(input: unknown): string | null {
  if (typeof input !== "object" || input === null) return "Content must be an object";
  const c = input as Partial<SiteContent>;

  if (!c.profile || typeof c.profile !== "object") return "Missing profile";
  const p = c.profile as Partial<SiteContent["profile"]>;
  for (const key of ["name", "role", "headline", "summary", "email"] as const) {
    if (typeof p[key] !== "string" || !p[key]?.trim()) return `profile.${key} must be a non-empty string`;
  }
  if (typeof p.yearsExperience !== "number" || !Number.isFinite(p.yearsExperience)) {
    return "profile.yearsExperience must be a number";
  }

  if (!Array.isArray(c.projects) || !Array.isArray(c.experience) || !Array.isArray(c.skillGroups)) {
    return "projects, experience and skillGroups must be arrays";
  }
  for (const project of c.projects) {
    if (!project || typeof project.title !== "string" || !project.title.trim()) {
      return "Every project needs a title";
    }
  }
  for (const item of c.experience) {
    if (!item || typeof item.role !== "string" || !item.role.trim()) {
      return "Every experience entry needs a role";
    }
  }
  for (const group of c.skillGroups) {
    if (!group || typeof group.title !== "string" || !Array.isArray(group.skills)) {
      return "Every skill group needs a title and a skills array";
    }
  }
  return null;
}

/** Fill any missing fields with defaults so an older/partial content file
 *  never breaks the site after an upgrade. */
function mergeWithDefaults(stored: Partial<SiteContent>): SiteContent {
  return {
    profile: { ...DEFAULT_CONTENT.profile, ...stored.profile },
    projects: stored.projects ?? DEFAULT_CONTENT.projects,
    experience: stored.experience ?? DEFAULT_CONTENT.experience,
    skillGroups: stored.skillGroups ?? DEFAULT_CONTENT.skillGroups,
  };
}

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(CONTENT_PATH, "utf8");
    return mergeWithDefaults(JSON.parse(raw));
  } catch {
    // First run (or deleted file): seed the store so the site and admin work immediately
    await saveContent(DEFAULT_CONTENT);
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  await mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await writeFile(CONTENT_PATH, JSON.stringify(content, null, 2) + "\n", "utf8");
}
