import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tweet } from './tweet.entity';
import { LikesService } from 'src/modules/likes/likes.service';
import { Like } from 'src/modules/likes/like.entity'
import { ITweetResponse, ITweetResponse2 } from './interface';

@Injectable()
export class TweetsService {
  constructor(
    @InjectModel(Tweet)
    private readonly tweetsRepository: typeof Tweet,
    // private readonly usersRepository: typeof User,
    private readonly likesService: LikesService,
  ) {}

  async findAll(): Promise<ITweetResponse> {
    const tweets = await this.tweetsRepository.findAll({
      include: [{ association: 'author', attributes: ['id', 'name', 'email'] }],
    });
    return {
      data: tweets,
      message: 'Tweets retrieved successfully',
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
        message: 'Tweet not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  
    return {
      data: tweets,
      message: 'Tweets retrieved successfully',
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
        message: 'Tweet not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      data: tweets,
      message: 'Tweets retrieved successfully',
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
        message: 'Tweet not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }

    return {
      data: affectedRows[0],
      message: 'Tweet updated successfully',
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
      return { data: null, message: 'You are not authorized to update this tweet', statusCode: HttpStatus.UNAUTHORIZED };
    }

    const result = await this.update(tweet.id, tweet);

    if (!result.data) {
      return { data: null, message: result.message, statusCode: result.statusCode };
    }

    return {
      data: result.data,
      message: 'Tweet updated successfully',
      statusCode: HttpStatus.OK,
    };
  }


  async delete(id: number): Promise<{ message: string; statusCode: number }> {
    const affectedRowCount = await this.tweetsRepository.destroy({
      where: { id },
    });
    if (affectedRowCount === 0) {
      return {
        message: 'Tweet not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
    return {
      message: 'tweet deleted successfully',
      statusCode: HttpStatus.NO_CONTENT,
    };
  }

   async findAllTweetsWithLikes(): Promise<{ 
    data:any[];
    message:string;
    statusCode:number;
  }> {
    try{
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
      message:'Tweet Retrieved Successfully',
      statusCode:HttpStatus.OK,
    };
  } catch(error) {
    return {
      data:[],
      message: 'Error retriving Tweets',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  }

  async create(userId: number, content: string): Promise<ITweetResponse2> {
  try {
    const tweet = await this.tweetsRepository.create({ authorId: userId, content });
    return {
      data: tweet,
      message: 'Tweet created successfully',
      statusCode: HttpStatus.CREATED,
    };
  } catch (error) {
    console.error('Error creating tweet:', error);
    return {
      data: null,
      message: 'An error occurred while creating a tweet',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }
}


  
}
