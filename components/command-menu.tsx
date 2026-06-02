"use client";

import { useCommandState } from "cmdk";
import type { LucideProps } from "lucide-react";
import {
  BriefcaseBusinessIcon,
  CircleUserIcon,
  CornerDownLeftIcon,
  DownloadIcon,
  LetterTextIcon,
  MoonStarIcon,
  RssIcon,
  SunIcon,
  TextIcon,
  TriangleDashedIcon,
  TypeIcon,
  ArrowUpDownIcon,
  ArrowUpRightIcon,
  WrenchIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { toast } from "sonner";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

import { SOCIAL_LINKS } from "@/features/profile/data/social-links";
import { cn } from "@/lib/utils";
import { copyText } from "@/utils/copy";
import { useSound } from "@/hooks/use-sound";
import { useAnimatedThemeToggle } from "@/hooks/use-animated-theme-toggle";
import { showLabelsAtom } from "@/store/ui-store";


import { Icons } from "./icons";
import { Button } from "./ui/button";

import { Post as WorkPost } from "@/features/work/types/work-post";
import { BlogPost } from "@/features/blog/types/blog-post";
import { getMarkSVG, MnshMark } from "./mnsh-mark";
import { getWordmarkSVG, MnshWordmark } from "./mnsh-wordmark";
import { Separator } from "./ui/seperator";

type CommandLinkItem = {
  title: string;
  href: string;

  icon?: React.ComponentType<LucideProps>;
  iconImage?: string;
  coverImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Me",
    href: "/",
    icon: MnshMark,
  },
  {
    title: "Works",
    href: "/work",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
  {
    title: "Tools",
    href: "/tools",
    icon: WrenchIcon,
  },
  {
    title: "Gear",
    href: "/gear",
    icon: MonitorSmartphoneIcon,
  },
];

const ME_LINKS: CommandLinkItem[] = [
  {
    title: "About",
    href: "/#about",
    icon: LetterTextIcon,
  },
  {
    title: "Experience",
    href: "/#experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Works & Projects",
    href: "/#projects",
    icon: Icons.project,
  },
];

const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map((item) => ({
  title: item.title,
  href: item.href,
  iconImage: item.icon,
  openInNewTab: true,
}));

export function CommandMenu({ blogs = [], works = [] }: { blogs?: BlogPost[], works?: WorkPost[] }) {
  const router = useRouter();
  const showLabels = useAtomValue(showLabelsAtom);
  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  const { setAnimatedTheme } = useAnimatedThemeToggle();

  const [open, setOpen] = useState(false);
  const [isModifierKeyPressed, setIsModifierKeyPressed] = useState(false);

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const playOpen = useSound("/sounds/menu-open.wav");

  useEffect(() => {
    if (open) {
      playOpen();
    }
  }, [open]);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) setIsModifierKeyPressed(true);
    };
    const upHandler = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) setIsModifierKeyPressed(false);
    };
    const resetHandler = () => setIsModifierKeyPressed(false);

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    window.addEventListener("blur", resetHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
      window.removeEventListener("blur", resetHandler);
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    document.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
          if (
            (e.target instanceof HTMLElement && e.target.isContentEditable) ||
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLTextAreaElement ||
            e.target instanceof HTMLSelectElement
          ) {
            return;
          }

          e.preventDefault();
          setOpen((open) => !open);
        }
      },
      { signal }
    );

    return () => abortController.abort();
  }, []);

  const handleOpenLink = useCallback(
    (href: string, openInNewTab = false) => {
      setOpen(false);

      if (openInNewTab || isModifierKeyPressed) {
        window.open(href, "_blank", "noopener");
      } else {
        router.push(href);
      }
    },
    [router, isModifierKeyPressed]
  );

  const handleCopyText = useCallback((text: string, message: string) => {
    setOpen(false);
    copyText(text);
    toast.success(message);
  }, []);

  const handleThemeChange = useCallback(
    (theme: "light" | "dark" | "system") => {
      setOpen(false);
      setAnimatedTheme(theme);
    },
    [setAnimatedTheme]
  );

  const { blogLinks, workLinks, componentLinks } = useMemo(
    () => ({
      blogLinks: blogs
        .filter((post) => post.metadata?.category !== "components")
        .map(blogToCommandLinkItem),
      componentLinks: [],
      workLinks: works.map(workToCommandLinkItem),
    }),
    [blogs, works]
  );

  return (
    <>
      <Button
        variant="secondary"
        className={cn(
          "h-8 gap-1.5 shadow-sm rounded-none bg-zinc-50 px-2.5 text-muted-foreground select-none hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-900",
          "not-dark:border dark:inset-shadow-[1px_1px_1px,0px_0px_2px] dark:inset-shadow-white/15"
        )}
        onClick={() => {
          playTap();
          setOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden
        >
          <path
            d="M10.278 11.514a5.824 5.824 0 1 1 1.235-1.235l3.209 3.208A.875.875 0 0 1 14.111 15a.875.875 0 0 1-.624-.278l-3.209-3.208Zm.623-4.69a4.077 4.077 0 1 1-8.154 0 4.077 4.077 0 0 1 8.154 0Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>

        <span className="mr-8 font-sans text-sm/4 font-medium text-muted-foreground/50">
          Search...
        </span>
        
        {showLabels && (
          <>
            <CommandMenuKbd className="hidden tracking-wider sm:in-[.os-macos_&]:flex">
              ⌘K
            </CommandMenuKbd>
            <CommandMenuKbd className="hidden sm:not-[.os-macos_&]:flex">
              ctrl + K
            </CommandMenuKbd>
          </>
        )}
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{
          onValueChange: () => playHover(),
        }}
      >
        <CommandInput placeholder="Search for pages, posts, or commands..." />

        <CommandList className="min-h-80">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandLinkGroup
            heading="Menu"
            links={MENU_LINKS}
            onLinkSelect={handleOpenLink}
            playHover={playHover}
            playTap={playTap}
            isModifierKeyPressed={isModifierKeyPressed}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Blogs"
            links={blogLinks}
            fallbackIcon={TextIcon}
            onLinkSelect={handleOpenLink}
            playHover={playHover}
            playTap={playTap}
            isModifierKeyPressed={isModifierKeyPressed}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Works"
            links={workLinks}
            fallbackIcon={BriefcaseBusinessIcon}
            onLinkSelect={handleOpenLink}
            playHover={playHover}
            playTap={playTap}
            isModifierKeyPressed={isModifierKeyPressed}
          />

          <CommandSeparator />

          <CommandLinkGroup
            heading="Social Links"
            links={SOCIAL_LINK_ITEMS}
            onLinkSelect={handleOpenLink}
            playHover={playHover}
            playTap={playTap}
            isModifierKeyPressed={isModifierKeyPressed}
          />

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem
              onMouseEnter={playHover}
              value="Light"
              keywords={["theme"]}
              onSelect={() => {
                playTap();
                handleThemeChange("light");
              }}
            >
              <SunIcon />
              Light
            </CommandItem>
            <CommandItem
              onMouseEnter={playHover}
              value="Dark"
              keywords={["theme"]}
              onSelect={() => {
                playTap();
                handleThemeChange("dark");
              }}
            >
              <MoonStarIcon />
              Dark
            </CommandItem>
            <CommandItem
              onMouseEnter={playHover}
              value="Auto"
              keywords={["theme"]}
              onSelect={() => {
                playTap();
                handleThemeChange("system");
              }}
            >
              <Icons.contrast />
              Auto
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <CommandMenuFooter />
      </CommandDialog>
    </>
  );
}

