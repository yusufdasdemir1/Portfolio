import { ReactNode } from 'react';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-400">{eyebrow}</p>
      <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">{title}</h2>
      {description ? <div className="max-w-3xl text-slate-300">{description}</div> : null}
    </div>
  );
}
