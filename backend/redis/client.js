import { createClient } from "redis";

export const redis = createClient({url: process.env.REDIS_URL});

export const connectRedis = async () => {
    if(!redis.isOpen)
        await redis.connect();
    console.log("Redis connected");
}

export const disconnectRedis = async () => {
    if(redis.isOpen)
        await redis.quit();
    console.log("Redis disconnected");
}