import { Panel, PanelHeader, PanelTitle } from "../components/panel";
import { getAllBlogs } from "@/features/blog/lib/blogs";
import { BlogsList } from "./blogs-list";
import type { BlogPost } from "@/features/blog/types/blog-post";

export interface BlogSectionProps {
    posts?: BlogPost[];
    limit?: number;
    title?: string;
    id?: string;
    showToggle?: boolean;
    className?: string;
}

export default function Blog({
    posts,
    limit = 4,
    title = "Blog",
    id = "blog",
    showToggle = true,
    className,
}: BlogSectionProps = {}) {
    const allBlogs = posts ?? getAllBlogs();

    if (allBlogs.length === 0) return null;

    return (
        <Panel id={id} className={className}>
            <PanelHeader>
                <PanelTitle>{title}</PanelTitle>
            </PanelHeader>

            <BlogsList
                allBlogs={allBlogs}
                initialLimit={limit}
                showToggle={showToggle}
            />
        </Panel>
    );
}

export { BlogsList };

