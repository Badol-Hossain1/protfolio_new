import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { ChatWidget } from "@/components/ChatWidget";
import { getContent } from "@/lib/content";

// Content is edited at runtime through /admin, so every request reads the store
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Nav name={content.profile.name} />
      <main id="main" className="flex-1">
        <Hero profile={content.profile} />
        <About profile={content.profile} />
        <Skills skillGroups={content.skillGroups} />
        <Projects projects={content.projects} />
        <Experience experience={content.experience} />
        <Contact profile={content.profile} />
      </main>
      <Footer name={content.profile.name} />
      <ChatWidget content={content} />
    </>
  );
}
