import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from '../database/database.service'; // Update the path to your DatabaseService
import { TweetsModule } from 'src/modules/tweets/tweets.module';
import { Follower } from './follower.entity';
import { UserProvider } from './user.provider';

@Module({
  imports: [
    TweetsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService,...UserProvider], // Add DatabaseService to providers
  exports: [UsersService],
})
export class UsersModule {}
