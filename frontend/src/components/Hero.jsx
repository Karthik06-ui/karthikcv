import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";

export default function Hero() {
  const { profile, socials } = portfolioData;

  return (
    <section id="top" className="mx-auto max-w-6xl px-6 md:px-10">
      {/* Upper strip with availability badge */}
      <div className="flex items-center justify-between border-b border-ink/15 py-5 dark:border-chalk/15">
        <span className="font-mono text-[11px] tracking-widest2 uppercase text-ink/60 dark:text-chalk/50">
          Portfolio — 2026
        </span>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] text-ink/70 dark:text-chalk/65">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-acid opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-acid" />
          </span>
          Open to internships
        </span>
      </div>

      {/* Main hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pb-16 pt-14 md:pb-24 md:pt-20"
      >
        {/* Name — single line, editorial large type */}
        <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-700 leading-[0.9] tracking-tight text-ink dark:text-chalk">
          {profile.name}
        </h1>

        {/* Role tag */}
        <div className="mt-8 flex flex-wrap items-start gap-6 md:mt-10">
          <p className="max-w-lg text-base leading-relaxed text-ink/75 dark:text-chalk/65">
            {profile.heroPitch}
          </p>

          {/* Right-aligned actions */}
          <div className="ml-auto flex flex-col items-end gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-3 border border-ink/30 px-5 py-3 font-mono text-xs font-medium tracking-widest2 uppercase text-ink transition-all hover:border-acid hover:bg-acid hover:text-ink dark:border-chalk/25 dark:text-chalk dark:hover:border-acid dark:hover:bg-acid dark:hover:text-ink"
            >
              View Projects
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a
              href={profile.resumeUrl}
              download="Karthik_portfolio.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-ink/65 underline underline-offset-4 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
            >
              Download résumé ↓
            </a>
          </div>
        </div>

        {/* Bottom strip: socials + contact */}
        <div className="mt-14 flex flex-wrap items-center gap-6 border-t border-ink/15 pt-6 dark:border-chalk/15">
          <a
            href={socials.github.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/65 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
            title={socials.github.isPlaceholder ? "GitHub (placeholder)" : "GitHub"}
          >
            GitHub
          </a>
          <a
            href={socials.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/65 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
            title={socials.linkedin.isPlaceholder ? "LinkedIn (placeholder)" : "LinkedIn"}
          >
            LinkedIn
          </a>
          <a
            href="#contact"
            className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/65 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
          >
            Contact
          </a>
          <span className="ml-auto font-mono text-[11px] text-ink/55 dark:text-chalk/40">
            {profile.location}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
