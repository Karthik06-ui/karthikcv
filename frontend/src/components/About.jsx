import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";

export default function About() {
  const { about } = portfolioData;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-ink/15 dark:border-chalk/15"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="flex items-baseline gap-5 pb-8 border-b border-ink/15 dark:border-chalk/15">
            <span className="section-label">01</span>
            <h2 id="about-heading" className="font-display text-xs font-semibold uppercase tracking-widest2 text-ink/60 dark:text-chalk/50">
              About
            </h2>
          </div>

          {/* Two-column layout */}
          <div className="mt-10 grid gap-10 md:grid-cols-5 md:gap-16">
            {/* Summary — wider column */}
            <div className="md:col-span-3">
              <p className="font-sans text-lg leading-relaxed text-ink/85 dark:text-chalk/85 md:text-xl">
                {about.summary}
              </p>
            </div>

            {/* Education — narrower column */}
            <div className="md:col-span-2">
              <p className="section-label mb-5">Education</p>
              <div className="space-y-6">
                {about.education.map((edu) => (
                  <div key={edu.institution} className="border-l border-acid/60 pl-4">
                    <p className="font-display text-sm font-semibold text-ink dark:text-chalk">
                      {edu.institution}
                    </p>
                    <p className="mt-1 font-sans text-sm text-ink/70 dark:text-chalk/65">
                      {edu.degree}
                    </p>
                    {edu.period && (
                      <p className="mt-1.5 font-mono text-[11px] text-ink/55 dark:text-chalk/45">
                        {edu.period}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
