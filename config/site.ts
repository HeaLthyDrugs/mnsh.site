import { USER } from "@/features/profile/data/user";
import { NavItem } from "@/types/nav";
;

function normalizeSiteUrl(url: string) {
  const parsedUrl = new URL(url);

  // Keep a single canonical host to avoid crawler redirect ambiguity.
  if (parsedUrl.hostname === "mnsh.site") {
    parsedUrl.hostname = "www.mnsh.site";
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

const FALLBACK_SITE_URL = "https://www.mnsh.site";
const RESOLVED_SITE_URL = normalizeSiteUrl(process.env.APP_URL || FALLBACK_SITE_URL);
const DEFAULT_OG_IMAGE_PATH = "/og/og-main.png";

export const SITE_INFO = {
  name: USER.displayName,
  url: RESOLVED_SITE_URL,
  ogImage: `${RESOLVED_SITE_URL}${DEFAULT_OG_IMAGE_PATH}`,
  description: USER.bio,
  keywords: USER.keywords,
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const MAIN_NAV: NavItem[] = [
  {
    title: "Me",
    href: "/",
    shortcut: "M",
    description: "Go to Home page",
  },
  {
    title: "Works",
    href: "/work",
    shortcut: "W",
    description: "View my works",
  },
  {
    title: "Blog",
    href: "/blog",
    shortcut: "B",
    description: "Read my thoughts",
  },
  {
    title: "Snaps",
    href: "/snaps",
    shortcut: "S",
    description: "Photos I have clicked or love",
  },
  {
    title: "Tools",
    href: "/tools",
    shortcut: "T",
    description: "Tools I use",
  },
  {
    title: "Gear",
    href: "/gear",
    shortcut: "G",
    description: "My setup & gear",
  },
];

export const GITHUB_USERNAME = "HeaLthyDrugs";
export const SOURCE_CODE_GITHUB_REPO = "HeaLthyDrugs/mnsh.site";
export const SOURCE_CODE_GITHUB_URL = "https://github.com/HeaLthyDrugs/mnsh.site";

export const UTM_PARAMS = {
  utm_source: "mnsh.site",
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};
