"use client";

import { motion } from "motion/react";
import type { SkillGroup } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import { Section } from "@/components/Section";

export function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <Section id="skills" index={2} title="Skills">
      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <motion.div
            key={group.title}
            variants={fadeUp}
            className="card-lift rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur"
          >
            <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-accent">
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
