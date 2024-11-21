import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClient } from '../config/clients';

@Injectable()
export class RedisService {
  constructor(@Inject(RedisClient) private readonly redisClient: Redis) {}

  async set(
    key: string,
    value: string,
    expirationInSeconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value, 'EX', expirationInSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
