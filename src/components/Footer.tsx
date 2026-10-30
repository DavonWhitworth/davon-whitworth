import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-muted">
        <p>
          &copy; {new Date().getFullYear()} {site.name}
        </p>
        <ul className="flex gap-6">
          <li>
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-fg"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
