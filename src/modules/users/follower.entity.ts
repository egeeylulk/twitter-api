import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { User } from 'src/modules/users/user.entity';

@Table
export class Follower extends Model<Follower> {

  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  
  @ForeignKey(() => User)
  @Column
  followerId: number;

  @BelongsTo(() => User, 'followerId')
  follower: User;

  @ForeignKey(() => User)
  @Column
  followeeId: number;

  @BelongsTo(() => User, 'followeeId')
  followee: User;

  @Column({
    type:DataType.ENUM('requested','accepted','rejected'),
    allowNull:false,
    defaultValue:'requested'

  })
  status: 'requested'| 'accepted'| 'rejected'
}