import { getAuthUserId } from "@convex-dev/auth/server"
import { ConvexError } from "convex/values"
import type { Doc, Id } from "../_generated/dataModel"
import type { MutationCtx, QueryCtx } from "../_generated/server"

export async function requireOwnedCv(
  ctx: QueryCtx | MutationCtx,
  cvId: Id<"cvs">
): Promise<Doc<"cvs">> {
  const userId = await getAuthUserId(ctx)
  if (userId === null) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not signed in" })
  }
  const cv = await ctx.db.get(cvId)
  if (cv === null || cv.userId !== userId) {
    throw new ConvexError({ code: "NOT_FOUND", message: "CV not found" })
  }
  return cv
}
