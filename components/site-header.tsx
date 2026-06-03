import dynamic from "next/dynamic";

import { DesktopNav } from "@/components/desktop-nav";
import { MAIN_NAV } from "@/config/site";

import { cn } from "@/lib/utils";

import { SiteHeaderWrapper } from "./site-header-wrapper";
import { HomeLink } from "@/components/home-link";
import { getAllBlogs } from "@/features/blog/lib/blogs";
import { getAllWorks } from "@/features/work/lib/works";

const CommandMenu = dynamic(() =>
  import("@/components/command-menu").then((mod) => mod.CommandMenu)
);

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav").then((mod) => mod.MobileNav)
);

export async function SiteHeader() {
  const blogs = getAllBlogs().map(({ slug, metadata }) => ({ slug, metadata, content: "" }));
  const works = getAllWorks().map(({ slug, metadata }) => ({ slug, metadata, content: "" }));

  return (
    <SiteHeaderWrapper
      className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
    >
      <div
        className={cn(
          "mx-auto flex h-12 items-center justify-between border-x border-t border-b border-border md:max-w-3xl",
          "transition-shadow duration-300",
          "[header[data-affix='true']_&]:shadow-[0_8px_16px_-8px_black]/8 dark:[header[data-affix='true']_&]:shadow-[0_8px_16px_-8px_black]/80"
        )}
        data-header-container
      >

        <div className="flex h-full w-[53px] shrink-0 items-center justify-center border-r border-border">
          <HomeLink />
        </div>

        <div className="flex-1" />

        <div className="hidden sm:flex h-full items-center border-l border-border">
          <DesktopNav items={MAIN_NAV.filter(item => !["Tools", "Gear"].includes(item.title))} />
        </div>

        <div className="flex h-full items-center border-border">
          <div className="hidden sm:flex h-full items-center px-4">
            <CommandMenu blogs={blogs} works={works} />
          </div>
          <div className="flex h-full w-12 items-center justify-center border-l border-border sm:hidden">
            <MobileNav items={MAIN_NAV} />
          </div>
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}
