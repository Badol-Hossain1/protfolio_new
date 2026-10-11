/* Shared content types — importable from both server and client components.
   The live values live in data/content.json (edited via /admin). */

export type Profile = {
  name: string;
  role: string;
  yearsExperience: number;
  headline: string;
  summary: string;
  location: string;
  email: string;
  availability: string;
  socials: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
};

export type Project = {
  title: string;
  description: string;
  highlight: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
};

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

export type SiteContent = {
  profile: Profile;
  projects: Project[];
  experience: ExperienceItem[];
  skillGroups: SkillGroup[];
};

export const navSections = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* Demo content used to seed data/content.json on first run.
   Replace via /admin — or edit data/content.json directly. */
export const DEFAULT_CONTENT: SiteContent = {
  profile: {
    name: "Badol",
    role: "Front-End Developer",
    yearsExperience: 4,
    headline: "I build fast, accessible interfaces people enjoy using.",
    summary:
      "Front-end developer with 4 years of experience turning designs and product ideas into production web apps. I care about performance budgets, accessibility, and the small interaction details that make software feel finished.",
    location: "Dhaka, Bangladesh",
    email: "hello@example.com",
    availability: "Open to new opportunities",
    socials: {
      github: "https://github.com/your-username",
      linkedin: "https://www.linkedin.com/in/your-username",
    },
  },
  projects: [
    {
      title: "Design System Component Library",
      description:
        "A documented component library of 30+ accessible React components with design tokens, dark mode, and visual regression tests, adopted by 3 product teams.",
      highlight: "Cut feature UI build time roughly in half across teams",
      tags: ["React", "TypeScript", "Storybook", "Radix UI", "Design Tokens"],
      repoUrl: "https://github.com/your-username/design-system",
      featured: true,
    },
    {
      title: "E-commerce Storefront",
      description:
        "Next.js storefront with server components, streaming SSR, cart, and checkout flow. Optimized images, fonts, and data fetching for fast page loads on slow connections.",
      highlight: "95+ Lighthouse performance on mobile",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe"],
      repoUrl: "https://github.com/your-username/storefront",
      liveUrl: "https://example.com",
    },
    {
      title: "Realtime Analytics Dashboard",
      description:
        "Dashboard rendering live data streams with virtualized tables and charts. Handled state for filters, polling, and optimistic updates without jank.",
      highlight: "Smooth 60fps rendering of 10k+ live table rows",
      tags: ["React", "WebSockets", "Recharts", "Zustand"],
      repoUrl: "https://github.com/your-username/dashboard",
    },
  ],
  experience: [
    {
      role: "Front-End Developer",
      company: "Company Name",
      period: "2023 — Present",
      points: [
        "Shipped and maintained customer-facing features in a Next.js app serving N users monthly",
        "Improved Core Web Vitals across the main funnel, moving LCP from ~4s to under 2s",
        "Mentored junior developers through code review and pairing sessions",
      ],
    },
    {
      role: "Junior Front-End Developer",
      company: "Company Name",
      period: "2022 — 2023",
      points: [
        "Built responsive UI from Figma designs with pixel-level accuracy",
        "Wrote component tests that took regression bugs to near zero",
      ],
    },
  ],
  skillGroups: [
    { title: "Core", skills: ["JavaScript (ES2023+)", "TypeScript", "HTML5", "CSS3", "React"] },
    {
      title: "Frameworks & Styling",
      skills: ["Next.js", "Tailwind CSS", "Redux Toolkit", "Zustand", "Framer Motion"],
    },
    {
      title: "Tooling & Platform",
      skills: ["Git", "Vite", "Jest", "React Testing Library", "Playwright", "Vercel"],
    },
    {
      title: "Practices",
      skills: [
        "Accessibility (WCAG)",
        "Core Web Vitals",
        "Responsive Design",
        "REST APIs",
        "Agile / Scrum",
      ],
    },
  ],
};
