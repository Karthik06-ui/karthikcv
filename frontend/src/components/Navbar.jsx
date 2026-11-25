import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "#about",      label: "About" },
  { href: "#skills",     label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects",   label: "Projects" },
  { href: "#contact",    label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-light/90 backdrop-blur-sm dark:bg-surface-dark/90">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-acid focus:px-3 focus:py-1.5 focus:text-xs focus:font-mono focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      {/* Top rule */}
      <div className="h-px bg-ink/15 dark:bg-chalk/15" />

      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10"
      >
        {/* Wordmark */}
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-ink dark:text-chalk"
        >
          KS<span className="text-acid">.</span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="link-draw font-mono text-[11px] font-medium tracking-widest2 uppercase text-ink/65 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-7 w-7 flex-col items-end justify-center gap-[5px] md:hidden"
          >
            <span className={`block h-px bg-ink transition-all duration-300 dark:bg-chalk ${open ? "w-5 translate-y-[7px] rotate-45" : "w-5"}`} />
            <span className={`block h-px bg-ink transition-all duration-300 dark:bg-chalk ${open ? "w-0 opacity-0" : "w-3.5"}`} />
            <span className={`block h-px bg-ink transition-all duration-300 dark:bg-chalk ${open ? "w-5 -translate-y-[7px] -rotate-45" : "w-5"}`} />
          </button>
        </div>
      </nav>

      {/* Bottom rule */}
      <div className="h-px bg-ink/15 dark:bg-chalk/15" />

      {/* Mobile drawer */}
      {open && (
        <div className="border-b border-ink/15 bg-surface-light px-6 pb-4 dark:border-chalk/15 dark:bg-surface-dark md:hidden">
          <ul className="flex flex-col gap-1 pt-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-2.5 font-mono text-[11px] font-medium uppercase tracking-widest2 text-ink/70 dark:text-chalk/65"
                >
                  {l.label}
                  <span className="text-acid">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
