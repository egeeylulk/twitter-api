import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './like.entity'; // Make sure to provide the correct path
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProvider } from '../users/user.provider';
import { Tweet } from '../tweets/tweet.entity';
import { TweetsModule } from '../tweets/tweets.module';

@Module({
  imports: [SequelizeModule.forFeature([Like])], // Import the Like model
  controllers: [LikesController],
  providers: [LikesService,...UserProvider],
  exports: [LikesService]
})
export class LikesModule {}
