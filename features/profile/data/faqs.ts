import { Faq } from "../types/faq";

export const FAQS: Faq[] = [
    {
        id: "no-spec",
        question: "I have an idea but no detailed spec. Can we still start?",
        answer: `Honestly, that's how most good projects begin. Bring the rough idea, a napkin sketch, or even a voice note. In the first conversation, we'll figure out **who it's for, what the smallest useful version (MVP) looks like, and what can wait**. You don't need a 20-page document — just a problem worth solving.`,
        isExpanded: true,
    },
    {
        id: "pricing",
        question: "What does working with you actually cost?",
        answer: `No mystery pricing. Depending on your project and goals, I work in one of two ways:
- **Fixed scope** — clear deliverables, fixed price, agreed upfront.
- **Weekly sprint / retainer** — best for evolving products where priorities and scope shift quickly.

Share your idea and requirements, and I'll send a clear estimate within 24–48 hours. You always get the numbers *before* any work starts — no hidden surprises.`,
    },
    {
        id: "solo-vs-agency",
        question: "Why hire an independent engineer instead of an agency?",
        answer: `Because you talk directly to the person designing and writing the code. **No account managers, no game of telephone, no "let me check with the team."**

Design, frontend, backend, and deployment sit in one head. That means decisions happen in minutes instead of days, and nothing gets lost in handoffs. If a project ever needs specialized extra hands, I can pull in trusted collaborators, but your primary point of contact remains strictly me.`,
    },
    {
        id: "estimates",
        question: "How do you estimate time when 'this should be quick'?",
        answer: `Almost every project starts with that sentence — so I've learned to treat it with healthy respect.

I break the work down into small, shippable milestones, add realistic buffer for the parts that *look* simple (auth edge cases, payment gateways, permissions, responsive quirks), and give you a dependable range instead of a fake-precise date.

Rough guide:
- **Landing page / marketing site:** 1–2 weeks
- **MVP web or mobile app:** 3–6 weeks
- **Full-scale product:** 2–3+ months

You'll see real, testable progress every single week, not a big surprise at the very end.`,
    },
    {
        id: "ai-usage",
        question: "Do you use AI while building?",
        answer: `Yes, and I'm transparent about it. AI helps speed up boilerplate, test edge cases, and explore alternative implementations faster.

However, **system architecture, product decisions, UX craft, and every single line that ships are reviewed, understood, and owned by me**. You get the speed of modern workflows without messy "it works but nobody knows why" code.`,
    },
    {
        id: "saying-no",
        question: "Will you ever push back or tell me not to build something?",
        answer: `Yes, and clients usually consider that a superpower. If a requested feature adds heavy maintenance, bloats the product, or could be validated faster with a simpler alternative, I'll say so.

I'd much rather help you ship the *right* lean product on time than build bloated features that users never touch. The final call is always yours, but I'll make sure you have honest engineering insight.`,
    },
    {
        id: "invisible-details",
        question: "What do you obsess over that most people never notice?",
        answer: `The things that are only felt when they're *missing*:
- Loading, empty, and error states that actually look thoughtfully designed
- Keyboard navigation, accessibility, and clean focus rings
- Layouts that don't jitter or jump while images and fonts load
- Snappy interactions that perform smoothly even on mid-range phones or spotty connections
- Subtle sound effects, haptic feel, and animations that feel deliberate, not distracting

If your users never have to think about the plumbing, I did my job.`,
    },
    {
        id: "ownership-after-launch",
        question: "Who owns the code, and what happens after launch?",
        answer: `**You own 100% of everything**: source code, designs, and deployments. The repository is set up under your own GitHub/Vercel/cloud accounts from day one, so you are never locked in.

After launch, I provide documentation, a handover walkthrough, plus **30 days of free bug fixes and post-launch support** to ensure everything runs smoothly. Beyond that, I'm available for ongoing feature development or maintenance whenever you need.`,
    },
    {
        id: "first-message",
        question: "What should I include in my first message to you?",
        answer: `Just three simple points are plenty:
1. **What** you want to build or improve
2. **Who** it's for (target users / market)
3. **Timeline & budget** (even a ballpark range helps align scope)

I typically respond within 24 hours. I'm based in **India (IST)** and regularly sync across US, European, and APAC timezones for calls, paired with proactive async updates in between.`,
    },
    {
        id: "side-projects",
        question: "What are you building when you're not working with clients?",
        answer: `Currently building [Leank.space](https://leank.space) (aimed at making software development workflows easier) and [JustWrite.sbs](https://justwrite.sbs).

Shipping my own products means I deal with the real founder journey — product positioning, conversion, performance, user feedback, and edge cases. That hands-on product mindset directly benefits the projects I build for clients.`,
    },
    {
        id: "music",
        question: "What's that music playing on your site?",
        answer: `That's my actual focus playlist! You can toggle and browse tracks with the player right here on the site.

The rotation swings between *Kanye*, *Kendrick*, and *Doja Cat* to soulful Hindi classics by *Atif Aslam* and *Mohit Chauhan*. If our music taste aligns, our project vibe probably will too. 🎧`,
    },
];
