import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

interface Config {
  [key: string]: {
    MONGODB_URI: string | undefined;
  };
}

const config: Config = {
  production: {
    MONGODB_URI: process.env.PRODUCTION_MONGODB_URI,
  },
  staging: {
    MONGODB_URI: process.env.STAGING_MONGODB_URI,
  },
  development: {
    MONGODB_URI: process.env.DEVELOPMENT_MONGODB_URI,
  },
};

const getMongoUrl = async (env: string = "development"): Promise<string> => {
  return config[env.trim()]?.MONGODB_URI as string;
};

const connectDB = async () => {
  const env = process.env.NODE_ENV || "development";
  const MONGODB_URI = await getMongoUrl(env);

  if (!MONGODB_URI) {
    process.exit(1); //exit the process
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    process.exit(1);
  }
};

export { connectDB, getMongoUrl };
