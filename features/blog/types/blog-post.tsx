export type BlogMetadata = {
    /** Blog post title */
    title: string;
    /** Blog post description/excerpt */
    description: string;
    /**
     * Explicit SEO keywords for the blog post.
     */
    keywords?: string[];
    /**
     * Social/OG image URL for the blog post.
     * Use an absolute URL or a path under /public. Recommended size: 1200x630.
     */
    image?: string;
    /**
     * Category identifier/slug used for filtering (e.g., "technology", "design", "thoughts").
     */
    category?: string;
    /**
     * Tags for the blog post used for filtering and SEO.
     */
    tags?: string[];
    /**
     * Flag to show a "New" badge/highlight in the UI.
     */
    new?: boolean;
    /**
     * Blog post creation/publish date as an ISO date string (e.g. YYYY-MM-DD). Used for sorting.
     */
    createdAt: string;
    /**
     * Last updated date as an ISO date string (e.g. YYYY-MM-DD).
     */
    updatedAt: string;
    /**
     * Author name. Defaults to site owner if not specified.
     */
    author?: string;
    /**
     * Estimated read time in minutes.
     */
    readTime?: number;
    /**
     * Featured flag for highlighting on homepage/listings.
     */
    featured?: boolean;
};

export type BlogPost = {
    /** Parsed frontmatter metadata from the MDX file. */
    metadata: BlogMetadata;
    /** Slug derived from the MDX filename (without extension). */
    slug: string;
    /** MDX content body without frontmatter. */
    content: string;
};
