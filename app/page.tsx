'use client';

import { useEffect, useMemo, useState } from 'react';
import { BackToTopButton } from '@/components/BackToTopButton';
import { ContactForm } from '@/components/ContactForm';
import { GithubIcon, LinkedInIcon } from '@/components/icons';
import { Navbar } from '@/components/Navbar';
import { SectionHeading } from '@/components/SectionHeading';
import { translations, type Locale, type Theme } from '@/data/i18n';
import { projects, siteConfig, skills, timeline } from '@/data/siteData';

const sectionClass = 'section-shell py-20 sm:py-24';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const storedLocale = window.localStorage.getItem('portfolio-locale') as Locale | null;
    const storedTheme = window.localStorage.getItem('portfolio-theme') as Theme | null;

    if (storedLocale === 'en' || storedLocale === 'tr') {
      setLocale(storedLocale);
    }

    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      document.documentElement.dataset.theme = storedTheme;
    } else {
      document.documentElement.dataset.theme = 'dark';
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('portfolio-locale', locale);
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const copy = useMemo(() => translations[locale], [locale]);

  return (
    <>
      <Navbar
        locale={locale}
        onLocaleToggle={() => setLocale((prev) => (prev === 'en' ? 'tr' : 'en'))}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      />
      <main id="home" className="relative overflow-x-clip pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid-dark bg-[size:32px_32px] opacity-40"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-220px] -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl"
        />

        <section className={`${sectionClass} pb-24 pt-24 sm:pb-28 sm:pt-32`}>
          <div className="max-w-4xl space-y-8">
            <p className="inline-flex rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
              {copy.hero.badge}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-50 sm:text-6xl">
              {siteConfig.name}
              <span className="mt-2 block text-xl font-medium text-brand-300 sm:text-3xl">{siteConfig.role}</span>
            </h1>
            <p className="max-w-3xl text-lg text-slate-300">{siteConfig.tagline}</p>

            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-400">
                {copy.hero.viewProjects}
              </a>
              <a href="#contact" className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500">
                {copy.hero.contactMe}
              </a>
              <a
                href={siteConfig.cvLink}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
              >
                {copy.hero.downloadCv}
              </a>
            </div>
          </div>
        </section>

        <section id="about" className={sectionClass}>
          <SectionHeading eyebrow={copy.sections.aboutEyebrow} title={copy.sections.aboutTitle} />
          <div className="card grid gap-6 p-6 sm:p-8">
            {siteConfig.bio.map((paragraph) => (
              <p key={paragraph} className="text-slate-300">
                {paragraph}
              </p>
            ))}
            <p className="text-sm text-slate-400">{copy.misc.location}: {siteConfig.location}</p>
          </div>
        </section>

        <section id="skills" className={sectionClass}>
          <SectionHeading
            eyebrow={copy.sections.skillsEyebrow}
            title={copy.sections.skillsTitle}
            description={copy.sections.skillsDescription}
          />
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skillGroup) => (
              <article key={skillGroup.category} className="card p-6">
                <h3 className="mb-4 text-lg font-semibold text-slate-100">{skillGroup.category}</h3>
                <ul className="flex flex-wrap gap-2">
                  {skillGroup.items.map((item) => (
                    <li key={item} className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-sm text-slate-200">
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className={sectionClass}>
          <SectionHeading
            eyebrow={copy.sections.projectsEyebrow}
            title={copy.sections.projectsTitle}
            description={copy.sections.projectsDescription}
          />
          {projects.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {projects.map((project) => (
                <article key={project.title} className="card group flex h-full flex-col p-6 hover:-translate-y-1 hover:shadow-glow">
                  <h3 className="text-xl font-semibold text-slate-100">{project.title}</h3>
                  <p className="mt-3 flex-1 text-slate-300">{project.description}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((stack) => (
                      <li key={stack} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                        {stack}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex gap-3 text-sm">
                    <a href={project.github} className="font-medium text-brand-300 transition hover:text-brand-200">
                      GitHub ↗
                    </a>
                    {project.demo ? (
                      <a href={project.demo} className="font-medium text-slate-300 transition hover:text-slate-100">
                        {copy.misc.liveDemo}
                      </a>
                    ) : (
                      <span className="text-slate-500">{copy.misc.liveDemoUnavailable}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card p-6 text-slate-300">{copy.sections.projectsEmpty}</div>
          )}
        </section>

        <section id="experience" className={sectionClass}>
          <SectionHeading
            eyebrow={copy.sections.experienceEyebrow}
            title={copy.sections.experienceTitle}
            description={copy.sections.experienceDescription}
          />
          <div className="relative ml-3 border-l border-slate-800 pl-8">
            {timeline.map((entry) => (
              <article key={`${entry.title}-${entry.period}`} className="relative mb-8 last:mb-0">
                <span className="absolute -left-[2.1rem] top-2 h-3.5 w-3.5 rounded-full border border-brand-400 bg-slate-950" />
                <div className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-100">{entry.title}</h3>
                    <p className="text-sm text-slate-400">{entry.period}</p>
                  </div>
                  <p className="mt-1 text-sm text-brand-300">{entry.organization}</p>
                  <p className="mt-3 text-slate-300">{entry.details}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className={sectionClass}>
          <SectionHeading
            eyebrow={copy.sections.contactEyebrow}
            title={copy.sections.contactTitle}
            description={copy.sections.contactDescription}
          />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <aside className="card space-y-5 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="mt-1 inline-block text-brand-300 hover:text-brand-200">
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{copy.misc.professionalLinks}</p>
                <div className="mt-3 flex items-center gap-4">
                  <a
                    href={siteConfig.socialLinks.github}
                    aria-label="GitHub"
                    className="rounded-lg border border-slate-700 p-2 text-slate-200 transition hover:border-brand-400 hover:text-brand-200"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </a>
                  <a
                    href={siteConfig.socialLinks.linkedin}
                    aria-label="LinkedIn"
                    className="rounded-lg border border-slate-700 p-2 text-slate-200 transition hover:border-brand-400 hover:text-brand-200"
                  >
                    <LinkedInIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-slate-400">{copy.misc.directCommunication}</p>
            </aside>
            <div className="card p-6">
              <ContactForm locale={locale} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8">
        <div className="section-shell flex flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>{copy.misc.footer}</p>
        </div>
      </footer>

      <BackToTopButton label={copy.misc.backToTop} />
    </>
  );
}
