"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { staggerChildren, viewportOnce } from "@/lib/motion";

type SectionProps = {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
};

/** Shared section shell: consistent spacing, numbered eyebrow, reveal-on-scroll */
export function Section({ id, index, title, children }: SectionProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section id={id} aria-label={title} className="relative mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
      <motion.div
        variants={staggerChildren}
        initial={reducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.header className="mb-10 sm:mb-14">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            {String(index).padStart(2, "0")} — {title}
          </p>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-accent to-transparent" aria-hidden="true" />
        </motion.header>
        {children}
      </motion.div>
    </section>
  );
}
