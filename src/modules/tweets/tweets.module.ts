import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { Tweet } from './tweet.entity';
import { LikesModule } from 'src/modules/likes/likes.module';
import { MyLogger } from '../logger/logger.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([Tweet]),
  LikesModule,RedisModule],
  // Import the Tweet model
  controllers: [TweetsController],
  providers: [TweetsService,MyLogger],
  exports: [TweetsService]
})
export class TweetsModule {}
