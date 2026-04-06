'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { siteConfig } from '@/data/siteData';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const observerOptions = useMemo(
    () => ({ root: null, rootMargin: '-40% 0px -45% 0px', threshold: 0.01 }),
    []
  );

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible?.target.id) {
        setActiveSection(visible.target.id);
      }
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [observerOptions]);

  const linkClass = (id: string) =>
    `rounded-full px-4 py-2.5 text-base font-medium tracking-wide transition-all duration-300 ${
      activeSection === id
        ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/30'
        : 'text-slate-200 hover:bg-blue-500/25 hover:text-blue-100 hover:shadow-md hover:shadow-blue-500/20'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl">
      <nav className="section-shell flex h-[4.5rem] items-center justify-between py-1" aria-label="Main navigation">
        <Link href="#home" className="text-sm font-semibold tracking-wide text-slate-100">
          {siteConfig.name}
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={linkClass(item.id)}>
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="rounded-lg border border-slate-700 p-2 text-slate-100 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </div>
        </button>
      </nav>

      {mobileOpen && (
        <div id="mobile-nav" className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="section-shell grid gap-1 py-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className={linkClass(item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
