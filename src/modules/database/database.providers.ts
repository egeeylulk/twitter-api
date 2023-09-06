import { Sequelize } from 'sequelize-typescript';
import { DatabaseService } from './database.service'; // Correct import path
import { User } from 'src/modules/users/user.entity';
import { Tweet } from 'src/modules/tweets/tweet.entity';
import { Like } from 'src/modules/likes/like.entity';
import { Follower } from 'src/modules/users/follower.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (databaseService: DatabaseService) => {
      const sequelizeOptions = await databaseService.getSequelizeOptions(); // Use the updated method
      const sequelize = new Sequelize({
        ...sequelizeOptions,
        logging: true, // Enable Sequelize logging
      });

      sequelize.addModels([User, Tweet,Like,Follower]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [DatabaseService], // Inject the DatabaseService
  },
];
