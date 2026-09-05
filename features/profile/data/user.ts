import { User } from "../types/user";

export const FACES = [
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(1).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(2).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(3).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(4).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(5).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(6).png",
    "https://assets.mnsh.site/icons/faces/my-notion-face-transparent%20(7).png",
];

export const USER: User = {
    firstName: "Manish",
    lastName: "Vishwakarma",
    fullName: "Manish Vishwakarma",
    displayName: "Manish",
    username: "HeaLthyDrugs",
    gender: "male",
    pronouns: "he/him",
    bio: "Building things for the internet",
    flipSentences: [
        "apps people actually enjoy using",
        "from clean interfaces to AWS infrastructure",
        "fast, resilient, and bloat-free",
        "tools designed for daily workflow",
        "with obsessive attention to detail",
        "across web, mobile, and the edge",
        "tested, monitored, and production-ready",
        "that feel fast and deliberate",
    ],
    address: "Lonavala City, Maharashtra, India",
    phoneNumber: "KzkxODQzMjU2MzIyNw==", // E.164 format, base64 encoded (+918432563227)
    email: "bWFuaXNodmlzaHdha2FybWE5OTYwQGdtYWlsLmNvbQ==", // base64 encoded (hey@mnsh.site)

    website: "https://mnsh.site",
    jobTitle: "Software Engineer",
    about: `I build things for the internet.

I've worked on client projects, personal products, apps, experiments, and an unhealthy number of ideas that started with *"this should be quick."*

I enjoy taking something from a rough idea to a real, usable product — figuring things out along the way and obsessing over the details that most people hopefully never have to think about.

I like things that are simple, useful, and well made.

Currently building [Leank.space](https://leank.space) & [JustWrite.sbs](https://justwrite.sbs), breaking things, fixing them, and occasionally remembering to ship them.`,
    avatar: "https://avatars.githubusercontent.com/u/122515021?v=4",
    ogImage:
        "https://assets.mnsh.site/og/og-main.png",
    keywords: [
        "manish",
        "mnsh",
        "manish vishwakarma",
        "mnshv",
        "mnsh.online",
        "healthydrugs",
        "healthydrug",
        "manish v",
        "vmanish",
        "Manish Vishwakarma",
    ],
    availabilityStatus: "available",
    availabilityText: "Open for freelance works",
    timezone: "Asia/Kolkata",
    localTimeLabel: "IST",
    currentlyBuilding: {
        name: "Leank.space",
        link: "https://leank.space",
        label: "to make software development easier",
    },
};
