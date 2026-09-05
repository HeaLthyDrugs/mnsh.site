"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { cn } from "@/lib/utils";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

export function BlogSearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const query = searchParams.get("q") || "";

    const handleSearch = useCallback(
        (value: string) => {
            const params = new URLSearchParams(searchParams.toString());

            if (value) {
                params.set("q", value);
            } else {
                params.delete("q");
            }

            startTransition(() => {
                router.replace(`/blog?${params.toString()}`, { scroll: false });
            });
        },
        [router, searchParams]
    );

    const clearSearch = useCallback(() => {
        handleSearch("");
    }, [handleSearch]);

    return (
        <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
                type="text"
                placeholder="Search blogs..."
                defaultValue={query}
                onChange={(e) => handleSearch(e.target.value)}
                className={cn(
                    "h-9 w-full rounded-lg border border-input bg-transparent px-9 text-sm shadow-xs outline-none transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus:ring-1 focus:ring-ring",
                    "dark:bg-input/30",
                    isPending && "opacity-70"
                )}
            />
            {query && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
