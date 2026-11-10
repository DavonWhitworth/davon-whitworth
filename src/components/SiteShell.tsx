import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

// The standard page frame: header, centered content column and footer.
// Used by the (site) route group and by the 404 page. Apps that need the whole
// screen (see src/app/(apps)) skip it.
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
