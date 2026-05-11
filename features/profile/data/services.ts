import { Service } from "../types/services";

export const SERVICES: Service[] = [
  {
    id: "web-applications",
    title: "Web Applications",
    period: {
      start: "2021",
    },
    link: "https://mnsh.online/work",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
    description:
      "I build fast, scalable web apps with a strong focus on UX, performance, and maintainable architecture.",
    isExpanded: true,
  },
  {
    id: "mobile-applications",
    title: "Mobile Applications",
    period: {
      start: "2022",
    },
    link: "https://mnsh.online/work",
    skills: ["React Native", "Expo", "Firebase", "Supabase"],
    description:
      "I ship mobile-first product experiences with production-ready architecture and smooth, reliable flows.",
  },
  {
    id: "product-engineering",
    title: "Product Engineering",
    period: {
      start: "2023",
    },
    link: "https://mnsh.online/work",
    skills: ["Architecture", "Automation", "APIs", "Performance", "SEO"],
    description:
      "From idea to launch, I help turn product requirements into polished software that is stable and easy to evolve.",
  },
];
