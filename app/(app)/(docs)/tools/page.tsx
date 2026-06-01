import type { Metadata } from "next";
import { TOOLS } from "@/features/tools/data/tools";
import { ToolsContainer } from "@/features/tools/components/tools-container";
import { cn } from "@/lib/utils";
import { SITE_INFO } from "@/config/site";

export const metadata: Metadata = {
    title: "Tools",
    description: "A curated collection of software and utilities that power my workflow.",
    alternates: {
        canonical: "/tools",
    },
    openGraph: {
        title: "Tools",
        description: "A curated collection of software and utilities that power my workflow.",
        url: `${SITE_INFO.url}/tools`,
    },
};

export default function Page() {
    return (
        <div className="min-h-svh">
            <div className="border-b border-edge px-2 py-2">
                <h1 className="text-3xl font-semibold font-heading">Tools</h1>
            </div>

            <div className="px-2 py-2 border-b border-edge">
                <p className="font-heading text-sm text-balance text-muted-foreground ">
                    {metadata.description as string}
                </p>
            </div>

            <Separator />

            <div className="border-edge p-2">
                <ToolsContainer tools={TOOLS} />
            </div>

            <div className="h-4" />
        </div>
    );
}


function Separator({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "relative flex h-8 w-full border-b border-edge",
                "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
                "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
                className
            )}
        />
    );
}
