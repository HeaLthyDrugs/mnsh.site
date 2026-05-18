import { MetadataRoute } from 'next'
import { getAllBlogs } from '@/features/blog/lib/blogs';
import { SITE_INFO } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogs();

  const blogUrls: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_INFO.url}/blog/${blog.slug}`,
    lastModified: new Date(blog.metadata.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: SITE_INFO.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_INFO.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_INFO.url}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_INFO.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogUrls,
  ]
}