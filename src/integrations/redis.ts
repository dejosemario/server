import * as redis from "redis";
import { RedisClientType } from "redis";
import { Request } from "express";
import dotenv from "dotenv";
dotenv.config();

const redisClient: RedisClientType = redis.createClient({
  url: process.env.NODE_ENV === "production" ? process.env.REDIS_URL : "redis://localhost:6379",
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err: Error) => {
  console.error("Error", err);
});

redisClient.connect().catch(console.error);

export const getRedisKey = (req: Request) => {
  const key = `${req.url}|+|${
    (req as any).user ? (req as any).user.email : "-"
  }|+|${JSON.stringify((req as any).query)}|+|${JSON.stringify(
    (req as any).params
  )}`;
  return key;
};

export default redisClient;
