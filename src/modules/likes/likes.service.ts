import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './like.entity';
import { ILikeResponse } from './interface';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like)
    private readonly likesRepository: typeof Like,
  ) {}


  async findAllLikes():Promise<
    ILikeResponse
> {
    try {
      const likes = await this.likesRepository.findAll();
      return {
        data:likes,
        message:'All likes retrieved successfully',
        statusCode:HttpStatus.OK,
      };
    } catch (error) {
      return {
        data:[],
        message: 'Error retrieving likes',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }


  
  async createLike(userId: number, tweetId: number): Promise<any> {
    try {
      // Check if the user has already liked the tweet
      const existingLike = await this.likesRepository.findOne({
        where: { userId, tweetId },
      });
  
      if (existingLike) {
        return {
          data: null,
          message: 'You have already liked this tweet',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
  
      // If the user hasn't liked the tweet before, create the like
      const newLike = await this.likesRepository.create({ userId, tweetId });
      return {
        data: newLike,
        message: 'Like created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        data: null,
        message: 'Error creating like',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  

  async deleteLike(userId: number, tweetId: number): Promise<any> {
    try {
      await this.likesRepository.destroy({ where: { userId, tweetId } });
      return {
        message: 'Like deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: 'Error deleting like',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  
}
