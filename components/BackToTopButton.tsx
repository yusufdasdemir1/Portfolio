'use client';

import { useEffect, useState } from 'react';
import { ArrowUpIcon } from './icons';

type BackToTopButtonProps = {
  label?: string;
};

export function BackToTopButton({ label = 'Back to top' }: BackToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <a
      href="#home"
      aria-label={label}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 shadow-lg transition hover:border-brand-400 hover:text-brand-300"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </a>
  );
}
