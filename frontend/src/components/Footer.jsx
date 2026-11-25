import { portfolioData } from "../data/portfolio";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/15 dark:border-chalk/15">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10">
        <span className="font-mono text-[11px] text-ink/60 dark:text-chalk/50">
          © {year} {portfolioData.profile.name}
        </span>
        <span className="font-mono text-[11px] text-ink/50 dark:text-chalk/40">
          Let's Collaborate with each other!!!
        </span>
        <a
          href="#top"
          className="font-mono text-[11px] text-ink/60 transition-colors hover:text-ink dark:text-chalk/50 dark:hover:text-chalk"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}
