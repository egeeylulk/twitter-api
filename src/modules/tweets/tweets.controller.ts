import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { Tweet } from './tweet.entity';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { CurrentUser } from '../../current-user.decorator'; 
import { LikesService } from 'src/modules/likes/likes.service';

@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService,
    private readonly likesService: LikesService) {}

  @Get('findAll')
  async findAll(): Promise<any> {
    const result = await this.tweetsService.findAll();
    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

   @Get('findAllTweetsWithLikes')
   async findAllTweetsWithLikes(): Promise<{
    data:Tweet[];
    message: string;
    statusCode: number;
}>{
  return await this.tweetsService.findAllTweetsWithLikes();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<any> {
    const result = await this.tweetsService.findOne(id);
    if (!result.data) {
      return { message: result.message };
    }
    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  @Get('author/:authorId')
  async findTweetsByAuthor(@Param('authorId') authorId: number): Promise<any> {
    const result = await this.tweetsService.findTweetsByAuthor(authorId);
    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  @Post('create')
@UseGuards(JwtAuthGuard)
async create(@Body('content') tweetContent: string, @CurrentUser() user): Promise<any> {
  const result = await this.tweetsService.create(user.userId, tweetContent);
  return {
    data: result.data,
    message: result.message,
    statusCode: result.statusCode,
  };
}


  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() tweet: Partial<Tweet>,
  ): Promise<any> {
    const result = await this.tweetsService.update(id, tweet);
    if (!result.data) {
      return { message: result.message };
    }
    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUsersTweet(
    @Body() tweet: Tweet,
    @CurrentUser() user, // Use the CurrentUser decorator
  ): Promise<any> {
    const result = await this.tweetsService.updateUsersTweet(user.userId, tweet);

    if (!result.data) {
      return { message: result.message, statusCode: result.statusCode };
    }

    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<any> {
    const result = await this.tweetsService.delete(id);
    return { message: result.message, statusCode: result.statusCode };
  }

  
}
