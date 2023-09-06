import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './modules/database/database.module';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/user.entity';
import { DatabaseService } from './modules/database/database.service'; // Import DatabaseService
import { TweetsModule } from './modules/tweets/tweets.module';
import { Tweet } from './modules/tweets/tweet.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/authentication/authentication.module';
import { LikesModule } from './modules/likes/likes.module';
import { Like } from './modules/likes/like.entity';
import { Follower } from './modules/users/follower.entity';
// import { ReportsController } from './reports/reports.controller';
// import { ReportsService } from './reports/reports.service';
// import { ReportsModule } from './reports/reports.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule, DatabaseModule],
      useFactory: async (databaseService: DatabaseService) => {
        const sequelizeOptions = await databaseService.getSequelizeOptions();
        return {
          ...sequelizeOptions,
          models: [User, Tweet,Like,Follower],
        };
      },
      inject: [DatabaseService],
    }),
    UsersModule,
    TweetsModule,
    AuthModule,
    LikesModule,
    // ReportsModule,
  
  ],
  controllers: [AppController,],
  providers: [DatabaseService, AppService,], // Add DatabaseService to providers
})
export class AppModule {}
