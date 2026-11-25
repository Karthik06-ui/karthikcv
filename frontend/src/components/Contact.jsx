import { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "../data/portfolio";
import { submitContactMessage } from "../services/api";

const INITIAL = { name: "", email: "", subject: "", message: "", website: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (name.length < 2)   errors.name = "At least 2 characters required.";
  else if (name.length > 120) errors.name = "Max 120 characters.";
  if (!email)            errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";
  if (subject.length > 150) errors.subject = "Max 150 characters.";
  if (message.length < 10)  errors.message = "At least 10 characters required.";
  else if (message.length > 2000) errors.message = "Max 2000 characters.";
  return errors;
}

/* Bare input row — bottom-border only, label above */
function Field({ id, label, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[11px] tracking-widest2 uppercase text-ink/50 dark:text-chalk/55">
        {label}{required && <span className="ml-1 text-acid">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-mono text-[11px] text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border-0 border-b border-ink/20 bg-transparent py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/25 focus:border-acid dark:border-chalk/25 dark:text-chalk dark:placeholder:text-chalk/25 dark:focus:border-acid";

export default function Contact() {
  const { profile, socials } = portfolioData;
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const submit = async (e) => {
    e.preventDefault();
    setFeedback(null);
    const errs = validateContactForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await submitContactMessage({
        name: form.name.trim(), email: form.email.trim(),
        subject: form.subject.trim(), message: form.message.trim(),
        website: form.website,
      });
      setFeedback({ ok: true, text: data?.message || "Message sent." });
      setForm(INITIAL); setErrors({});
    } catch (err) {
      const status = err?.response?.status;
      const body   = err?.response?.data;
      if (status === 429) {
        setFeedback({ ok: false, text: "Too many submissions — please wait an hour and try again." });
      } else if (status === 400 && body && typeof body === "object") {
        const fe = {};
        ["name","email","subject","message"].forEach((f) => {
          if (Array.isArray(body[f]) && body[f][0]) fe[f] = body[f][0];
        });
        if (Object.keys(fe).length) setErrors(fe);
        setFeedback({ ok: false, text: "Please fix the highlighted fields." });
      } else {
        setFeedback({ ok: false, text: "Unable to send right now. Please try again or email directly." });
      }
    } finally {
      setLoading(false);
    }
  };

  const msgLen = form.message.trim().length;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-ink/10 dark:border-chalk/15"
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="flex items-baseline gap-5 pb-8 border-b border-ink/10 dark:border-chalk/15">
            <span className="section-label">05</span>
            <h2 id="contact-heading" className="font-display text-xs font-semibold uppercase tracking-widest2 text-ink/40 dark:text-chalk/45">
              Connect
            </h2>
          </div>

          <div className="mt-10 grid gap-14 md:grid-cols-5">
            {/* Left — info */}
            <div className="md:col-span-2 space-y-8">
              <p className="font-sans text-base leading-relaxed text-ink/60 dark:text-chalk/65">
                Seeking Backend and LLM Engineering internships. Send a message or connect directly below.
              </p>

              <div className="space-y-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="link-draw block font-mono text-xs text-ink/60 transition-colors hover:text-ink dark:text-chalk/65 dark:hover:text-chalk"
                >
                  {profile.email}
                </a>
                <p className="font-mono text-[11px] text-ink/40 dark:text-chalk/45">
                  {profile.location}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={socials.github.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/50 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
                >
                  GitHub ↗
                </a>
                <a
                  href={socials.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw font-mono text-[11px] tracking-widest2 uppercase text-ink/50 transition-colors hover:text-ink dark:text-chalk/55 dark:hover:text-chalk"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>

            {/* Right — form */}
            <form
              onSubmit={submit}
              noValidate
              aria-label="Contact form"
              className="md:col-span-3 space-y-7"
            >
              {/* Honeypot — hidden from humans */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website-trap">Website</label>
                <input id="website-trap" name="website" type="text" tabIndex={-1} autoComplete="off"
                  value={form.website} onChange={change} />
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="contact-name" label="Name" error={errors.name} required>
                  <input
                    id="contact-name" name="name" type="text" required autoComplete="name"
                    value={form.name} onChange={change} placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "contact-name-error" : undefined}
                    className={inputClass}
                  />
                </Field>
                <Field id="contact-email" label="Email" error={errors.email} required>
                  <input
                    id="contact-email" name="email" type="email" required autoComplete="email"
                    value={form.email} onChange={change} placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "contact-email-error" : undefined}
                    className={inputClass}
                  />
                </Field>
              </div>

              <Field id="contact-subject" label="Subject" error={errors.subject}>
                <input
                  id="contact-subject" name="subject" type="text"
                  value={form.subject} onChange={change}
                  placeholder="Internship inquiry, collaboration…"
                  className={inputClass}
                />
              </Field>

              <Field id="contact-message" label="Message" error={errors.message} required>
                <div className="relative">
                  <textarea
                    id="contact-message" name="message" rows={5} required
                    value={form.message} onChange={change}
                    placeholder="Your message (10–2000 characters)"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    className={`${inputClass} resize-none`}
                  />
                  <span className="absolute bottom-2.5 right-0 font-mono text-[10px] text-ink/25 dark:text-chalk/30">
                    {msgLen}/2000
                  </span>
                </div>
              </Field>

              {feedback && (
                <div
                  role={feedback.ok ? "status" : "alert"}
                  className={`border-l-2 pl-4 font-mono text-[12px] ${
                    feedback.ok
                      ? "border-acid text-ink/70 dark:text-chalk/75"
                      : "border-red-500 text-red-500 dark:text-red-400"
                  }`}
                >
                  {feedback.text}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center gap-3 border border-ink/20 px-6 py-3 font-mono text-xs font-medium tracking-widest2 uppercase text-ink transition-all hover:border-acid hover:bg-acid hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 dark:border-chalk/25 dark:text-chalk dark:hover:border-acid dark:hover:bg-acid dark:hover:text-ink"
                >
                  {loading ? "Sending…" : "Send Message"}
                  {!loading && (
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
