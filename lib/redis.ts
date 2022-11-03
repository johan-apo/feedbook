import Redis from "ioredis";

const REDIS_AUTH = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};

const requiredRedisAuthOptionsAreNotSet = Object.keys(REDIS_AUTH).some(
  (property) => {
    return REDIS_AUTH[property as keyof typeof REDIS_AUTH] == undefined;
  }
);

if (requiredRedisAuthOptionsAreNotSet)
  throw new Error("Some or all Redis .env variables are not set");

const redisInstance = new Redis(REDIS_AUTH);

export default redisInstance;
