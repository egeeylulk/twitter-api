import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Like } from './like.entity';
import { ILikeResponse } from './interface';
import { RESPONSE_MESSAGES } from 'src/core/constant';
import { Tweet } from '../tweets/tweet.entity';
import { Follower } from '../users/follower.entity';
import { User } from '../users/user.entity';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class LikesService {
  constructor(
   // @InjectModel(Like)
    @Inject('likesRepository')
    private readonly likesRepository: typeof Like,
    @Inject('tweetsRepository')
    private readonly tweetsRepository: typeof Tweet,
    @Inject('followerRepository')
    private readonly followerRepository: typeof Follower,
    private readonly logger:MyLogger
    
  ) {}


  async findAllLikes():Promise<
    ILikeResponse
> {
    try {
      this.logger.info('findAllLikes method called','LikesService','likes.service.ts');
      const likes = await this.likesRepository.findAll();
      return {
        data:likes,
        message:RESPONSE_MESSAGES.OK,
        statusCode:HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('An error occured in findAllLikes','LikesService','likes.service.ts');
      return {
        data:[],
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }


  
  async createLike(userId: number, tweetId: number): Promise<any> {
    try {
      this.logger.info('createLike method called','LikesService','likes.service.ts');
      // Check if the user has already liked the tweet
      const existingLike = await this.likesRepository.findOne({
        where: { userId, tweetId },
      });
  
      if (existingLike) {
        return {
          data: null,
          message: RESPONSE_MESSAGES.BAD_REQUEST,
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }
      //check if the tweet is from private acoount
      const tweet =await this.tweetsRepository.findByPk(tweetId, {
        include:{
          model:User,
          as: 'author',
        },
      });
      if(!tweet ) {
        return{
          data:null,
          message:RESPONSE_MESSAGES.NOT_FOUND,
          statusCode:HttpStatus.NOT_FOUND,
        };
      }
      if(tweet.author.private) {
        const isFollowing = await this.followerRepository.findOne({
          where: {followerId:userId, followeeId:tweet.authorId},
        });
        if (!isFollowing) {
          return {
            data:null,
            message: RESPONSE_MESSAGES.FORBIDDEN,
            statusCode: HttpStatus.FORBIDDEN,
          };
        }
      }

     // If the user hasn't liked the tweet before, create the like
     const newLike = await this.likesRepository.create({ userId, tweetId });
     return {
       data: newLike,
       message: RESPONSE_MESSAGES.CREATED,
       statusCode: HttpStatus.CREATED,
             };
   } catch (error) {
    this.logger.error('an error occured in createLike method','LikesService','likes.service.ts')
           return {
           data: null,
           message: RESPONSE_MESSAGES.ERROR,
           statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
         };
      }
   }
  
      
  

  async deleteLike(userId: number, tweetId: number): Promise<any> {
    try {
      this.logger.info('deleteLike meethod called','LikesService','likes.service.ts')
      await this.likesRepository.destroy({ where: { userId, tweetId } });
      return {
        message: RESPONSE_MESSAGES.OK,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('An error occured in deleteLike method','LikesService','likes.service.ts')
      return {
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  
}
