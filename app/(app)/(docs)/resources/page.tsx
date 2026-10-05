import type { Metadata } from "next";
import { RESOURCES } from "@/features/resources/data/resources";
import { ResourcesContainer } from "@/features/resources/components/resources-container";
import { PageHeader } from "@/components/page-header";
import { SITE_INFO } from "@/config/site";

const TITLE = "Resources";
const DESCRIPTION =
    "Tools, software, and utilities I use to design, build, and ship.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    keywords: [
        "resources",
        "developer resources",
        "software I use",
        "developer tools",
        "productivity apps",
        "tech stack",
        "workflow",
        ...(SITE_INFO.keywords ?? []),
    ],
    alternates: {
        canonical: "/resources",
    },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE_INFO.url}/resources`,
        type: "website",
        images: [
            {
                url: SITE_INFO.ogImage,
                width: 1200,
                height: 630,
                alt: `${TITLE} | ${SITE_INFO.name}`,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: [SITE_INFO.ogImage],
    },
};

// Structured data so search engines understand this page as a curated list of software.
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE,
    description: DESCRIPTION,
    url: `${SITE_INFO.url}/resources`,
    mainEntity: {
        "@type": "ItemList",
        numberOfItems: RESOURCES.length,
        itemListElement: RESOURCES.map((resource, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "SoftwareApplication",
                name: resource.name,
                description: resource.description,
                url: resource.url,
                applicationCategory: resource.category,
            },
        })),
    },
};

export default function Page() {
    return (
        <div className="min-h-svh">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            <PageHeader title={TITLE} description={DESCRIPTION} />

            <div className="border-edge p-2">
                <ResourcesContainer resources={RESOURCES} />
            </div>

            <div className="h-4" />
        </div>
    );
}
