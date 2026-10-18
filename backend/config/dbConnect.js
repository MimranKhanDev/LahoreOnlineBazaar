import mongoose from "mongoose";

export const connectDatabase = async () => {
  const DB_URL =
    process.env.NODE_ENV?.toLowerCase() === "production"
      ? process.env.MONGO_URI
      : process.env.LOCALDB_URL;
  if (!DB_URL) {
    throw new Error(
      "Missing database URL. Set LOCALDB_URL for development or MONGO_URI for production.",
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
