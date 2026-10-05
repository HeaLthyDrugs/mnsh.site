"use client";

import { useState } from "react";
import { Resource } from "../data/resources";
import { ResourceList } from "./resource-list";
import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";

interface ResourcesContainerProps {
    resources: Resource[];
}

function getCategoryIcon(category: string) {
    switch (category.toLowerCase()) {
        case "all":
            return Icons.freehandAppLayout;
        case "development":
            return Icons.freehandFileCode;
        case "productivity":
            return Icons.freehandTaskCheck;
        case "design":
            return Icons.freehandColorPalette;
        case "other":
            return Icons.freehandArchiveBox;
        case "utilities":
            return Icons.freehandTerminal;
        default:
            return Icons.freehandArchiveBox;
    }
}

export function ResourcesContainer({ resources }: ResourcesContainerProps) {
    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(resources.map((t) => t.category)))];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredResources =
        selectedCategory === "All"
            ? resources
            : resources.filter((t) => t.category === selectedCategory);

    return (
        <div className="flex flex-col">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-stretch border-t border-l border-edge bg-background">
                {categories.map((category) => {
                    const Icon = getCategoryIcon(category);

                    return (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{ borderRightStyle: "dashed" }}
                            className={cn(
                                "relative flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium transition-colors hover:text-primary focus:outline-none rounded-none",
                                "border-r border-edge",
                                "border-b border-edge", // Solid bottom border
                                selectedCategory === category
                                    ? "text-primary bg-muted/30"
                                    : "text-muted-foreground/60 hover:bg-muted/10",
                            )}
                        >
                            <Icon className="size-3.5 shrink-0 opacity-80" />
                            <span>{category}</span>
                        </button>
                    );
                })}

                {/* Filler with solid bottom border to complete the row */}
                <div className="flex-1 border-b border-edge border-r border-edge self-stretch bg-muted/5" />
            </div>

            <ResourceList resources={filteredResources} />
        </div>
    );
}
