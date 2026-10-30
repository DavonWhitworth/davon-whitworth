import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | ${site.role}`,
    description: site.description,
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c1c1c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
