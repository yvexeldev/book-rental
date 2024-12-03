import { Global, Module } from '@nestjs/common';

import { Redis } from 'ioredis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { RedisClient } from '../config/constants';

@Global()
@Module({
    providers: [
        {
            provide: RedisClient,
            useFactory: (configService: ConfigService) => {
                return new Redis({
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                });
            },
            inject: [ConfigService],
        },
        RedisService,
    ],
    exports: [RedisClient, RedisService],
})
export class RedisModule {}
