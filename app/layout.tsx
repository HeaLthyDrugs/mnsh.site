import "@/styles/globals.css";

import type { WebSite, WithContext } from "schema-dts";
import type { Metadata, Viewport } from "next";

import { META_THEME_COLORS, SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { fontDomaine, fontSFPro } from "@/lib/fonts";
import { Providers } from "@/components/providers";
import { DeferredGlobalUi } from "@/components/deferred-global-ui";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  title: {
    template: `%s – ${SITE_INFO.name}`,
    default: `${USER.displayName} – ${USER.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: "mnsh",
      url: SITE_INFO.url,
    },
  ],
  creator: "mnsh",
  openGraph: {
    siteName: SITE_INFO.name,
    url: "/",
    type: "profile",
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@iammnsh", // Twitter username
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      {
        url: "/logo/favicon.ico",
        sizes: "any",
      },
      {
        url: "/logo/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/logo/favicon-16x16.png",
        type: "image/png",
        sizes: "16x16",
      },
    ],
    apple: {
      url: "/logo/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};



export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
};


function getWebSiteJsonLd(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_INFO.name,
    url: SITE_INFO.url,
    alternateName: [USER.username],
  };
}


const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}

  try {
    if (/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) {
      document.documentElement.classList.add('os-macos')
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSFPro.variable} ${fontDomaine.variable}`}
      suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://assets.mnsh.online"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://assets.mnsh.online" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getWebSiteJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
      >
        <Providers>
          {children}
          <DeferredGlobalUi />
        </Providers>
      </body>
    </html>
  );
}
