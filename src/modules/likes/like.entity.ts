import {
    Table,
    Column,
    Model,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
  import { User } from '../users/user.entity';
  import { Tweet } from '../tweets/tweet.entity';
  
  @Table
  export class Like extends Model<Like> {
    @ForeignKey(() => User)
    @Column
    userId: number;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => Tweet)
    @Column
    tweetId: number;
  
    @BelongsTo(() => Tweet)
    tweet: Tweet;
  }
  