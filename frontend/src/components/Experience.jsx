import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-ink/15 dark:border-chalk/15"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="flex items-baseline gap-5 pb-8 border-b border-ink/15 dark:border-chalk/15">
            <span className="section-label">03</span>
            <h2 id="experience-heading" className="font-display text-xs font-semibold uppercase tracking-widest2 text-ink/60 dark:text-chalk/50">
              Experience
            </h2>
          </div>

          {/* Experience entries */}
          <ol className="mt-0 divide-y divide-ink/15 dark:divide-chalk/15">
            {experience.map((item, idx) => (
              <li key={`${item.role}-${item.period}`}>
                <div className="grid gap-6 py-10 md:grid-cols-5 md:gap-10">
                  {/* Left meta column */}
                  <div className="md:col-span-2">
                    <p className="font-mono text-[11px] text-ink/65 dark:text-chalk/50">
                      {item.period}
                    </p>
                    <p className="mt-2 font-mono text-[11px] text-ink/55 dark:text-chalk/40">
                      {item.location}
                    </p>
                    {/* Index marker — purely decorative */}
                    <p className="mt-6 font-mono text-[48px] font-medium leading-none text-ink/8 dark:text-chalk/8 select-none">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                  </div>

                  {/* Right content column */}
                  <div className="md:col-span-3">
                    <h3 className="font-display text-xl font-semibold text-ink dark:text-chalk">
                      {item.role}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-ink/65 dark:text-chalk/60">
                      {item.organization}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {item.highlights.map((point) => (
                        <li key={point} className="flex gap-3 text-sm leading-relaxed text-ink/75 dark:text-chalk/75">
                          <span className="mt-2 h-px w-4 shrink-0 bg-ink/30 dark:bg-chalk/25" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    {item.award && (
                      <div className="mt-6 inline-flex items-center gap-2 bg-acid px-3 py-1.5">
                        <span className="font-mono text-[11px] font-medium text-ink">
                          ★ {item.award}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
