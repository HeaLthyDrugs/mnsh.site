import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || request.nextUrl.host || "";
  const hostname = host.split(":")[0];
  const { pathname } = request.nextUrl;

  // Check for cli subdomain (e.g. cli.mnsh.site, cli.mnsh.online, cli.localhost)
  const isCliSubdomain =
    hostname.startsWith("cli.") ||
    hostname === "cli.mnsh.site" ||
    hostname === "cli.mnsh.online";

  if (isCliSubdomain) {
    // If accessing root of cli subdomain, rewrite internally to /cli
    if (pathname === "/" || pathname === "") {
      return NextResponse.rewrite(new URL("/cli", request.url));
    }

    // Pass through if already requesting /cli or API routes
    if (pathname === "/cli" || pathname.startsWith("/cli/") || pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Rewrite any other path on the cli subdomain to /cli
    return NextResponse.rewrite(new URL("/cli", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static asset files (.png, .jpg, .wav, .svg, .json, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp3|wav|json|xml|txt)$).*)",
  ],
};
