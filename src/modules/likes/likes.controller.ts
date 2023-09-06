import { Controller, Post, Body, Delete, Param, HttpStatus, UseFilters, UseGuards,Get} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CurrentUser } from '../../current-user.decorator'; 
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}


  @Get('findAllLikes')
  async findAllLikes(): Promise<any> {
    const result = await this.likesService.findAllLikes();
    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  @Post(':tweetId')
  @UseGuards(JwtAuthGuard)
  async createLike(
    @Param('tweetId') tweetId: number,
    @CurrentUser() user, // Use the CurrentUser decorator
  ): Promise<any> {
    const result = await this.likesService.createLike(user.userId, tweetId);

    if (!result.data) {
      return { message: result.message, statusCode: result.statusCode };
    }

    return {
      data: result.data,
      message: result.message,
      statusCode: result.statusCode,
    };
  }

  @Delete('/undo/:tweetId')
  @UseGuards(JwtAuthGuard)
  async deleteLike(
    @Param('tweetId') tweetId: number,
    @CurrentUser() user, // Use the CurrentUser decorator
  ): Promise<any> {
    const result = await this.likesService.deleteLike(user.userId, tweetId);

    if (result.statusCode !== HttpStatus.OK) {
      return { message: result.message, statusCode: result.statusCode };
    }

    return { message: result.message, statusCode: result.statusCode };
  }
}
