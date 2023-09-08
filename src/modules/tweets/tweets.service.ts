import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tweet } from './tweet.entity';
import { LikesService } from 'src/modules/likes/likes.service';
import { Like } from 'src/modules/likes/like.entity'
import { ITweetResponse, ITweetResponse2 } from './interface';
import { RESPONSE_MESSAGES } from 'src/core/constant';
import { MyLogger } from '../logger/logger.service';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet)
    private readonly tweetsRepository: typeof Tweet,
    // private readonly usersRepository: typeof User,
    private readonly likesService: LikesService,
    private readonly logger:MyLogger
    
  ) {}

  async findAll(): Promise<ITweetResponse> {
    const tweets = await this.tweetsRepository.findAll({
      include: [{ association: 'author', attributes: ['id', 'name', 'email'] }],
    });
    return {
      data: tweets,
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }
  async tweetFindAll(): Promise<Tweet[]> {
   return this.tweetsRepository.findAll();
  }
  async findOne(id: number): Promise<ITweetResponse2> {
    const tweets = await this.tweetsRepository.findByPk(id, {
      include: [{ association: 'author', attributes: ['id', 'name', 'email'] }],
    });
    if (!tweets) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  
    return {
      data: tweets,
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }
  

  async findTweetsByAuthor(
    authorId: number,
  ): Promise<ITweetResponse> {
    const tweets = await this.tweetsRepository.findAll({
      where: { authorId },
      include: [{ association: 'author', attributes: ['id', 'name', 'email'] }],
    });
    if (!tweets) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      data: tweets,
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }

  


  async update(
    id: number,
    tweet: Partial<Tweet>,
  ): Promise<ITweetResponse2> {
    const [affectedCount, affectedRows] = await this.tweetsRepository.update(
      tweet,
      {
        where: { id },
        returning: true, // This ensures that the updated rows are returned
      },
    );

    if (affectedCount === 0) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: affectedRows[0],
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }


  async updateUsersTweet(
    userId: number, // Pass the userId of the authenticated user
    tweet: Partial<Tweet>,
  ): Promise<ITweetResponse2> {
    const existingTweet = await this.findOne(tweet.id);

    if (!existingTweet.data) {
      return { data: null, message: 'Tweet not found', statusCode: HttpStatus.NOT_FOUND };
    }

    // Check if the authenticated user is the author of the tweet being updated
    if (existingTweet.data.authorId !== userId) {
      return { data: null, message: RESPONSE_MESSAGES.UNAUTHORIZED, statusCode: HttpStatus.UNAUTHORIZED };
    }

    const result = await this.update(tweet.id, tweet);

    if (!result.data) {
      return { data: null, message: result.message, statusCode: result.statusCode };
    }

    return {
      data: result.data,
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }


  async delete(id: number): Promise<{ message: string; statusCode: number }> {
    const affectedRowCount = await this.tweetsRepository.destroy({
      where: { id },
    });
    if (affectedRowCount === 0) {
      return {
        message: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      message: RESPONSE_MESSAGES.NO_CONTENT,
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

   async findAllTweetsWithLikes(): Promise<{ 
    data:any[];
    message:string;
    statusCode:number;
  }> {
    try {
      this.logger.info('findAllTweetsWithLikes method called','TweetsService','tweets.service.file');
    const likesResponse = await this.likesService.findAllLikes(); 
    const likesList: Like[] = likesResponse.data; 
    const likesMap = likesList.reduce((acc,like)=> {
    const key =like.tweetId;

      if(!acc[key]) {
        acc[key] = [];
        
      }
      
      acc[key].push(like.toJSON());
      return acc;
    },{})
    const tweets = await this.tweetsRepository.findAll();
    const newTweetList= tweets.map(tweet => {
      tweet=tweet.toJSON();
      const likes = likesMap[tweet.id];
      console.log('tweet :' , tweet.id , 'likes: ', likes);

      return{
        ...tweet,
        likesList:likes,
      }
    })
    return{
      data:newTweetList,
      message:RESPONSE_MESSAGES.OK,
      statusCode:HttpStatus.OK,
    };
  } catch(error) {
    this.logger.error('An error occured in findAllTweetsWithLikes','TweetsService','tweets.service.ts');
    return {
      data:[],
      message: RESPONSE_MESSAGES.ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  }

  async create(userId: number, content: string): Promise<ITweetResponse2> {
  try {
    const tweet = await this.tweetsRepository.create({ authorId: userId, content });
    return {
      data: tweet,
      message: RESPONSE_MESSAGES.CREATED,
      statusCode: HttpStatus.CREATED,
    };
  } catch (error) {
    this.logger.error('Error creating tweet:','TweetsService','tweets.service.ts');
    return {
      data: null,
      message: RESPONSE_MESSAGES.ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}


  
}
