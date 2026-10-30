// Site-wide settings. Replace every TODO value before deploying.
export const site = {
  name: "Davon Austin Whitworth",
  role: "Software Developer",
  // TODO: one or two sentences used as the default meta description.
  description:
    "Portfolio of a software developer: projects, documentation and the stack I work with day to day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    // TODO: replace with your real profile URLs (or remove an entry).
    github: "https://github.com/DavonWhitworth",
    linkedin: "https://www.linkedin.com/in/davon-whitworth/",
  },
  // Put your resume at public/resume.pdf. The download link only appears
  // when that file exists.
  resumePath: "/resume.pdf",
} as const;
