"use client"
import { useSearchParams } from "next/navigation"

/** The `?cv=<id>` query param identifying which saved CV is being edited. */
export function useCvId(): string | null {
  return useSearchParams().get("cv")
}

/** Appends the `?cv=<id>` query param to `path`, or returns `path` unchanged when `cvId` is null. */
export function withCvParam(path: string, cvId: string | null): string {
  return cvId ? `${path}?cv=${cvId}` : path
}
