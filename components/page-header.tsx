import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={className}>
      <div className="border-b border-edge px-2 py-2">
        <h1 className="text-3xl font-semibold font-heading">{title}</h1>
      </div>

      <div className="border-b border-edge px-2 py-2">
        <p className="font-heading text-sm text-balance text-muted-foreground">
          {description}
        </p>
      </div>

      <PatternSeparator />
    </div>
  );
}

export function PatternSeparator({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-8 w-full border-b border-edge",
        "before:absolute before:inset-0 before:-z-1 before:h-full before:w-full",
        "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        className
      )}
    />
  );
}
