import type { ProjectStatus } from "@/content/projects";

// Full class names are written out so Tailwind can detect them at build time.
const styles: Record<ProjectStatus, { label: string; className: string }> = {
  live: {
    label: "Live",
    className: "border-status-live/40 text-status-live",
  },
  external: {
    label: "Live on its own site",
    className: "border-status-external/40 text-status-external",
  },
  archived: {
    label: "Archived",
    className: "border-status-archived/40 text-status-archived",
  },
  planned: {
    label: "Coming soon",
    className: "border-status-planned/40 text-status-planned",
  },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = styles[status];
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