function CommandLinkGroup({
  heading,
  links,
  fallbackIcon,
  onLinkSelect,
  playHover,
  playTap,
  isModifierKeyPressed,
}: {
  heading: string;
  links: CommandLinkItem[];
  fallbackIcon?: React.ComponentType<LucideProps>;
  onLinkSelect: (href: string, openInNewTab?: boolean) => void;
  playHover: () => void;
  playTap: () => void;
  isModifierKeyPressed: boolean;
}) {
  return (
    <CommandGroup heading={heading}>
      {links.map((link) => {
        const Icon = link?.icon ?? fallbackIcon ?? React.Fragment;

        return (
          <CommandItem
            onMouseEnter={playHover}
            key={link.href}
            value={link.title}
            keywords={link.keywords}
            onSelect={() => {
              playTap();
              onLinkSelect(link.href, link.openInNewTab);
            }}
          >
            {link?.coverImage ? (
              <div className="relative h-5 w-8 shrink-0 bg-muted">
                <Image
                  className="h-full w-full rounded-none object-cover"
                  src={link.coverImage}
                  alt={link.title}
                  width={32}
                  height={20}
                />
                <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10" />
              </div>
            ) : link?.iconImage ? (
              <div className="relative size-5 shrink-0">
                <Image
                  className="rounded-none object-contain"
                  src={link.iconImage}
                  alt={link.title}
                  width={20}
                  height={16}
                />
                <div className="pointer-events-none absolute inset-0 rounded-none ring-1 ring-black/10 ring-inset dark:ring-white/10" />
              </div>
            ) : (
              <Icon className="size-5 opacity-50 transition-opacity group-hover:opacity-100" />
            )}
            {link.title}

            <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity group-data-[selected=true]:opacity-100">
              <CommandMenuKbd
                className={cn(
                  "relative transition-all duration-300"
                )}
              >
                {/* Enter Action */}
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-300",
                    isModifierKeyPressed || link.openInNewTab
                      ? "opacity-0 scale-75 pointer-events-none"
                      : "opacity-100 scale-100"
                  )}
                >
                  <CornerDownLeftIcon />
                </span>

                {/* Open in New Tab Action */}
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center gap-1 transition-all duration-300 whitespace-nowrap",
                    isModifierKeyPressed || link.openInNewTab
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-75 pointer-events-none"
                  )}
                >
                  <ArrowUpRightIcon />
                </span>
              </CommandMenuKbd>
            </div>
          </CommandItem>
        );
      })}
    </CommandGroup>
  );
}

