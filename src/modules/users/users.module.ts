import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TweetsModule } from 'src/modules/tweets/tweets.module';
import { UserProvider } from './user.provider';
import { MyLogger } from '../logger/logger.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisService } from 'nestjs-redis';
import { RedisModule } from '../redis/redis.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TweetsModule,
    ConfigModule.forRoot(),
    RedisModule
  ],
  controllers: [UsersController],
  providers: [UsersService,...UserProvider,MyLogger,], // Add DatabaseService to providers
  exports: [UsersService],
})
export class UsersModule {}
