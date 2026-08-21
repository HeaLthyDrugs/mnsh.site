export type Event = {
    /** Stable unique identifier (used as list key/anchor). */
    id: string;
    title: string;
    /**
     * Event date for display and sorting.
     * Use "DD.MM.YYYY" format.
     */
    date: string;
    /** Event location */
    location?: string;
    /** Event category/type */
    category: string;
    /** Optional description; Markdown and line breaks supported. */
    description?: string;
    /** Array of Youtube Video IDs for playlist support */
    youtubeVideoIds?: string[];
    /** Legacy parameter, kept for fallback */
    youtubeVideoId?: string;
    /** Enforces a specific mathematical aspect ratio on the bento (e.g. "16/9", "21/9", "9/16") */
    aspectRatio?: string;
    /** Event image URL (absolute or path under /public). */
    image?: string;
    /** Background image URL for the bento card */
    backgroundImage?: string;
    /** Event link (registration, details, etc.) */
    link?: string;
    /** Tags/topics for the event */
    tags?: string[];
    /** Size variant for bento grid layout
     * - xs: Extra small (1 col on all screens)
     * - small: Small (1 col, spans 1 row)
     * - medium: Medium (1 col on mobile, 1 col on desktop)
     * - large: Large (1 col on mobile, 2 cols on desktop)
     * - wide: Wide (1 col on mobile, 2 cols on md, 3 cols on lg)
     * - tall: Tall (1 col, spans 2 rows)
     * - xl: Extra large (spans 2 cols and 2 rows on desktop)
     * - hero: Hero size (spans 4 cols on desktop, 2 rows)
     */
    size?: 'xxs' | 'xs' | 'small' | 'medium' | 'large' | 'wide' | 'tall' | 'xl' | 'hero' | 'social' | 'video';
    /** Custom gradient overlay for background image (e.g., "from-blue-900/80 to-purple-900/80") */
    gradientOverlay?: string;
    /** Custom text color for title and content */
    textColor?: string;
    /** Whether to show the image in the card (if false, only background is used) */
    showImage?: boolean;
    /** Custom background color if no background image */
    backgroundColor?: string;
    /** Social icon path */
    icon?: string;
    /** Short tagline for social links */
    tagline?: string;
    /** Whether to show the glassmorphic action button */
    showActionButton?: boolean;
    /** Whether to show the title */
    showTitle?: boolean;
    /** Whether to show the background image in full size without blur/centered box */
    showImageFullSize?: boolean;
    /** Social handle/username to display on the card */
    username?: string;
};
