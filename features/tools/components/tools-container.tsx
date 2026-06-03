"use client";

import { useState } from "react";
import { Tool } from "../data/tools";
import { ToolList } from "./tool-list";
import { cn } from "@/lib/utils";

interface ToolsContainerProps {
    tools: Tool[];
}

export function ToolsContainer({ tools }: ToolsContainerProps) {
    // Extract unique categories
    const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredTools =
        selectedCategory === "All"
            ? tools
            : tools.filter((t) => t.category === selectedCategory);

    return (
        <div className="flex flex-col">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-stretch border-t border-l border-edge bg-background">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        style={{ borderRightStyle: "dashed" }}
                        className={cn(
                            "relative flex items-center justify-center px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:text-primary focus:outline-none",
                            "border-r border-edge",
                            "border-b border-edge", // Solid bottom border
                            // Make text muted unless active
                            selectedCategory === category
                                ? "text-primary bg-muted/30"
                                : "text-muted-foreground/60 hover:bg-muted/10",
                        )}
                    >
                        {category}
                    </button>
                ))}

                {/* Filler with solid bottom border to complete the row */}
                <div className="flex-1 border-b border-edge border-r border-edge self-stretch bg-muted/5" />
            </div>

            <ToolList tools={filteredTools} />
        </div>
    );
}
