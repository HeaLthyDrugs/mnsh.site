// Thanks @fumadocs

"use client"

import { Check, CaretDown, XCircle, Copy } from "@phosphor-icons/react"
import { useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motionIconProps } from "@/components/copy-button"
import { copyText } from "@/utils/copy"
import { useSound } from "@/hooks/use-sound"

const cache = new Map<string, string>()

/** Resolve a page/mdx URL to the API route that returns raw plain-text MDX. */
function getMdxSourceUrl(markdownUrl: string) {
    // Prefer the API so we always get text/plain (not an HTML view page).
    // /blog/foo.mdx | /blog/foo → /api/mdx/blog/foo
    // /work/foo.mdx | /work/foo → /api/mdx/work/foo
    // /api/mdx/...  → unchanged
    if (markdownUrl.startsWith("/api/mdx/")) {
        return markdownUrl.replace(/\.mdx$/, "")
    }

    const match = markdownUrl.match(/^\/(blog|work)\/([^/?#]+?)(?:\.mdx)?\/?$/)
    if (match) {
        return `/api/mdx/${match[1]}/${match[2]}`
    }

    // Fallback: keep original, strip trailing slash
    return markdownUrl.replace(/\.mdx$/, "").replace(/\/$/, "")
}

export function LLMCopyButton({ markdownUrl }: { markdownUrl: string }) {
    const [state, setState] = useState<"idle" | "done" | "error">("idle")
    const [isCopying, setIsCopying] = useState(false)
    const operationRef = useRef(false)
    const playCopy = useSound("/sounds/copy.wav")

    const handleCopy = async () => {
        if (operationRef.current) return

        operationRef.current = true
        playCopy()

        const loadingTimer = setTimeout(() => {
            setIsCopying(true)
        }, 150)

        try {
            const sourceUrl = getMdxSourceUrl(markdownUrl)
            let content = cache.get(sourceUrl)

            if (!content) {
                const res = await fetch(sourceUrl, {
                    headers: { Accept: "text/plain" },
                })
                if (!res.ok) {
                    throw new Error(`Failed to fetch MDX (${res.status})`)
                }
                content = await res.text()
                // Guard: never copy an HTML document as "MDX"
                const trimmed = content.trimStart()
                if (
                    trimmed.startsWith("<!DOCTYPE") ||
                    trimmed.startsWith("<html") ||
                    trimmed.startsWith("<!doctype")
                ) {
                    throw new Error("Received HTML instead of MDX")
                }
                cache.set(sourceUrl, content)
            }

            await copyText(content)
            setState("done")
        } catch {
            setState("error")
        } finally {
            clearTimeout(loadingTimer)
            setIsCopying(false)
            await new Promise((resolve) => setTimeout(resolve, 1500))
            operationRef.current = false
            setState("idle")
        }
    }

    return (
        <button
            className="flex h-7 items-center gap-1.5 pr-2 pl-2.5 text-sm font-medium transition-opacity will-change-transform disabled:pointer-events-none disabled:opacity-50 hover:rounded-none focus:rounded-none rounded-none"
            aria-busy={isCopying}
            disabled={isCopying}
            onClick={handleCopy}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {state === "idle" ? (
                    <motion.span key="idle" {...motionIconProps}>
                        <Copy className="size-3" />
                    </motion.span>
                ) : state === "done" ? (
                    <motion.span key="done" {...motionIconProps}>
                        <Check className="size-3" strokeWidth={3} />
                    </motion.span>
                ) : state === "error" ? (
                    <motion.span key="error" {...motionIconProps}>
                        <XCircle className="size-3" />
                    </motion.span>
                ) : null}
            </AnimatePresence>
            MDX
        </button>
    )
}

function getAbsoluteUrl(url: string) {
    if (typeof window === "undefined") return url

    return new URL(url, window.location.origin).toString()
}

function stripMdxExtension(url: string) {
    return url.endsWith(".mdx") ? url.slice(0, -4) : url
}

function getPrompt(pageUrl: string, markdownUrl: string, isComponent?: boolean) {
    if (isComponent) {
        return `I'm looking at this component documentation and want help using it well.

Rendered page: ${pageUrl}
MDX source: ${markdownUrl}

Please read the linked documentation, use the MDX source as the primary reference when it is available, and explain how to use this component in a React and TypeScript project. Walk through the main ideas, show practical examples, call out important props or patterns, and mention common mistakes or edge cases. After the overview, be ready to answer follow-up questions and help debug an implementation based on this documentation.`
    }

    return `I want to discuss this article/project page in detail.

Rendered page: ${pageUrl}
MDX source: ${markdownUrl}

Please read the linked content, use the MDX source as the primary reference when it is available, and give me a thoughtful overview. Include a clear summary, the main ideas, any important technical or design details, practical takeaways, and a few good follow-up questions I could ask next. After that, be ready to answer deeper questions about the content.`
}

function getPromptHref(baseUrl: string, prompt: string) {
    const url = new URL(baseUrl)
    url.searchParams.set("q", prompt)

    return url.toString()
}

export function ViewOptions({
    markdownUrl,
    isComponent = false,
}: {
    markdownUrl: string
    isComponent?: boolean
}) {
    const items = useMemo(() => {
        const fullMarkdownUrl = getAbsoluteUrl(markdownUrl)
        const fullPageUrl = getAbsoluteUrl(stripMdxExtension(markdownUrl))
        const q = getPrompt(fullPageUrl, fullMarkdownUrl, isComponent)

        const _items = [
            {
                title: "View as Markdown",
                href: fullMarkdownUrl,
                icon: Icons.markdown,
            },
            {
                title: "Open in ChatGPT",
                href: getPromptHref("https://chatgpt.com/", q),
                icon: Icons.openai,
            },
            {
                title: "Open in Claude",
                href: getPromptHref("https://claude.ai/new", q),
                icon: Icons.claude,
            },
            {
                title: "Open in Grok",
                href: getPromptHref("https://grok.com/", q),
                icon: Icons.grok,
            },
            {
                title: "Open in DeepSeek",
                href: getPromptHref("https://chat.deepseek.com/", q),
                icon: Icons.deepseek,
            },
            {
                title: "Open in Perplexity",
                href: getPromptHref("https://www.perplexity.ai/search/new", q),
                icon: Icons.perplexity,
            },
        ]

        if (isComponent) {
            _items.splice(1, 0, {
                title: "Open in v0",
                href: getPromptHref("https://v0.app/", q),
                icon: Icons.v0,
            })
        }

        return _items
    }, [markdownUrl, isComponent])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex size-7 items-center justify-center gap-2 text-sm hover:rounded-none focus:rounded-none rounded-none outline-none">
                    <CaretDown className="mt-0.5 size-4" />
                    <span className="sr-only">View Options</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="rounded-none"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {items.map(({ title, href, icon: Icon }) => (
                    <DropdownMenuItem key={href} asChild className="rounded-none cursor-pointer">
                        <a href={href} rel="noreferrer noopener" target="_blank">
                            <Icon />
                            {title}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function LLMCopyButtonWithViewOptions({
    markdownUrl,
    isComponent = false,
}: {
    markdownUrl: string
    isComponent?: boolean
}) {
    const rawMarkdownUrl = markdownUrl.endsWith('.mdx') ? markdownUrl : `${markdownUrl}.mdx`;
    return (
        <div
            className={cn(
                buttonVariants({
                    size: "sm",
                    variant: "secondary",
                    className:
                        "gap-0 divide-x px-0 font-sans active:scale-none dark:divide-white/10 rounded-none hover:rounded-none focus:rounded-none",
                })
            )}
        >
            <LLMCopyButton markdownUrl={rawMarkdownUrl} />
            <ViewOptions markdownUrl={rawMarkdownUrl} isComponent={isComponent} />
        </div>
    )
}
