import * as redis from "redis";
import { RedisClientType } from "redis";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

// For debugging purposes - helps identify what URL is being used
console.log(
  `Redis URL being used: ${
    process.env.NODE_ENV === "production"
      ? "Using production REDIS_URL"
      : "Using localhost"
  }`
);

const redisClient: RedisClientType = redis.createClient({
  url:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_URL
      : "redis://localhost:6379",
  // Add socket timeout options for better error handling
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`Redis reconnect attempt: ${retries}`);
      if (retries > 10) return false;
      return Math.min(retries * 50, 1000); // increasing delay with max of 1s
    },
    connectTimeout: 10000, // 10 seconds
  },
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err: Error) => {
  console.error("Redis Error", err);
});

// Wrap connection in try/catch to handle errors better
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connection established successfully");
    return true;
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    console.log("App will continue without Redis caching");
    return false;
  }
};
export const getRedisKey = (req: Request) => {
  const key = `${req.url}|+|${
    (req as any).user ? (req as any).user.email : "-"
  }|+|${JSON.stringify((req as any).query)}|+|${JSON.stringify(
    (req as any).params
  )}`;
  return key;
};

export default redisClient;
