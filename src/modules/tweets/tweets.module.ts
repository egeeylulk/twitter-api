import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';
import { Tweet } from './tweet.entity';
import { DatabaseService } from 'src/modules/database/database.service';
import { LikesModule } from 'src/modules/likes/likes.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Tweet]),
  LikesModule],
  // Import the Tweet model
  controllers: [TweetsController],
  providers: [TweetsService],
  exports: [TweetsService]
})
export class TweetsModule {}
