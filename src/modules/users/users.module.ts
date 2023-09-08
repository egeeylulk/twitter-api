import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TweetsModule } from 'src/modules/tweets/tweets.module';
import { UserProvider } from './user.provider';
import { MyLogger } from '../logger/logger.service';

@Module({
  imports: [
    TweetsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService,...UserProvider,MyLogger], // Add DatabaseService to providers
  exports: [UsersService],
})
export class UsersModule {}
