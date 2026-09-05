import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[calc(100svh-5.5rem)] w-full flex-col items-center justify-center border-x border-edge px-6 text-center",
        "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    >
      <h1 className="font-sans text-[10rem] font-bold leading-none tracking-tighter md:text-[15rem]">
        404
      </h1>
      <p className="mt-4 max-w-[500px] text-lg text-muted-foreground md:text-xl">
        Congratulations, you&apos;ve found a page that doesn&apos;t exist,
        <br />
        And also a rounded{" "}
        <span className="relative inline-block text-foreground">
          button.
        </span>
      </p>

      <div className="relative mt-12 inline-block">
        <svg
          className="absolute -inset-x-8 -inset-y-4 -z-10 h-[calc(100%+2rem)] w-[calc(100%+4rem)] text-muted-foreground/40 md:block"
          viewBox="0 0 200 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          preserveAspectRatio="none"
        >
          <path d="M 25,50 C 25,5 175,5 175,50 C 175,95 25,95 25,50 C 25,30 160,30 160,50" />
        </svg>
        <Button variant="default" size="lg" className="gap-2 rounded-full px-8 text-base shadow-lg" asChild>
          <Link href="/">
            Go home
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
