import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { TagList } from "@/components/TagList";
import { getProject, projects } from "@/content/projects";
import { getDoc } from "@/server/docs";

// A project's page is its documentation page: /projects/<slug>.
// The app itself (when it runs on this site) lives at /<slug>.
type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const doc = await getDoc(slug);
  return {
    title: project.title,
    description: doc?.description ?? project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    // Placeholder pages stay out of search results until the project is real.
    robots: project.status === "planned" ? { index: false } : undefined,
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

const actionClass =
  "rounded-lg border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface-2";

export default async function ProjectPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const doc = await getDoc(project.slug);

  return (
    <>
      <Link href="/#projects" className="text-sm text-muted hover:text-fg">
        &larr; All projects
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-fg">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>

        <p className="mt-4 max-w-2xl text-muted">{project.summary}</p>

        {doc?.updated ? (
          <p className="mt-2 text-sm text-muted">
            Documentation last updated {formatDate(doc.updated)}
          </p>
        ) : null}

        <div className="mt-6">
          <TagList tags={project.stack} label="Technologies" />
        </div>

        {project.externalUrl || project.hasApp ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.externalUrl ? (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={actionClass}
              >
                {project.status === "archived"
                  ? "View archive page"
                  : `Visit ${project.title}`}
                <span aria-hidden="true"> &#8599;</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : null}

            {project.hasApp ? (
              <Link href={`/${project.slug}`} className={actionClass}>
                Open app
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      {doc && doc.headings.length >= 3 ? (
        <nav
          aria-label="On this page"
          className="mt-10 rounded-card border border-border bg-surface p-5"
        >
          <p className="text-sm font-medium text-fg">On this page</p>
          <ul className="mt-3 space-y-1 text-sm">
            {doc.headings.map((heading) => (
              <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}>
                <a href={`#${heading.id}`} className="text-muted hover:text-accent">
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {doc ? (
        <article
          className="prose docs-prose mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      ) : null}

      {project.status === "planned" ? (
        <p className="mt-10 text-sm text-muted">
          This project is still being rebuilt for this site.
        </p>
      ) : null}

      {!doc ? (
        <p className="mt-3 text-sm text-muted">
          Documentation for this project has not been written yet.
        </p>
      ) : null}
    </>
  );
}
