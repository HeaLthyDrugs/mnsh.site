export interface Resource {
    name: string;
    description: string;
    url: string;
    image?: string; // URL to favicon or image
    category: "Development" | "Design" | "Productivity" | "Utilities" | "Other";
    invertInDark?: boolean;
}

export const RESOURCES: Resource[] = [
    {
        name: "Antigravity",
        description: "My primary agentic AI for complex coding missions.",
        url: "https://antigravity.im",
        category: "Development",
        image: "https://assets.mnsh.site/icons/antigravity.png",
        invertInDark: false,
    },
    {
        name: "ChatGPT",
        description: "My daily conversational AI for brainstorming, research, and coding.",
        url: "https://chatgpt.com",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/openai.png",
        invertInDark: true,
    },
    {
        name: "Claude",
        description: "The best AI for long-context reasoning and writing.",
        url: "https://claude.ai",
        category: "Productivity",
        image: "https://assets.mnsh.site/icons/claude.png",
        invertInDark: false,
    },
    {
        name: "Cloudflare",
        description: "Global edge network, DNS, security, and serverless hosting.",
        url: "https://cloudflare.com",
        category: "Development",
        image: "/icons/cloudflare.svg",
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
        name: "OpenCode",
        description: "Open-source AI coding agent built for the terminal.",
        url: "https://opencode.ai",
        category: "Development",
        image: "/icons/opencode.svg",
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
];
