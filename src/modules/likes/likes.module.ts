import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { Like } from './like.entity'; // Make sure to provide the correct path
import { SequelizeModule } from '@nestjs/sequelize';
import { UserProvider } from '../users/user.provider';
import { MyLogger } from '../logger/logger.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [SequelizeModule.forFeature([Like]),RedisModule], // Import the Like model
  controllers: [LikesController],
  providers: [LikesService,...UserProvider,MyLogger],
  exports: [LikesService]
})
export class LikesModule {}
