import * as redis from "redis";
import { RedisClientType } from "redis";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

console.log(
    `Redis URL being used: ${
        process.env.NODE_ENV === "production"
            ? "Using production REDIS_URL"
            : "Using localhost"
    }`,
);

const redisUrl =
    process.env.NODE_ENV === "production"
        ? process.env.REDIS_URL
        : "redis://localhost:6379";

const isRedisCloud = redisUrl?.includes("redislabs.com");

const redisClient: RedisClientType = redis.createClient({
    url: redisUrl,
    socket: {
        reconnectStrategy: (retries) => {
            console.log(`Redis reconnect attempt: ${retries}`);
            if (retries > 5) return false;
            return Math.min(retries * 50, 1000);
        },
        connectTimeout: 10000,
        ...(isRedisCloud && {
            tls: true,
            rejectUnauthorized: false,
        }),
    },
});

redisClient.on("error", (err: Error) => {
    console.error("Redis Error", err);
});

export const connectRedis = async () => {
    try {
        console.log("=== Redis Connection Debug Info ===");
        console.log("Environment:", process.env.NODE_ENV);
        console.log(
            "Redis URL:",
            process.env.REDIS_URL
                ? process.env.REDIS_URL.replace(/:[^:@]+@/, ":****@")
                : "redis://localhost:6379",
        );
        console.log("Attempting connection...");

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        console.log("✅ Redis connection established successfully");
        await redisClient.ping();
        console.log("✅ Redis PING successful");

        return true;
    } catch (error) {
        console.error("❌ Failed to connect to Redis");
        console.error("Full error:", error);
        console.log("App will continue without Redis caching");
        return false;
    }
};

export const getRedisKey = (req: Request) => {
    const key = `${req.url}|+|${
        (req as any).user ? (req as any).user.email : "-"
    }|+|${JSON.stringify((req as any).query)}|+|${JSON.stringify(
        (req as any).params,
    )}`;
    return key;
};

export default redisClient;
