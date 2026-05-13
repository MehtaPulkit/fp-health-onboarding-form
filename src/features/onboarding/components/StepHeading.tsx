import { type RefObject } from "react";

type StepHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  headingRef?: RefObject<HTMLHeadingElement>;
};

export function StepHeading({ eyebrow, title, description, headingRef }: StepHeadingProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">{eyebrow}</p>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-2xl font-bold text-ink focus:outline-none sm:text-3xl"
      >
        {title}
      </h1>
      <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
    </div>
  );
}
