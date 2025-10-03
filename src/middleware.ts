import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect only endpoints that require authentication. Allow guests for audio-analysis.
const isProtectedRoute = createRouteMatcher([
  "/api/gemini/audio-comments(.*)",
]);

export default clerkMiddleware((auth, req) => {
  const path = new URL(req.url).pathname;
  const protectedRoute = isProtectedRoute(req);
  console.debug("[middleware] route check", {
    path,
    protected: protectedRoute,
    method: req.method,
  });

  if (!protectedRoute) {
    return;
  }

  const session = auth();

  if (!session.userId) {
    console.debug("[middleware] unauthenticated request blocked", {
      method: req.method,
      url: req.url,
    });
    session.protect();
    return;
  }

  console.debug("[middleware] authenticated request allowed", {
    method: req.method,
    url: req.url,
    userId: session.userId,
  });
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|favicon.ico).*)",
    "/",
  ],
};
