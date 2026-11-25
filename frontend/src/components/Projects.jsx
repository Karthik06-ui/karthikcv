import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";

export default function Projects() {
  const { projects } = portfolioData;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
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
            <span className="section-label">04</span>
            <h2 id="projects-heading" className="font-display text-xs font-semibold uppercase tracking-widest2 text-ink/60 dark:text-chalk/50">
              Projects
            </h2>
          </div>

          {/* Project entries — numbered list */}
          <ol className="mt-0 divide-y divide-ink/15 dark:divide-chalk/15">
            {projects.map((project, idx) => {
              const hasGithub = Boolean(project.githubUrl?.trim());
              const hasLive   = Boolean(project.liveUrl?.trim());

              return (
                <li key={project.id} className="group">
                  <div className="grid gap-6 py-10 md:grid-cols-5 md:gap-10">
                    {/* Number + stack */}
                    <div className="flex flex-row items-start gap-6 md:col-span-2 md:flex-col md:gap-0">
                      <span className="font-mono text-[48px] font-medium leading-none text-ink/8 dark:text-chalk/13 select-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="mt-auto md:mt-6">
                        <ul className="flex flex-wrap gap-1.5" aria-label={`${project.title} stack`}>
                          {project.stack.map((tech) => (
                            <li
                              key={tech}
                              className="border border-ink/20 px-2 py-0.5 font-mono text-[10px] text-ink/65 dark:border-chalk/15 dark:text-chalk/55"
                            >
                              {tech}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                      <div className="flex flex-wrap items-baseline gap-3">
                        <h3 className="font-display text-2xl font-semibold text-ink dark:text-chalk">
                          {project.title}
                        </h3>
                        <span className="font-mono text-xs text-ink/55 dark:text-chalk/45">
                          — {project.subtitle}
                        </span>
                      </div>

                      <p className="mt-4 font-sans text-sm leading-relaxed text-ink/70 dark:text-chalk/65">
                        {project.description}
                      </p>

                      {/* Metrics — inline strip */}
                      {project.metrics.length > 0 && (
                        <ul
                          className="mt-5 flex flex-wrap gap-x-6 gap-y-1"
                          aria-label={`${project.title} metrics`}
                        >
                          {project.metrics.map((m) => (
                            <li key={m} className="flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-acid" aria-hidden="true" />
                              <span className="font-mono text-xs font-medium text-ink/85 dark:text-chalk/85">
                                {m}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Links */}
                      {(hasGithub || hasLive) && (
                        <div className="mt-6 flex gap-5">
                          {hasGithub && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/65 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
                            >
                              Source ↗
                            </a>
                          )}
                          {hasLive && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-acid"
                            >
                              Live ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
