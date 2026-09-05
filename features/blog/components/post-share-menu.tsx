"use client"

import { EllipsisIcon, LinkIcon, ShareIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { copyText } from "@/utils/copy"
import { useSound } from "@/hooks/use-sound"

export function PostShareMenu({ title, url }: { title: string; url: string }) {
    const playCopy = useSound("/sounds/copy.wav")
    const absoluteUrl = url.startsWith("http")
        ? url
        : typeof window !== "undefined"
            ? new URL(url, window.location.origin).toString()
            : url

    const urlEncoded = encodeURIComponent(absoluteUrl)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="size-7 border-none active:scale-none rounded-none"
                    variant="secondary"
                    size="icon-sm"
                >
                    <ShareIcon />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-fit rounded-none"
                alignOffset={-6}
                collisionPadding={8}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DropdownMenuItem
                    className="rounded-none px-4"
                    onClick={() => {
                        playCopy()
                        copyText(absoluteUrl)
                        toast.success("Link copied")
                    }}
                >
                    <LinkIcon className="size-3.5" />
                    Copy link
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-none px-4">
                    <a
                        href={`https://x.com/intent/tweet?url=${urlEncoded}`}
                        target="_blank"
                        rel="noopener"
                    >
                        <Icons.x className="size-3.5" />
                        Share on X
                    </a>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="rounded-none px-4">
                    <a
                        href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
                        target="_blank"
                        rel="noopener"
                    >
                        <Icons.linkedin className="size-3.5" />
                        Share on LinkedIn
                    </a>
                </DropdownMenuItem>

                {typeof navigator !== "undefined" && "share" in navigator && (
                    <DropdownMenuItem
                        className="rounded-none px-4"
                        onClick={(e) => {
                            e.preventDefault() // Prevent the menu from closing
                            navigator.share({ title, url: absoluteUrl }).catch(() => { })
                        }}
                    >
                        <EllipsisIcon className="size-3.5" />
                        Other app
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
