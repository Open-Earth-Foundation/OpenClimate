interface ControllerError {
  name: string,
  code: number,
  reason: string
}
class ControllerError extends Error {
  constructor(code = 0, reason = 'Internal Server Error', ...params) {
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ControllerError)
    }

    this.name = 'ControllerError'
    // Custom debugging information
    this.code = code
    this.reason = reason
  }
}

module.exports = ControllerError
