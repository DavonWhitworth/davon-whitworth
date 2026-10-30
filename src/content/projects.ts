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
  /** The app itself runs on this site at /<slug>. */
  hasApp?: boolean;
}

export const projects: readonly Project[] = [
  {
    slug: "studio-vault",
    title: "Studio Vault",
    // TODO: describe what Studio Vault does.
    summary: "My main day-to-day project. It runs on its own domain.",
    status: "external",
    stack: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Cypress", "MongoDB", "AWS", "Google OAuth"],
    // TODO: add the Studio Vault address, e.g. "https://studiovault.example".
    externalUrl: undefined,
  },
  {
    slug: "lyrics-per-minute",
    title: "Lyrics Per Minute",
    summary:
      "A previously hosted app that was shut down to save on operating costs. An archive page still shows the analysis it produced.",
    status: "archived",
    stack: ["React", "TypeScript", "JavaScript", "Node.js", "MongoDB", "HTML", "CSS"],
    // TODO: add the address of the archive page that is still up.
    externalUrl: undefined,
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
    slug: "reddit-content-viewer",
    title: "Reddit Content Viewer",
    summary:
      "Browse Reddit content using the public JSON data available on Reddit URLs.",
    status: "planned",
    stack: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    slug: "vocabulary-typing-test",
    title: "Vocabulary Typing Test",
    summary:
      "A frontend-only typing test built around vocabulary words. Being rebuilt for this site.",
    status: "planned",
    stack: ["JavaScript", "HTML", "CSS"],
  },
  {
    slug: "light-sight",
    title: "Light Sight",
    summary: "A small frontend application. Being rebuilt for this site.",
    status: "planned",
    stack: ["JavaScript", "HTML", "CSS"],
    hasApp: true,
  },
  {
    slug: "pop",
    title: "Pop",
    summary:
      "A game made with Unity. The browser build will be playable here on desktop.",
    status: "planned",
    stack: ["Unity", "C#"],
  },
  {
    slug: "2d-runner",
    title: "2D Runner",
    summary:
      "A 2D runner game made with Unity. The browser build will be playable here on desktop.",
    status: "planned",
    stack: ["Unity", "C#"],
  },
  {
    slug: "player-club-management",
    title: "Player Club Management",
    summary: "A university course project. It is no longer live.",
    status: "archived",
    stack: ["React", "Vite", "TypeScript", "JavaScript", "MongoDB", "HTML", "CSS"],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
