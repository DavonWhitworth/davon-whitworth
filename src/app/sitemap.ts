import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Planned projects are placeholders, so they stay out of the sitemap.
  // App pages (/<slug>) are not listed either: the documentation pages carry
  // the search value and the apps are marked noindex.
  const live = projects.filter((project) => project.status !== "planned");

  return [
    { url: `${site.url}/` },
    ...live.map((project) => ({ url: `${site.url}/projects/${project.slug}` })),
  ];
}
