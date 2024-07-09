"use client"

import type { ErrorDisplayProps } from "@/components/display-client-error"
import { DisplayClientError } from "@/components/display-client-error"
import { useErrorLog } from "@/hooks/use-error-log"

export default function Error({ error, reset }: ErrorDisplayProps) {
  const { logError } = useErrorLog(["console"])

  logError(error)

  return <DisplayClientError error={error} reset={reset} />
}
