import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";

const LEVEL_DOT = {
  Proficient:    "bg-acid",
  Intermediate:  "bg-ink/55 dark:bg-chalk/45",
  Beginner:      "bg-ink/30 dark:bg-chalk/25",
  Exploring:     "bg-ink/30 dark:bg-chalk/25",
  Learning:      "bg-ink/30 dark:bg-chalk/25",
};

export default function Skills() {
  const { skillGroups } = portfolioData;

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-ink/15 dark:border-chalk/15"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="flex items-baseline gap-5 pb-8 border-b border-ink/15 dark:border-chalk/15">
            <span className="section-label">02</span>
            <h2 id="skills-heading" className="font-display text-xs font-semibold uppercase tracking-widest2 text-ink/60 dark:text-chalk/50">
              Skills
            </h2>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap items-center gap-5 pb-8 border-b border-ink/15 dark:border-chalk/15">
            {[
              { label: "Proficient",          dot: "bg-acid" },
              { label: "Intermediate",        dot: "bg-ink/55 dark:bg-chalk/45" },
              { label: "Beginner / Exploring", dot: "bg-ink/30 dark:bg-chalk/25" },
            ].map(({ label, dot }) => (
              <span key={label} className="flex items-center gap-2 font-mono text-[11px] text-ink/65 dark:text-chalk/50">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {label}
              </span>
            ))}
          </div>

          {/* Groups as horizontal rows */}
          <div className="mt-10 space-y-10">
            {skillGroups.map((group) => (
              <div key={group.category} className="grid gap-4 md:grid-cols-5">
                {/* Category label */}
                <div className="md:col-span-1">
                  <p className="section-label pt-1">{group.category}</p>
                </div>

                {/* Skills inline */}
                <ul className="flex flex-wrap gap-2 md:col-span-4" aria-label={group.category}>
                  {group.items.map((skill) => (
                    <li
                      key={skill.name}
                      className="flex items-center gap-2 border border-ink/20 px-3 py-1.5 dark:border-chalk/15"
                    >
                      <span className={`h-1 w-1 rounded-full ${LEVEL_DOT[skill.level]}`} aria-hidden="true" />
                      <span className="font-mono text-[12px] text-ink/85 dark:text-chalk/85">
                        {skill.name}
                      </span>
                      {(skill.level === "Exploring" || skill.level === "Learning") && (
                        <span className="font-mono text-[10px] text-ink/50 dark:text-chalk/40">
                          ({skill.level})
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
