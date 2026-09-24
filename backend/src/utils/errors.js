export class ApiError extends Error {
  constructor(statusCode, message, errorCode = "API_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function sendSuccess(res, data, message = "Success", statusCode = 200, pagination) {
  res.status(statusCode).json({ success: true, message, data, pagination });
}
