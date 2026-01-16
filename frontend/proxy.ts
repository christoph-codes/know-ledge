import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * CRITICAL: Next.js Proxy for automatic session refresh
 *
 * Why do we need a proxy?
 * - Supabase sessions expire after a certain time (default: 1 hour)
 * - This proxy automatically refreshes the session on every request
 * - Keeps users logged in without manual intervention
 *
 * LEARNING: The proxy runs on EVERY request before your page loads.
 * This is the perfect place to handle session refresh because:
 * 1. It runs server-side (secure)
 * 2. It runs before any page renders (prevents flash of unauthenticated content)
 * 3. It can update cookies (essential for session management)
 */
export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // LEARNING: Update cookies in both the request and response
          // This ensures the session is maintained across the middleware boundary
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // CRITICAL: This call triggers session refresh if needed
  // Don't remove this or sessions won't be refreshed automatically
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicPaths = [
    "/api/healthcheck",
    "/api/auth",
    "/_next",
    "/favicon.ico",
    "/spp.svg",
    "/.well-known",
    "/login",
    "/signup",
  ];

  const isPublicPath = (pathname: string) =>
    publicPaths.some((path) => pathname.startsWith(path) || path === pathname);

  if (isPublicPath(request.nextUrl.pathname)) return NextResponse.next();

  // LEARNING: Protect routes by checking authentication
  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!user) {
    // Redirect to login if accessing protected routes without authentication
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // LEARNING: If user IS authenticated and trying to access auth pages, redirect to app
  // This prevents logged-in users from seeing login/signup pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/resource";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
