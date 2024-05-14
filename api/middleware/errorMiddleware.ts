import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

// Middleware to handle errors
const ErrorMiddleware = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is an instance of ApiError
  if (err instanceof ApiError) {
    // Sending error response with status code, message, and errors
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  } else {
    // If the error is unexpected
    console.error("Unexpected error:", err);
    // Sending internal server error response
    res.status(500).json({
      success: false,
      message: err ?? "Internal Server Error",
      errors: [],
    });
  }
};

export default ErrorMiddleware;
