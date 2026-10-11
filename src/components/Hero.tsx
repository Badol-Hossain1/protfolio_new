"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { fadeUp, staggerChildren } from "@/lib/motion";

// The 3D scene is client-only and heavy — never block first paint with it
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export function Hero({ profile }: { profile: Profile }) {
  const reducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    // Defer mounting the canvas until after the text has painted
    const id = window.setTimeout(() => setSceneReady(true), 150);
    return () => window.clearTimeout(id);
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="scene-wrap pointer-events-none absolute inset-0" aria-hidden="true">
        {reducedMotion ? (
          <div className="orb-fallback absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
        ) : (
          sceneReady && <Scene />
        )}
      </div>
      {/* Fade the scene edges into the background so text stays readable */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--background)_85%)]"
        aria-hidden="true"
      />

      <motion.div
        variants={staggerChildren}
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 font-mono text-xs text-muted backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          {profile.availability}
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="text-balance text-5xl font-bold tracking-tight sm:text-7xl"
        >
          <span className="text-gradient">{profile.name}</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="font-mono text-sm uppercase tracking-[0.3em] text-accent"
        >
          {profile.role} · {profile.yearsExperience}+ years
        </motion.p>

        <motion.p variants={fadeUp} className="max-w-xl text-pretty text-lg text-muted">
          {profile.headline}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-2 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            View my work
          </a>
          <a
            href="#contact"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 z-10 font-mono text-xs text-muted transition-colors hover:text-accent"
        aria-label="Scroll down to the About section"
      >
        scroll ↓
      </motion.a>
    </section>
  );
}
