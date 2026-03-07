import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const MONGODB_URI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/ahla-fawda";

    if (!process.env.MONGODB_URI) {
      console.warn(
        "Warning: MONGODB_URI is not defined in .env. Using fallback locally.",
      );
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully");
  } catch (err: any) {
    console.error("Critical: Could not connect to MongoDB");
    console.error("Error Message:", err.message);
    if (err.message.includes("ETIMEOUT")) {
      console.error(
        "Tip: Check if your network allows connecting to MongoDB Atlas or if your IP is whitelisted.",
      );
    }
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
