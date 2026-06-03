"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem as BaseNavItem } from "@/types/nav";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";



import { useAtomValue } from "jotai";
import { showLabelsAtom } from "@/store/ui-store";
import { useSound } from "@/hooks/use-sound";

export function Nav({
  items,
  activeId,
  className,
}: {
  items: BaseNavItem[];
  activeId?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const showLabels = useAtomValue(showLabelsAtom);

  const playHover = useSound("/sounds/hover.wav");
  const playTap = useSound("/sounds/tap.wav");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return;

      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        const key = e.key.toLowerCase();
        const item = items.find(i => i.shortcut?.toLowerCase() === key);
        if (item) {
          router.push(item.href);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, router]);

  return (
    <nav className={cn("flex h-full items-center", className)}>
      {items.map(({ title, href, shortcut, description }) => {
        const active =
          activeId === href || (href !== "/" && activeId?.startsWith(href));

        const navItem = (
          <NavItem 
            key={href} 
            href={href} 
            active={active} 
            className="flex h-full items-center gap-1.5 px-4 border-r border-border"
            onMouseEnter={playHover}
            onClick={playTap}
          >
            {title}
            {shortcut && showLabels && <Kbd className="hidden sm:inline-flex">{shortcut}</Kbd>}
          </NavItem>
        );

        let finalItem = navItem;

        if (description) {
          finalItem = (
            <SimpleTooltip
              key={`tooltip-${href}`}
              content={description}
            >
              {navItem}
            </SimpleTooltip>
          );
        }

        return (
          <React.Fragment key={`fragment-${href}`}>
            {finalItem}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export const NavItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    active?: boolean;
  }
>(({ active, className, ...props }, ref) => {
  return (
    <Link
      ref={ref}
      className={cn(
        "font-sans text-sm font-medium text-muted-foreground transition-all duration-300",
        active && "text-foreground",
        className
      )}
      {...props}
    />
  );
});
NavItem.displayName = "NavItem";
