import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "../types/blog-post";

const blogsDirectory = path.join(process.cwd(), "features/blog/content");

export function getAllBlogs(): BlogPost[] {
    if (!fs.existsSync(blogsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(blogsDirectory);
    const blogs = fileNames
        .filter((fileName) => fileName.endsWith(".mdx"))
        .map((fileName) => {
            const slug = fileName.replace(/\.mdx$/, "");
            const fullPath = path.join(blogsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");
            const { data, content } = matter(fileContents);

            return {
                slug,
                metadata: data as BlogPost["metadata"],
                content,
            };
        });

    return blogs
        .sort(
            (a, b) =>
                new Date(b.metadata.createdAt).getTime() -
                new Date(a.metadata.createdAt).getTime()
        )
        .map((blog, index) => ({
            ...blog,
            metadata: {
                ...blog.metadata,
                new: index === 0,
            },
        }));
}

export function getBlogBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(blogsDirectory, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
            slug,
            metadata: data as BlogPost["metadata"],
            content,
        };
    } catch {
        return null;
    }
}
