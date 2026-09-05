export default function Loading() {
  return (
    <div className="mx-auto md:max-w-3xl">
      <div className="h-40 w-full animate-pulse border-x border-b border-edge bg-muted/10" />
      <div className="border-x border-edge p-6">
        <div className="flex items-center gap-4">
          <div className="size-16 animate-pulse rounded-full bg-muted/30" />
          <div className="flex flex-col gap-2">
            <div className="h-6 w-40 animate-pulse rounded bg-muted/30" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted/30" />
          </div>
        </div>
      </div>
      <div className="border-x border-edge px-6 py-8">
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/20" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-muted/20" />
          <div className="h-4 w-3/5 animate-pulse rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
