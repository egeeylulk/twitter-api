// redis-cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis.Redis) {}

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redisClient.setex(key, ttl, JSON.stringify(value));
  }

  async get(key: string): Promise<any | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async getCachedData(key: string): Promise<any | null> {
    const cachedData = await this.redisClient.get(key);
    if (cachedData) {
      return JSON.parse(cachedData); // Assuming your data is stored as JSON
    }
    return null;
  }

  async cacheData(key: string, data: any, ttl: number = 3600): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(data), 'EX', ttl);
  }
}

