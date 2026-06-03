import { Faq } from "../types/faq";

export const FAQS: Faq[] = [
    {
        id: "what-services",
        question: "What services do you offer?",
        answer: `I specialize in building modern web and mobile applications with a focus on:
- **Frontend Development** - React, Next.js, TypeScript
- **Mobile Development** - React Native, cross-platform apps
- **UI/UX Design** - Clean, intuitive interfaces
- **Full-Stack Solutions** - End-to-end product development`,
        isExpanded: true,
    },
    {
        id: "availability",
        question: "Are you available for freelance work?",
        answer: `Yes! I'm currently open for freelance projects. I work with startups, agencies, and businesses of all sizes. Whether you need a complete product build or help with a specific feature, I'd love to hear about your project.`,
    },
    {
        id: "working-process",
        question: "What's your typical working process?",
        answer: `My process is collaborative and transparent:

1. **Discovery** - Understanding your goals, requirements, and timeline
2. **Planning** - Creating a detailed roadmap and technical specifications
3. **Development** - Building in iterative sprints with regular updates
4. **Review & Refine** - Incorporating feedback and polishing the details
5. **Delivery** - Launching with documentation and support`,
    },
    {
        id: "timeline",
        question: "How long does a typical project take?",
        answer: `Timelines vary based on project scope:
- **Small projects** (landing pages, simple features): 1-2 weeks
- **Medium projects** (web apps, complex features): 4-8 weeks
- **Large projects** (full products, platforms): 2-4+ months

I'll provide a detailed estimate after understanding your specific requirements.`,
    },
    {
        id: "tech-stack",
        question: "What technologies do you work with?",
        answer: `My primary tech stack includes:
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo
- **Backend**: Node.js, Express, PostgreSQL, Supabase
- **Tools**: Git, Docker, Vercel, AWS

I'm always learning and adapting to use the best tools for each project.`,
    },
    {
        id: "communication",
        question: "How do you handle communication during projects?",
        answer: `Clear communication is essential for project success. I typically use:
- **Slack/Discord** for day-to-day updates and quick questions
- **Weekly video calls** for progress reviews and planning
- **Notion/Linear** for project tracking and documentation

I adapt to whatever workflow works best for you and your team.`,
    },
];
