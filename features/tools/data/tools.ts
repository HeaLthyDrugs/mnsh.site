
export interface Tool {
    name: string;
    description: string;
    url: string;
    image?: string; // URL to favicon or image
    category: "Development" | "Design" | "Productivity" | "Utilities" | "Other";
    invertInDark?: boolean;
}

export const TOOLS: Tool[] = [
    {
        name: "Antigravity",
        description: "My primary agentic AI for complex coding missions.",
        url: "https://antigravity.im",
        category: "Development",
        image: "https://assets.mnsh.site/icons/antigravity.png",
        invertInDark: false,
    },
    {
        name: "Appwrite",
        description: "Handles my backend and auth so I don't have to.",
        url: "https://appwrite.io",
        category: "Development",
        image: "https://assets.mnsh.site/icons/appwrite.png",
    },
    // {
    //     name: "Atlas",
    //     description: "Scalable and reliable database for all my production data.",
    //     url: "https://www.mongodb.com/atlas",
    //     category: "Development",
    //     image: "https://assets.mnsh.site/icons/atlas.png",
    // },
    {
        name: "Claude",
        description: "The best AI for long-context reasoning and writing.",
        url: "https://claude.ai",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/claude.png",
        invertInDark: false,
    },
    {
        name: "Codex",
        description: "Helps me explore and build on existing codebases.",
        url: "https://openai.com/codex",
        category: "Development",
        image: "https://assets.mnsh.site/icons/codex.png",
        invertInDark: false,
    },
    {
        name: "Cursor",
        description: "My main code editor for AI-native pair programming.",
        url: "https://cursor.com",
        category: "Development",
        image: "https://assets.mnsh.site/icons/cursor.png",
        invertInDark: true,
    },
    {
        name: "Expo",
        description: "Enables me to ship native apps with just React.",
        url: "https://expo.dev",
        category: "Development",
        image: "https://assets.mnsh.site/icons/expo.png",
        invertInDark: true,
    },
    {
        name: "Figma",
        description: "Where I brainstorm and polish every pixel of my designs.",
        url: "https://www.figma.com/",
        category: "Design",
        image: "https://assets.mnsh.site/icons/figma.png",
    },
    {
        name: "Firebase",
        description: "Go-to for quick prototyping and real-time features.",
        url: "https://firebase.google.com/",
        category: "Development",
        image: "https://assets.mnsh.site/icons/firebase.png",
    },
    {
        name: "Gemini",
        description: "My assistant for creative ideas and Google ecosystem tasks.",
        url: "https://gemini.google.com",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/gemini.png",
    },
    {
        name: "Google Cloud",
        description: "Infrastructure for my heavy-duty cloud deployments.",
        url: "https://cloud.google.com",
        category: "Development",
        image: "https://assets.mnsh.site/icons/googlecloud.png",
    },
    {
        name: "Grok",
        description: "Fastest way to get real-time info and trending insights.",
        url: "https://x.ai",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/grok.png",
        invertInDark: true,
    },
    {
        name: "Notion",
        description: "The brain of my projects for notes and documentation.",
        url: "https://www.notion.so/",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/notion.png",
        invertInDark: true,
    },
    {
        name: "OpenAI",
        description: "Powers my most advanced AI integrations and tools.",
        url: "https://openai.com",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/openai.png",
        invertInDark: true,
    },
    {
        name: "PostSpark",
        description: "Creating consistent and beautiful visuals for my posts.",
        url: "https://postspark.app",
        category: "Design",
        image: "https://assets.mnsh.site/icons/postspark.png",
        invertInDark: false,
    },
    {
        name: "React",
        description: "The foundation for everything I build on the web.",
        url: "https://react.dev",
        category: "Development",
        image: "https://assets.mnsh.site/icons/react.png",
    },
    {
        name: "Sentry",
        description: "Keeps me informed about errors before users even notice.",
        url: "https://sentry.io",
        category: "Development",
        image: "https://assets.mnsh.site/icons/sentry.png",
        invertInDark: true,
    },
    {
        name: "Spotify",
        description: "Fueling my deep work sessions with perfect playlists.",
        url: "https://spotify.com",
        category: "Other",
        image: "https://assets.mnsh.site/icons/spotify.png",
    },
    {
        name: "Supabase",
        description: "The Postgres backend I use for almost every new project.",
        url: "https://supabase.com",
        category: "Development",
        image: "https://assets.mnsh.site/icons/supabase.png",
    },
    {
        name: "Trae",
        description: "Adaptive AI IDE I use for high-speed development experiments.",
        url: "https://trae.ai",
        category: "Development",
        image: "https://assets.mnsh.site/icons/trae.png",
        invertInDark: false,
    }
];
