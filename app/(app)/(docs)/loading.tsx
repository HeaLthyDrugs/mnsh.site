export default function DocsLoading() {
  return (
    <div className="mx-auto border-x border-edge md:max-w-3xl">
      <div className="h-8 w-full border-b border-edge" />
      <div className="space-y-6 p-6">
        <div className="h-8 w-3/4 animate-pulse rounded bg-muted/30" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/20" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/20" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted/20" />
        </div>
        <div className="h-64 w-full animate-pulse rounded bg-muted/15" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted/20" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted/20" />
        </div>
      </div>
    </div>
  );
}
