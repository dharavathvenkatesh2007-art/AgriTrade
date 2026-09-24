export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 422 : 500);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    errorCode: err.errorCode || err.code || "SERVER_ERROR"
  });
}
