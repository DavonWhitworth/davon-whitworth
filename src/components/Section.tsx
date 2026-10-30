import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="mt-20 scroll-mt-8">
      <h2 id={headingId} className="text-2xl font-semibold text-fg">
        {title}
      </h2>
      <div className="mt-4 space-y-6">{children}</div>
    </section>
  );
}
