"use client";

import { motion } from "motion/react";
import type { Project } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import { ArrowUpRightIcon, GithubIcon } from "@/components/icons";
import { Section } from "@/components/Section";

export function Projects({ projects }: { projects: Project[] }) {
  const featured = projects.find((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section id="projects" index={3} title="Projects">
      <div className="space-y-6">
        {featured && <ProjectCard project={featured} featured />}

        <div className="grid gap-6 sm:grid-cols-2">
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <motion.article
      variants={fadeUp}
      className={`card-lift group relative flex flex-col gap-4 rounded-2xl border bg-surface/60 p-6 backdrop-blur sm:p-8 ${
        featured ? "border-transparent" : "border-border"
      }`}
      style={
        featured
          ? {
              border: "1px solid transparent",
              background:
                "linear-gradient(var(--surface), var(--surface)) padding-box, linear-gradient(120deg, var(--accent), var(--accent-2)) border-box",
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold">
          {project.title}
          {featured && (
            <span className="ml-3 align-middle font-mono text-[10px] uppercase tracking-widest text-accent">
              Featured
            </span>
          )}
        </h3>
        <div className="flex shrink-0 gap-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source code on GitHub`}
              className="text-muted transition-colors hover:text-accent"
            >
              <GithubIcon />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              className="text-muted transition-colors hover:text-accent"
            >
              <ArrowUpRightIcon className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>

      <p className="leading-relaxed text-muted">{project.description}</p>

      <p className="font-mono text-sm text-accent">▸ {project.highlight}</p>

      <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Technologies used">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-background/80 px-3 py-1 font-mono text-xs text-muted">
            {tag}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
