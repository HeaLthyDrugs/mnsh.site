import { GEAR } from "@/features/gear/data/gear";
import { TOOLS } from "@/features/tools/data/tools";

export interface TerminalWork {
  slug: string;
  title: string;
  description: string;
  status: string;
  liveUrl?: string;
  repoUrl?: string;
  category: string;
  technologies: string[];
}

export interface TerminalBlog {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
  tags: string[];
  readTime: string;
}

export const TERMINAL_WORKS: TerminalWork[] = [
  {
    slug: "justwrite-notes",
    title: "JustWrite",
    description: "Offline-first local notepad designed for distraction-free markdown writing and instant drafting.",
    status: "Iterating",
    liveUrl: "https://justwrite.sbs",
    repoUrl: "https://github.com/anomalyco/justwrite",
    category: "Web Application",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "IndexedDB", "PWA"],
  },
  {
    slug: "leank-p2p-communication",
    title: "Leank.space",
    description: "Instant peer-to-peer encrypted chat and file transfer using WebRTC without backend servers or logins.",
    status: "Iterating",
    liveUrl: "https://leank.space",
    repoUrl: "https://github.com/HeaLthyDrugs/leank",
    category: "WebRTC P2P",
    technologies: ["WebRTC", "React", "TypeScript", "Socket.io", "TailwindCSS"],
  },
  {
    slug: "stenomitra-stenographer-typing-platform",
    title: "StenoMitra",
    description: "Digital stenography practice platform with live audio dictation, typing speed analysis, and progress leaderboards.",
    status: "Operational",
    liveUrl: "https://stenomitra.com",
    category: "EdTech Platform",
    technologies: ["Next.js", "Node.js", "PostgreSQL", "TailwindCSS"],
  },
  {
    slug: "sahyadri-hospitality-services",
    title: "SHS Admin Dashboard",
    description: "Comprehensive ERP & admin dashboard for invoice creation, participant management, and reporting for Sahyadri Hospitality.",
    status: "Operational",
    category: "Enterprise Dashboard",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "TailwindCSS"],
  },
  {
    slug: "fixmyimport",
    title: "Fixmyimport",
    description: "A website where users can preview, validate, and fix their CSV files and access various data tools.",
    status: "In Development",
    category: "Web Application",
    technologies: ["Next.js", "TypeScript", "TailwindCSS", "CSV Parser"],
  },
  {
    slug: "cbse-10th-question-bank",
    title: "CBSE 10th Question Bank",
    description: "Mobile app for CBSE 10th grade students providing study material, mock test engine, and bookmarking features.",
    status: "Operational",
    liveUrl: "https://play.google.com/store/apps/details?id=com.testverse.cbsequestionbank",
    category: "Mobile Application",
    technologies: ["React Native", "Expo", "Redux Toolkit", "Node.js"],
  },
];

export const TERMINAL_BLOGS: TerminalBlog[] = [
  {
    slug: "migrating-nextjs-project-to-astrojs",
    title: "Migrating Next.js Project to Astro.js",
    description: "Step-by-step performance optimizations and architectural shifts when moving a content-heavy app from Next.js to Astro.",
    createdAt: "2025-01-15",
    category: "Web Dev",
    tags: ["Next.js", "Astro", "Performance", "Frontend"],
    readTime: "6 min",
  },
  {
    slug: "recreate-petr-knolls-glass-button-in-nextjs-and-astro",
    title: "Recreating Petr Knoll's Glass Button",
    description: "Detailed breakdown of building a high-end glassmorphism interactive button with smooth hover shaders in Next.js & Astro.",
    createdAt: "2024-12-10",
    category: "UI Design",
    tags: ["CSS", "Framer Motion", "TailwindCSS", "Glassmorphism"],
    readTime: "5 min",
  },
  {
    slug: "how-to-dockerize-any-app",
    title: "How to Dockerize Any App",
    description: "Comprehensive guide to writing production-ready multi-stage Dockerfiles for Node.js, Next.js, and static web apps.",
    createdAt: "2024-11-20",
    category: "DevOps",
    tags: ["Docker", "DevOps", "Node.js", "Deployment"],
    readTime: "8 min",
  },
  {
    slug: "how-to-deploy-nextjs-on-cloudflare-workers",
    title: "How to Deploy Next.js on Cloudflare Workers",
    description: "Leveraging OpenNext and Cloudflare Workers for zero-cold-start global edge deployment of Next.js apps.",
    createdAt: "2024-10-05",
    category: "DevOps",
    tags: ["Next.js", "Cloudflare", "Edge", "Deployment"],
    readTime: "7 min",
  },
  {
    slug: "connect-mariadb-nextjs-prisma",
    title: "Connecting MariaDB with Next.js using Prisma",
    description: "Best practices for setting up schema migrations, connection pooling, and type safety with Prisma and MariaDB.",
    createdAt: "2024-09-12",
    category: "Database",
    tags: ["Next.js", "MariaDB", "Prisma", "SQL"],
    readTime: "4 min",
  },
  {
    slug: "seo-routes",
    title: "SEO Routes and Dynamic Sitemap Best Practices",
    description: "Structuring canonical URLs, sitemaps, and robots.txt in modern Next.js App Router applications.",
    createdAt: "2024-08-18",
    category: "SEO",
    tags: ["Next.js", "SEO", "MetaData", "AppRouter"],
    readTime: "5 min",
  },
  {
    slug: "lifelog",
    title: "Personal Life Log & Milestones",
    description: "A growing document detailing key life events, software engineering learnings, hackathon wins, and future goals.",
    createdAt: "2024-01-01",
    category: "Personal",
    tags: ["Life", "Career", "Hackathons", "Reflection"],
    readTime: "10 min",
  },
];

export { GEAR, TOOLS };
