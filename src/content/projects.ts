// Single source of truth for every project. The landing page grid, the
// /projects/<slug> pages and the sitemap are all generated from this list.
//
// URL rule:
//   /projects/<slug>   documentation page (every project has one)
//   /<slug>            the app itself, for projects that run on this site
//                      (set hasApp: true and add src/app/(apps)/<slug>)
//
// Projects on their own domain set externalUrl. Their documentation page shows
// a "Visit site" button that opens it in a new tab.
//
// The order of this list is the order of the grid on the landing page.
// To add documentation, create src/content/docs/<slug>.md.

export type ProjectStatus =
  | "live" //     runs on this site
  | "external" // runs on its own domain
  | "archived" // no longer running (may still have an archive page)
  | "planned"; //  will be added to this site

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  stack: string[];
  /**
   * Address of the project on its own domain (or of an archive page that still
   * exists elsewhere). The project page shows a button that opens it in a new tab.
   */
  externalUrl?: string;
  /** Text of the button that opens externalUrl, e.g. "Go To Studio Vault". */
  externalLabel?: string;
  /** The app itself runs on this site at /<slug>. */
  hasApp?: boolean;
}

export const projects: readonly Project[] = [
  {
    slug: "studio-vault",
    title: "Studio Vault",
    // TODO: describe what Studio Vault does.
    summary: "Studio Vault is a cloud-based music production service that allows you to organize, save versions, and collaborate with others on music projects across multiple digital audio workstations. It also has supports further collaboration with a kanban board and a free market for creator to share free to use blueprints.",
    status: "external",
    stack: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Cypress", "MongoDB", "AWS", "Google OAuth"],
    externalUrl: "https://studiovaultbeta.com/login",
    externalLabel: "Go To Studio Vault",
  },
  {
    slug: "lyrics-per-minute",
    title: "Lyrics Per Minute",
    summary:
      "A previously hosted app that was shut down to save on operating costs. An archive page still shows the analysis it produced.",
    status: "archived",
    stack: ["React", "TypeScript", "JavaScript", "Node.js", "MongoDB", "HTML", "CSS"],
    externalUrl: "https://lyricsperminute.com/",
    externalLabel: "Go To Lyrics Per Minute",
  },
  {
    slug: "kb-jewels",
    title: "KB Jewels",
    summary:
      "A jewelry site I built for a friend's company. It is currently offline.",
    status: "archived",
    stack: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    slug: "player-club-management",
    title: "Player Club Management",
    summary: "A university course project. It is no longer live.",
    status: "archived",
    stack: ["React", "Vite", "TypeScript", "JavaScript", "Node.js", "Express", "Firebase", "MongoDB", "HTML", "CSS"],
  },
  {
    slug: "pop",
    title: "Pop",
    summary:
      "A top-down arcade shooter made with Unity and C#. Playable right here on this site, on desktop.",
    status: "live",
    stack: ["Unity", "C#"],
    hasApp: true,
  },
  {
    slug: "2d-runner",
    title: "2D Runner",
    summary:
      "A 2D game made with Unity and C#. Playable right here on this site, on desktop.",
    status: "live",
    stack: ["Unity", "C#"],
    hasApp: true,
  },
  {
    slug: "reddit-content-viewer",
    title: "Reddit Content Viewer",
    summary:
      "A custom Reddit browsing interface built on the public JSON data available on Reddit URLs. It no longer works: Reddit's new rules no longer allow unauthenticated access to that data.",
    status: "archived",
    stack: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    slug: "vocabulary-typing-test",
    title: "Vocabulary Typing Test",
    summary:
      "Type out dictionary definitions and see your words per minute. Runs right here on this site.",
    status: "live",
    stack: ["JavaScript", "HTML", "CSS"],
    hasApp: true,
  },
  {
    slug: "light-sight",
    title: "Light Sight",
    summary:
      "Turns your screen into a simple colored light. Runs right here on this site.",
    status: "live",
    stack: ["JavaScript", "HTML", "CSS"],
    hasApp: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
