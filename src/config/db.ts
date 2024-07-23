import mongoose from "mongoose";

export const connectDB = async (MONGODB_URI: string): Promise<void> => {
  if (!MONGODB_URI) {
    console.log("MONGODB_URI not provided");
    process.exit(1); //exit the process
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }
};

