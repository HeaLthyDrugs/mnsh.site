import dayjs from "dayjs";
import type { Metadata } from "next";
import type { ProfilePage as PageSchema, WithContext } from "schema-dts";
import { SITE_INFO } from "@/config/site";
import { USER } from "@/features/profile/data/user";
import { cn } from "@/lib/utils";

// import AnimatedScene from "@/features/scene/page";
import ProfileHeader from "@/features/profile/components/profile-header";
import Work from "@/features/profile/components/work";
import { Overview } from "@/features/profile/overview";
import { DeferredEvents } from "@/features/profile/events/deferred-events";
import Faq from "@/features/profile/faq";
import AnimatedScene from "@/features/Scene/page";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: SITE_INFO.url,
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto md:max-w-3xl">
        {/* Animated Scene  */}
        <AnimatedScene />

        {/* Profile Header  */}
        <ProfileHeader />
        <Separator />

        {/* Overview  */}
        <Overview />
        <Separator />
        {/* Work I have done  */}
        <Work />
        <Separator />
        {/* Services I provide  */}
        {/* <HowIWork />
        <Separator />

        <WhatIDo />
        <Separator /> */}

        {/* Events  */}
        <DeferredEvents />

        {/* FAQ  */}
        <Faq />
        <Separator />

        {/* Blog  */}
        {/* <Blog /> */}
      </div>
    </>
  );
}

function getPageJsonLd(): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    // dateCreated: dayjs(USER.dateCreated).toISOString(),
    dateModified: dayjs().toISOString(),
    mainEntity: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  };
}

function Separator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-x border-edge",
        "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}
