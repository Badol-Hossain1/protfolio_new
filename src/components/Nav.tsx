"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { navSections } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Nav({ name }: { name: string }) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = navSections
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A section counts as active while its upper half crosses the viewport middle
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-border bg-background/75 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4"
      >
        <a href="#hero" className="font-mono text-sm font-bold tracking-tight text-foreground">
          <span className="text-accent">{"<"}</span>
          {name}
          <span className="text-accent">{"/>"}</span>
        </a>

        <ul className="flex items-center gap-1 overflow-x-auto text-sm">
          {navSections.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 transition-colors ${
                  active === id
                    ? "bg-surface text-accent"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />
      </nav>

      {!reducedMotion && (
        <motion.div
          className="h-px origin-left bg-gradient-to-r from-accent to-accent-2"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
      )}
    </header>
  );
}
