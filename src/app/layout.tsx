import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getContent } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// TODO: set to your production URL before deploying — fixes OpenGraph/twitter cards
const siteUrl = "https://your-domain.example.com";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getContent();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile.name} — ${profile.role}`,
      template: `%s — ${profile.name}`,
    },
    description: profile.summary,
    keywords: [profile.role, "front-end developer", "portfolio", ...profile.name.split(" ")],
    openGraph: {
      type: "website",
      title: `${profile.name} — ${profile.role}`,
      description: profile.summary,
      url: siteUrl,
      siteName: profile.name,
    },
    twitter: {
      card: "summary",
      title: `${profile.name} — ${profile.role}`,
      description: profile.summary,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06060b" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
  colorScheme: "dark light",
};

// Applies the saved (or system) theme before first paint so there's no flash
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { profile } = await getContent();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: siteUrl,
    sameAs: Object.values(profile.socials),
    knowsAbout: ["React", "TypeScript", "Next.js", "CSS", "Accessibility"],
  };

  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <script
          type="application/ld+json"
          // Structured data so search engines index the portfolio correctly
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
