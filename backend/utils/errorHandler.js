// backend/utils/errorHandler.js

/**
 * 🚨 ERROR HANDLER - Custom error class
 *
 * Extends built-in Error class
 * Adds statusCode for HTTP status
 * Captures stack trace for debugging
 *
 * 📝 HOW IT WORKS:
 *    throw new ErrorHandler("Product not found", 404);
 *
 * ✅ VERDICT: Your version is perfect! Clean, modern, ES Modules.
 *    Name is better (ErrorHandler vs errorhander - fixed typo!)
 */

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent constructor
    this.statusCode = statusCode; // HTTP status code

    // Capture stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
