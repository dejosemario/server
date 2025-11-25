import { Redis } from "@upstash/redis";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

console.log("Redis: Using Upstash REST API");

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "http://localhost:6379",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const connectRedis = async () => {
    try {
        console.log("Testing Redis connection...");
        await redis.set("connection_test", "success");
        const result = await redis.get("connection_test");
        console.log("✅ Redis connection successful:", result);
        return true;
    } catch (error) {
        console.error("❌ Failed to connect to Redis:", error);
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

export default redis;