function CommandMenuFooter() {
  return (
    <>
      <div className="flex h-10" />

      <div className="absolute inset-x-0 bottom-0 flex h-10 items-center justify-end border-t border-border bg-zinc-100/30 text-xs font-medium dark:bg-zinc-800/30">
        <div className="flex-1" />

        <div className="hidden h-full items-center border-l border-border px-4 gap-2 sm:flex">
          <CommandMenuKbd>
            <ArrowUpDownIcon />
          </CommandMenuKbd>
          <span className="text-muted-foreground">Select</span>
        </div>

        <div className="hidden h-full items-center border-l border-border px-4 gap-2 sm:flex">
          <CommandMenuKbd>
            <CornerDownLeftIcon />
          </CommandMenuKbd>
          <span className="text-muted-foreground">Open</span>
        </div>

        <div className="hidden h-full items-center border-l border-border px-4 gap-2 sm:flex">
          <CommandMenuKbd>
            Ctrl <CornerDownLeftIcon />
          </CommandMenuKbd>
          <span className="text-muted-foreground">Open in new tab</span>
        </div>

        <div className="flex h-full items-center border-l border-border px-4 gap-2">
          <CommandMenuKbd>Esc</CommandMenuKbd>
          <span className="text-muted-foreground">Exit</span>
        </div>
      </div>
    </>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 min-w-6 items-center justify-center gap-1 rounded-sm bg-black/5 px-1 font-sans text-[13px] font-normal text-muted-foreground shadow-[inset_0_-1px_2px] shadow-black/10 select-none dark:bg-white/10 dark:shadow-white/10 dark:text-shadow-xs [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

function workToCommandLinkItem(work: WorkPost): CommandLinkItem {
  return {
    title: work.metadata.title,
    href: `/work/${work.slug}`,
    keywords: [
      work.metadata.category || "",
      ...(work.metadata.technologies || []),
    ].filter(Boolean),
    coverImage: work.metadata.image || work.metadata.gallery?.[0]?.thumbnail || work.metadata.gallery?.[0]?.url,
  };
}

function blogToCommandLinkItem(blog: BlogPost): CommandLinkItem {
  return {
    title: blog.metadata.title,
    href: `/blog/${blog.slug}`,
    keywords: [blog.metadata.category || "", ...(blog.metadata.tags || [])].filter(Boolean),
    coverImage: blog.metadata.image,
  };
}
