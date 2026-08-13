import express from "express";
const app = express();
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down due to uncaught expection");
  process.exit(1);
});

const envFilePath = path.resolve(__dirname, "config/config.env");
dotenv.config({ path: envFilePath });

// Connecting to database
connectDatabase();

app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
);
// app.use(cookieParser());

// Import all routes
import productRoutes from "./routes/products.js";
// import authRoutes from "./routes/auth.js";
// import orderRoutes from "./routes/order.js";
// import paymentRoutes from "./routes/payment.js";

app.use("/api/v1", productRoutes);
// app.use("/api/v1", authRoutes);
// app.use("/api/v1", orderRoutes);
// app.use("/api/v1", paymentRoutes);

// if (process.env.NODE_ENV === "PRODUCTION") {
//   app.use(express.static(path.join(__dirname, "../client/build")));

//   app.get(/.*/, (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
//   });
// }

// Using error middleware
// app.use(errorMiddleware);

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(
    `Server started on PORT: ${port} in ${process.env.NODE_ENV} mode.`,
  );
});

//Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
