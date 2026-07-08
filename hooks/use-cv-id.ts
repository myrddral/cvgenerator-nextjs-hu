"use client"
import { useSearchParams } from "next/navigation"

/** The `?cv=<id>` query param identifying which saved CV is being edited. */
export function useCvId(): string | null {
  return useSearchParams().get("cv")
}
