type LogType = "console" | "server"
type LogTypes = [LogType] | [LogType, LogType]
type LogErrorFunction = (error: Error) => void

type ErrorLogerHookParams = LogTypes

interface ErrorLogerHookReturns {
  logError: LogErrorFunction
}

type ErrorLoggerHook = (params: ErrorLogerHookParams) => ErrorLogerHookReturns

/**
 * Custom hook for logging errors.
 * @param logTypes - An array of the types of logs to be made.
 *
 * @returns An object with the following functions:
 * - `logError(errorObj)` - Function that processes the error object.
 * Currently it only logs the error to the console.
 */
export const useErrorLog: ErrorLoggerHook = (logTypes) => {
  const shouldLogToConsole = logTypes.some((type) => type === "console")
  const shouldLogToServer = logTypes.some((type) => type === "server")

  const logError: LogErrorFunction = (error) => {
    if (shouldLogToConsole) console.error(error)
    if (shouldLogToServer) console.log("Pretending to be sending error to server... :)")
  }

  return { logError }
}
