import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async rewrites() {
		const rewrites = [
			{
				source: '/blog/:slug.mdx',
				destination: '/api/mdx/blog/:slug',
			},
			{
				source: '/work/:slug.mdx',
				destination: '/api/mdx/work/:slug',
			},
		];

		const c15tUrl = process.env.NEXT_PUBLIC_C15T_URL;
		if (c15tUrl) {
			rewrites.push({
				source: '/api/c15t/:path*',
				destination: `${c15tUrl}/:path*`,
			});
		}

		return rewrites;
	},
	images: {
		formats: ["image/avif", "image/webp"],
		deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
		imageSizes: [16, 24, 32, 48, 64, 72, 96, 128, 256, 384],
		qualities: [68, 75, 82],
		minimumCacheTTL: 31536000,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'assets.mnsh.online',
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'code.visualstudio.com',
			},
			{
				protocol: 'https',
				hostname: 'static.figma.com',
			},
			{
				protocol: 'https',
				hostname: 'www.notion.so',
			},
			{
				protocol: 'https',
				hostname: 'assets.vercel.com',
			},
			{
				protocol: 'https',
				hostname: 'static.linear.app',
			},
			{
				protocol: 'https',
				hostname: 'm.media-amazon.com',
			},
			{
				protocol: 'https',
				hostname: 'rukminim2.flixcart.com',
			},
			{
				protocol: 'https',
				hostname: 'www.asrock.com',
			},
		],
	},
	async headers() {
		return [
			{
				source: "/sounds/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/logo/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/og/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/scene/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
	devIndicators: false,
};

export default nextConfig;
