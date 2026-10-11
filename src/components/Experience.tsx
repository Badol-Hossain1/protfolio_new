"use client";

import { motion } from "motion/react";
import type { ExperienceItem } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import { Section } from "@/components/Section";

export function Experience({ experience }: { experience: ExperienceItem[] }) {
  return (
    <Section id="experience" index={4} title="Experience">
      <ol className="relative ml-2 space-y-12 border-l border-border pl-8">
        {experience.map((item) => (
          <motion.li key={`${item.company}-${item.period}`} variants={fadeUp} className="relative">
            <span
              className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">
                {item.role} <span className="text-muted">· {item.company}</span>
              </h3>
              <p className="font-mono text-sm text-accent">{item.period}</p>
            </div>
            <ul className="mt-3 space-y-2 text-muted">
              {item.points.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-1 font-mono text-accent" aria-hidden="true">▸</span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
