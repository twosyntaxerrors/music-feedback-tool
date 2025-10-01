import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/api/gemini/(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!isProtectedRoute(req)) {
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
