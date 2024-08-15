"use client"
import { useEffect, useState } from "react"

/**
 * Custom hook for handling errors occurring during async operations in Next.js, so that they can be caught by the nearest error boundary.
 *
 * @returns An object containing the `throwAsyncError` function.
 */
export const useAsyncErrors = () => {
  const [error, setError] = useState<string | null>(null)

  /**
   * Function to throw an asynchronous error by setting it as the current error state.
   * If there's an error set, it will be thrown by the useEffect hook outside the context of the current async operation.
   *
   * @param error - The error object to be rethrown.
   */
  const throwAsyncError = (errormsg: string) => {
    const error = new Error(errormsg)
    setError(error.message)
  }

  useEffect(() => {
    if (error) throw new Error(error)
  }, [error])

  return { throwAsyncError }
}
