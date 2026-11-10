export const site = {
  name: "Davon Austin Whitworth",
  role: "Software Developer",
  description:
    "Portfolio of a software developer: projects, documentation and the stack I work with day to day.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  social: {
    github: "https://github.com/DavonWhitworth",
    linkedin: "https://www.linkedin.com/in/davon-whitworth/",
  },
  resumePath: "/resume.pdf",
} as const;
