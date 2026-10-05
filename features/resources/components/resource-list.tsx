"use client";

import { Resource } from "../data/resources";
import { ResourceCard } from "./resource-card";

interface ResourceListProps {
    resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
    return (
        <div className="grid grid-cols-1 border-l border-edge">
            {resources.map((resource) => (
                <div key={resource.name} className="border-b border-r border-edge">
                    <ResourceCard resource={resource} />
                </div>
            ))}
        </div>
    );
}
