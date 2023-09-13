// redis.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis'; // Import Redis from 'ioredis' as a default import
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [ConfigModule], // Import ConfigModule to access environment variables
  providers: [
    {
      provide: 'RedisClient',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        });
      },
      inject: [ConfigService], // Inject ConfigService to access environment variables
    },
    RedisCacheService,
  ],
  exports: [RedisCacheService],
})
export class RedisModule {}
