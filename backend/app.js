// backend/app.js

/**
 * 🚀 APP - Main Express Application
 *
 * This file:
 * 1. Sets up Express server
 * 2. Connects to MongoDB
 * 3. Configures middleware
 * 4. Sets up routes
 * 5. Handles errors
 *
 * 📦 PACKAGES USED:
 *    - express: Web framework
 *    - dotenv: Environment variables
 *    - cookie-parser: Parse cookies
 *    - path: File paths
 *
 * ✅ FIXES MADE:
 *    1. Added payment routes
 *    2. Added raw body for Stripe webhook
 *    3. Added 404 handler
 *    4. Added error middleware
 *    5. Added production static file serving (commented for now)
 */

import express from "express";
const app = express();
app.set("query parser", "extended");
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// ⚙️ Load environment variables
const envFilePath = path.resolve(__dirname, "config/config.env");
dotenv.config({ path: envFilePath });

// 🔗 Connect to database
connectDatabase();

// 🛠️ Middleware

// ✅ JSON parser with raw body for Stripe webhook
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // ✅ Required for Stripe webhook
    },
  }),
);

// ✅ Cookie parser
app.use(cookieParser());

// ✅ URL encoded parser
app.use(express.urlencoded({ extended: true }));

// 📦 Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js"; // ✅ ADDED

// 🗺️ Route registration
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes); // ✅ ADDED

// 🌐 Production static file serving (commented - uncomment when deploying)
// if (process.env.NODE_ENV === "PRODUCTION") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
//   });
// }

// 🚫 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🚨 Error middleware (must be last)
app.use(errorMiddleware);

// 🚀 Start server
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(
    `🚀 Server started on PORT: ${port} in ${process.env.NODE_ENV} mode.`,
  );
});

// 🔥 Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

export default app;
