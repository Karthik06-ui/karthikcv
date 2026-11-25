import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : true
  );

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: light)");
    if (!mq) return;
    const handler = (e) => {
      if (!localStorage.getItem("theme")) {
        const next = !e.matches;
        document.documentElement.classList.toggle("dark", next);
        setIsDark(next);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-7 w-7 items-center justify-center text-ink/50 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
    >
      {/* Sun (light mode indicator) */}
      <span
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        {/* Sun icon — raw SVG for crispness */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 12.07l1.06-1.06M10.01 4.99l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </span>
      {/* Moon (dark mode indicator) */}
      <span
        aria-hidden="true"
        className={`absolute transition-all duration-300 ${
          !isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 9A6 6 0 015 1.5a6 6 0 100 11 6 6 0 007.5-3.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </span>
    </button>
  );
}
