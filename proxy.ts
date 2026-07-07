import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default convexAuthNextjsMiddleware((request) => intlMiddleware(request))

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/api/auth"],
}
