"use client";

import { motion } from "motion/react";
import type { Profile } from "@/lib/types";
import { fadeUp } from "@/lib/motion";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { Section } from "@/components/Section";

export function Contact({ profile }: { profile: Profile }) {
  return (
    <Section id="contact" index={5} title="Contact">
      <div className="flex flex-col items-center gap-8 py-8 text-center">
        <motion.h2 variants={fadeUp} className="max-w-2xl text-3xl font-bold sm:text-5xl">
          Have a role or a project? <span className="text-gradient">Let&apos;s talk.</span>
        </motion.h2>

        <motion.p variants={fadeUp} className="max-w-md text-muted">
          I reply to every serious message, usually within a day. Email is fastest.
        </motion.p>

        <motion.a
          variants={fadeUp}
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
        >
          <MailIcon className="h-4 w-4" />
          {profile.email}
        </motion.a>

        <motion.div variants={fadeUp} className="flex gap-4">
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon />
          </a>
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <LinkedinIcon />
          </a>
        </motion.div>
      </div>
    </Section>
  );
}
