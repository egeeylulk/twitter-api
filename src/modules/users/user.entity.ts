import { Table, Column, Model, DataType, HasMany, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import { Like } from 'src/modules/likes/like.entity';
import { Tweet } from 'src/modules/tweets/tweet.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  private: boolean;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
  

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique:true
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  surname: string;

  @Column({
    type: DataType.DATE,
  })
  createdAt: any;

  @Column({
    type:DataType.STRING,
    unique:true
  })
  username:string

  @HasMany(() => Tweet) // Define the association
  tweets: Tweet[];

  @HasMany(() => Like)
  likes: Like[];


  
}
