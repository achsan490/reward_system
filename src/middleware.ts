import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Public paths that don't require authentication
    const publicPaths = [
        "/login",
        "/api/auth",
        "/member/check",      // Member check page (QR code access)
        "/member/rewards",    // Member rewards page
        "/api/debug/seed"
    ];

    // Check if current path is public
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Debug logging for Vercel
    console.log('[Middleware Debug]', {
        pathname,
        isPublicPath,
        hasSession: !!session,
        publicPaths
    });

    // If user is not authenticated and trying to access protected route
    if (!session && !isPublicPath) {
        console.log('[Middleware] Blocking access to:', pathname);
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and trying to access login page
    if (session && pathname === "/login") {
        const dashboardUrl = new URL("/", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    console.log('[Middleware] Allowing access to:', pathname);
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
    ],
};
