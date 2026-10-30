import Link from "next/link";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-medium text-fg hover:text-accent">
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-6 text-sm text-muted">
            <li>
              <Link href="/#projects" className="hover:text-fg">
                Projects
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:text-fg">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
