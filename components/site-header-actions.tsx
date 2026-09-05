"use client";

import { useState, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import Link from "next/link";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";

const navItems = [
    {
        title: "Blog",
        href: "/blog",
    },
    {
        title: "Gear",
        href: "/gear",
    },
    {
        title: "Tools",
        href: "/tools",
    },
];

export function MoreOptions() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return;

            if (!e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                setOpen(o => !o);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <SimpleTooltip content="Open more options">
                <DropdownMenuTrigger asChild>
                    <button className="flex h-full px-4 font-sans items-center justify-center text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground gap-1.5 cursor-pointer">
                        <span>More</span>
                        <Kbd className="hidden sm:inline-flex">S</Kbd>
                        <CaretDown
                            className={`size-3.5 transition-transform duration-500 ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                </DropdownMenuTrigger>
            </SimpleTooltip>

            <DropdownMenuContent
                align="end"
                className="border-border rounded-none"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {navItems.map(({ title, href }) => (
                    <DropdownMenuItem key={href} asChild className="cursor-pointer rounded-none">
                        <Link href={href} className="flex items-center gap-2">
                            {title}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}