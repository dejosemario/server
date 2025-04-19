import * as redis from "redis";
import { RedisClientType } from "redis";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

// =====================
// 1. GLOBAL ERROR HANDLERS
// =====================
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// =====================
// 2. REDIS URL CHECK
// =====================
if (process.env.NODE_ENV === "production" && !process.env.REDIS_URL) {
  throw new Error("❗ REDIS_URL is not set in the environment for production!");
}

// =====================
// 3. REDIS CLIENT SETUP
// =====================
console.log(
  `Redis URL being used: ${
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_URL || "❌ Missing REDIS_URL"
      : "redis://localhost:6379"
  }`
);

const redisClient: RedisClientType = redis.createClient({
  url:
    process.env.NODE_ENV === "production"
      ? process.env.REDIS_URL
      : "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`🔁 Redis reconnect attempt: ${retries}`);
      return Math.min(retries * 50, 1000);
    },
    connectTimeout: 10000, // 10 seconds
  },
});

// =====================
// 4. LOG CONNECTION EVENTS
// =====================
redisClient.on("connect", () => {
  console.log("✅ Redis Connected");
});

redisClient.on("error", (err: Error) => {
  console.error("🚨 Redis Error:", err);
});

// =====================
// 5. ATTEMPT CONNECTION + TEST A COMMAND
// =====================
(async () => {
  try {
    await redisClient.connect();
    console.log("🎉 Redis connection established successfully");

    // Optional test command to confirm Redis is working
    const ping = await redisClient.ping();
    console.log("📡 Redis PING response:", ping); // Should log "PONG"
  } catch (error) {
    console.error("❌ Failed to connect to Redis:", error);
    process.exit(1); // Important: crash app early if Redis is crucial
  }
})();

// =====================
// 6. HELPER TO GET REDIS KEY
// =====================
export const getRedisKey = (req: Request) => {
  const key = `${req.url}|+|${
    (req as any).user ? (req as any).user.email : "-"
  }|+|${JSON.stringify((req as any).query)}|+|${JSON.stringify(
    (req as any).params
  )}`;
  return key;
};

export default redisClient;

// import * as redis from "redis";
// import { RedisClientType } from "redis";
// import { Request } from "express";
// import dotenv from "dotenv";
// dotenv.config();

// // For debugging purposes - helps identify what URL is being used
// console.log(
//   `Redis URL being used: ${
//     process.env.NODE_ENV === "production"
//       ? "Using production REDIS_URL"
//       : "Using localhost"
//   }`
// );

// const redisClient: RedisClientType = redis.createClient({
//   url:
//     process.env.NODE_ENV === "production"
//       ? process.env.REDIS_URL
//       : "redis://localhost:6379",
//   // Add socket timeout options for better error handling
//   socket: {
//     reconnectStrategy: (retries) => {
//       console.log(`Redis reconnect attempt: ${retries}`);
//       return Math.min(retries * 50, 1000); // increasing delay with max of 1s
//     },
//     connectTimeout: 10000, // 10 seconds
//   },
// });

// redisClient.on("connect", () => {
//   console.log("Redis Connected");
// });

// redisClient.on("error", (err: Error) => {
//   console.error("Redis Error", err);
// });

// // Wrap connection in try/catch to handle errors better
// (async () => {
//   try {
//     await redisClient.connect();
//     console.log("Redis connection established successfully");
//   } catch (error) {
//     console.error("Failed to connect to Redis:", error);
//   }
// })();

// export const getRedisKey = (req: Request) => {
//   const key = `${req.url}|+|${
//     (req as any).user ? (req as any).user.email : "-"
//   }|+|${JSON.stringify((req as any).query)}|+|${JSON.stringify(
//     (req as any).params
//   )}`;
//   return key;
// };

// export default redisClient;
