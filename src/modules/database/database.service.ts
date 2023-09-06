/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Like } from 'src/modules/likes/like.entity';
import { Tweet } from 'src/modules/tweets/tweet.entity';
import { Follower } from 'src/modules/users/follower.entity';
import { User } from 'src/modules/users/user.entity';

@Injectable()
export class DatabaseService {
  constructor() {}

  async getSequelizeOptions(): Promise<SequelizeOptions> {
    return {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'nest',
    };
  }

  async initSequelize(): Promise<Sequelize> {
    const sequelizeOptions = await this.getSequelizeOptions();
    const sequelize = new Sequelize({
      ...sequelizeOptions,
      logging: true, // Enable Sequelize logging
    });
    sequelize.addModels([User, Tweet,Like,Follower]);
    await sequelize.sync({ force: true, alter: true });
    console.log('Tables synchronized');
    return sequelize;
  }
}
