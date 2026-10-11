export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-center font-mono text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} {name}</p>
        <p>
          Built with <span className="text-accent">Next.js</span> ·{" "}
          <span className="text-accent">Three.js</span> ·{" "}
          <span className="text-accent">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
}
