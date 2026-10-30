// Text for the landing page. Edit freely; nothing here is imported by backend code.
export const profile = {
  headline:
    "Software developer building full-stack web applications with React, TypeScript and MongoDB.",
  // TODO: two or three sentences about you and what you are working toward.
  intro:
    "Replace this paragraph with a short introduction: who you are, what you build, and what kind of work you are looking for.",

  // Plain lists of technologies I have used. Projects are not split by category
  // because they are all part of the same growth as a developer.
  technologies: [
    {
      title: "Day to day",
      items: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Cypress", "MongoDB", "AWS", "Google OAuth"],
    },
    {
      title: "Project experience",
      items: ["React", "TypeScript", "JavaScript", "Node.js", "MongoDB", "HTML", "CSS", "Unity", "C#"],
    },
    {
      title: "Coursework",
      items: ["React", "Vite", "TypeScript", "JavaScript", "MongoDB", "SQL", "HTML", "CSS"],
    },
  ],
} as const;
