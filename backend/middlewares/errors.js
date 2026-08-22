// backend/middlewares/errors.js

/**
 * 🚨 GLOBAL ERROR HANDLER
 *
 * This middleware catches ALL errors from the entire app
 * and sends a formatted response to the client.
 *
 * 🔄 WHAT IT HANDLES:
 *    1. CastError (Invalid MongoDB ID)
 *    2. ValidationError (Schema validation fails)
 *    3. Duplicate Key Error (Duplicate email, etc.)
 *    4. JWT Errors (Invalid or expired token)
 *    5. Custom ErrorHandler errors
 *    6. Generic server errors
 *
 * 🌍 ENVIRONMENT RESPONSES:
 *    - DEVELOPMENT: Full error details + stack trace
 *    - PRODUCTION: Only error message (secure)
 *
 * 🔄 USAGE:
 *    // In app.js after all routes:
 *    app.use(errorMiddleware);
 */

import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  // 📦 Initialize error object
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };
  // 🔍 Handle: Invalid MongoDB ID (CastError)
  // Example: Product.findById("invalid_id")
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }
  // 🔍 Handle: Schema Validation Error
  // Example: Saving product without required fields
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }
  // 🔍 Handle: Duplicate Key Error
  // Example: Registering with existing email
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
    error = new ErrorHandler(message, 400);
  }
  // 🔍 Handle: Invalid JWT Token
  // Example: Tampered token
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }
  // 🔍 Handle: Expired JWT Token
  // Example: Token older than expiration time
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }
  // 🌍 DEVELOPMENT: Send full error details
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: err, // ✅ Full error object
      stack: err?.stack, // ✅ Stack trace for debugging
    });
  }
  // 🚀 PRODUCTION: Send only error message
  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      success: false,
      message: error.message, // ✅ Only message (secure)
    });
  }
};
