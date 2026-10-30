import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ProjectList } from "@/components/ProjectList";
import { Section } from "@/components/Section";
import { TagList } from "@/components/TagList";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const buttonPrimary =
  "rounded-lg bg-accent px-5 py-2 font-medium text-accent-contrast transition-colors hover:bg-accent-strong";
const buttonSecondary =
  "rounded-lg border border-border px-5 py-2 font-medium text-fg transition-colors hover:bg-surface-2";

export default function HomePage() {
  // The resume link only shows once public/resume.pdf exists.
  const hasResume = existsSync(
    path.join(process.cwd(), "public", site.resumePath),
  );

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    sameAs: [site.social.github, site.social.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section aria-labelledby="intro-heading">
        <h1
          id="intro-heading"
          className="text-4xl font-semibold tracking-tight text-fg sm:text-5xl"
        >
          {site.name}
        </h1>
        <p className="mt-3 text-xl text-accent">{profile.headline}</p>
        <p className="mt-6 max-w-2xl text-muted">{profile.intro}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#projects" className={buttonPrimary}>
            View projects
          </Link>
          <Link href="/#contact" className={buttonSecondary}>
            Get in touch
          </Link>
          {hasResume ? (
            <a href={site.resumePath} download className={buttonSecondary}>
              Download resume
            </a>
          ) : null}
        </div>
      </section>

      <Section id="technologies" title="Technologies">
        <div className="space-y-6">
          {profile.technologies.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2 text-sm font-medium text-fg">
                {group.title}
              </h3>
              <TagList
                tags={group.items}
                label={`${group.title} technologies`}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section id="projects" title="Projects">
        <ProjectList projects={projects} />
      </Section>

      <Section id="contact" title="Contact">
        <p className="max-w-2xl text-muted">
          Send me a message and I will reply by email.
        </p>
        <div className="max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
