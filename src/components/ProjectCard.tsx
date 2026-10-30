import Link from "next/link";
import type { Project } from "@/content/projects";
import { StatusBadge } from "./StatusBadge";
import { TagList } from "./TagList";

// The whole card is clickable through the title link (see the ::after rule).
// Every card opens the project's documentation page.
const linkClass =
  "text-lg font-medium text-fg after:absolute after:inset-0 after:content-[''] group-hover:text-accent";

export function ProjectCard({ project }: { project: Project }) {
  const { slug, title, summary, status, stack } = project;

  return (
    <li className="group relative flex flex-col gap-3 rounded-card border border-border bg-surface p-5 transition-colors hover:bg-surface-2">
      <div className="flex items-start justify-between gap-3">
        <h3>
          <Link href={`/projects/${slug}`} className={linkClass}>
            {title}
          </Link>
        </h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-muted">{summary}</p>
      <TagList tags={stack} label={`${title} technologies`} />
    </li>
  );
}
