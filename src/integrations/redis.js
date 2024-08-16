import redis from "redis";

const client = redis.createClient({
  url: "redis://red-cquav0bqf0us73a9687g:6379",
});

client.on("connect", () => {
  console.log("Redis Connected");
});

client.on("error", (err) => {
  console.log("Error", err);
});

export default client;
