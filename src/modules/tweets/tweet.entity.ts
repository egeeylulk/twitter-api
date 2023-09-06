import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Like } from 'src/modules/likes/like.entity';
import { User } from 'src/modules/users/user.entity';


@Table
export class Tweet extends Model<Tweet> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  // tweet.entity.ts
// @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true }) // Default to true (public)
// isPublic: boolean;


  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => User) // Define the foreign key
  @Column
  authorId: number;

  @BelongsTo(() => User, 'authorId') // Define the association
  author: User;

  @CreatedAt
  @Column
  createdAt: Date;

  @DeletedAt
  @Column
  deletedAt: Date;

  @HasMany(() => Like)
  likes: Like[];
}
