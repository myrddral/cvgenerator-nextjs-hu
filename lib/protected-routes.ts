const PROTECTED_PATTERN = /^\/(en|hu)?\/?(create|cvs)(\/.*)?$/

/** Paths that require an authenticated Convex session, checked in `proxy.ts`. */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATTERN.test(pathname)
}
