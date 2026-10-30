import type { Project } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectList({ projects }: { projects: readonly Project[] }) {
  if (projects.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </ul>
  );
}
