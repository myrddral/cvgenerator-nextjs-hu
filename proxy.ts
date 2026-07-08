import { convexAuthNextjsMiddleware, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"
import { isProtectedPath } from "./lib/protected-routes"

const intlMiddleware = createMiddleware(routing)

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isProtectedPath(request.nextUrl.pathname) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in")
  }
  return intlMiddleware(request)
})

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/api/auth"],
}
