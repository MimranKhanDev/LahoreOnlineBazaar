import mongoose from "mongoose";

export const connectDatabase = async () => {
  const DB_URL =
    process.env.NODE_ENV === "PRODUCTION"
      ? process.env.DB_URL
      : process.env.DB_LOCAL_URL;

  if (!DB_URL) {
    throw new Error(
      "Missing database URL. Set DB_LOCAL_URL for development or DB_URL for production.",
    );
  }

  try {
    const con = await mongoose.connect(DB_URL);
    console.log(`MongoDB connected: ${con.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
