import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // geolocation is allowed for this origin only (used later by the tree map).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // There is no projects index page: the project grid lives on the home page.
    return [
      { source: "/projects", destination: "/#projects", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
