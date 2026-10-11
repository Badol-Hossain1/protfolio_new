# Badol — Front-End Developer Portfolio

A personal portfolio built with **Next.js 16**, **Three.js** (React Three Fiber), **motion**, and **Tailwind CSS v4**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Make it yours

### Option A: Admin panel (no code needed)

Open **[/admin](http://localhost:3000/admin)** and sign in. Every part of the site is editable:
profile, projects (add/remove/feature), experience, and skill groups. Changes are live
immediately after saving.

- The password comes from `ADMIN_PASSWORD` in `.env.local` (default when unset: `admin123` — **change it before deploying**).
- Content is stored in [`data/content.json`](data/content.json) (seeded on first run).

> **Deployment note:** the content store is a JSON file written at runtime, so host it on a
> Node server (VPS, Railway, Render, your own box) for edits to persist. On serverless
> platforms like Vercel the filesystem is ephemeral — admin edits would reset on each deploy.

### Option B: Edit the file directly

[`data/content.json`](data/content.json) holds everything — profile, projects, experience,
skills. Also set `siteUrl` in [`src/app/layout.tsx`](src/app/layout.tsx) to your production
domain (fixes OpenGraph cards).

## Features

- **Admin panel** (`/admin`) — cookie-session auth (password-derived HMAC), full content CRUD
- **Light/dark mode** — toggle in the nav, saved to `localStorage`, applied pre-paint (no flash), respects system preference
- **AI chat assistant** — floating widget on every page; answers visitor questions grounded in your live content via `/api/chat` (uses `z-ai-web-dev-sdk` credentials)
- **Three.js hero** — custom GLSL simplex-noise blob + particle field, pointer parallax, lazy-mounted after first paint
- **Performance** — server-rendered, DPR-capped canvas, reduced-motion fallback orb
- **Accessibility** — semantic landmarks, skip link, focus rings, `aria-current` nav state, `prefers-reduced-motion` disables all animation
- **SEO** — metadata, OpenGraph/Twitter cards, JSON-LD `Person`

## What's inside

| Path | Purpose |
|---|---|
| `src/components/Scene.tsx` | Three.js hero — custom GLSL simplex-noise blob + particle field + pointer parallax |
| `src/components/Hero.tsx` | Lazy-mounts the 3D scene after first paint; falls back to a static orb for `prefers-reduced-motion` |
| `src/components/Nav.tsx` | Sticky nav with scrollspy, blur-on-scroll, progress bar, theme toggle |
| `src/components/ChatWidget.tsx` | Floating AI assistant, grounded in `data/content.json` |
| `src/app/admin/` | Login + full content editor |
| `src/lib/content.ts` | Server-side read/write/validate for the content store |
| `src/lib/auth.ts` | Admin session (HMAC cookie derived from `ADMIN_PASSWORD`) |
| `data/content.json` | **Your content lives here** |

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `ADMIN_PASSWORD` | `/admin` login password | `admin123` (⚠️ change it) |
| `OPENAI_API_KEY` | Enables the AI chat — any OpenAI-compatible provider | unset (chat shows a friendly "not configured" note) |
| `OPENAI_BASE_URL` | Custom provider endpoint | `https://api.openai.com/v1` |
| `OPENAI_MODEL` | Model name | `gpt-4o-mini` |

The chat also works with a z.ai `.z-ai-config` JSON file (`{ "baseUrl": "...", "apiKey": "..." }`)
in the project or home directory — env vars take priority.

## Quality notes (why HR + senior engineers should like it)

- **Performance**: server-rendered static page; the 3D scene is client-only, loaded after the headline paints, DPR-capped at 1.75.
- **Accessibility**: semantic landmarks, skip-to-content link, keyboard-visible focus rings, `aria-current` nav state, `prefers-reduced-motion` disables all animation including the 3D scene.
- **SEO**: full metadata, OpenGraph/Twitter cards, JSON-LD `Person` structured data.
- **Mobile-first**: every section is responsive down to small phones.

## Deploy

The easiest path is [Vercel](https://vercel.com/new): import the repo, defaults work out of the box.
