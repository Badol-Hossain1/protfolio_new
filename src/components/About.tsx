"use client";

import { motion } from "motion/react";
import type { Profile } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import { GithubIcon, LinkedinIcon, MailIcon, MapPinIcon } from "@/components/icons";
import { Section } from "@/components/Section";

export function About({ profile }: { profile: Profile }) {
  return (
    <Section id="about" index={1} title="About">
      <div className="grid gap-10 sm:grid-cols-[3fr_2fr] sm:gap-14">
        <motion.div variants={fadeUp} className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m <span className="font-semibold text-foreground">{profile.name}</span>. {profile.summary}
          </p>
          <p>
            What you&apos;ll get from me: clean component architecture, honest estimates, and UI that
            works the same way for keyboard and screen-reader users as it does for everyone else.
          </p>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          className="card-lift h-fit space-y-4 rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur"
        >
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3 text-muted">
              <MapPinIcon className="text-accent" />
              {profile.location}
            </li>
            <li className="flex items-center gap-3 text-muted">
              <MailIcon className="text-accent" />
              <a href={`mailto:${profile.email}`} className="transition-colors hover:text-accent">
                {profile.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {profile.availability}
            </li>
          </ul>
          <div className="flex gap-3 border-t border-border pt-4">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-muted transition-colors hover:text-accent"
            >
              <GithubIcon />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="text-muted transition-colors hover:text-accent"
            >
              <LinkedinIcon />
            </a>
          </div>
        </motion.aside>
      </div>
    </Section>
  );
}
