import * as redis from "redis";
import { RedisClientType } from "redis";
import { Request } from "express";

const redisClient: RedisClientType = redis.createClient({
  // url: 'redis://red-cquav0bqf0us73a9687g:6379',
  // url: "rediss://red-cquav0bqf0us73a9687g:zSNyQ0hBDkQqmlv5xS6fQpetDnu1b0PK@oregon-redis.render.com:6379"
  url: "redis://localhost:6379",
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
