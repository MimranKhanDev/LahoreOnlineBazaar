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
const envFilePath = path.resolve(__dirname, "config/config.env");
dotenv.config({ path: envFilePath });

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

connectDatabase();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// // 🌐 Production static file serving (commented - uncomment when deploying)
// if (process.env.NODE_ENV?.toLowerCase() === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
//   });
// }

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(
    `🚀 Server started on PORT: ${port} in ${process.env.NODE_ENV} mode.`,
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});

export default app;
