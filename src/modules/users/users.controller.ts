import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  UnprocessableEntityException,
  UseGuards,
  HttpStatus,
  Post,
  Request,
  Inject,
  InternalServerErrorException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/modules/authentication/guard/jwt-auth.guard';
import { Follower } from './follower.entity';
import { CurrentUser } from 'src/current-user.decorator';
import { MyLogger } from '../logger/logger.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    @Inject('followerRepository')
    private readonly followerRepository: typeof Follower,
    private readonly logger:MyLogger
    ) {}

    // Get all users
  @Get('findAll')
  async findAll(): Promise<{
    data: User[];
    message: string;
    statusCode: number;
  }> {
    return await this.usersService.findAll();
  }

    @Get('follow-requests')
    @UseGuards(JwtAuthGuard)
    async findFollowRequestsForUser(@CurrentUser() user): Promise<Follower[]> {
      try {
        const userId = user.userId;
        this.logger.info(`User: ${userId}`,'UsersController','users.controller.ts'); // Log the user ID
        const followRequests = await this.usersService.findFollowRequestsForUser(userId);
        return followRequests;
      } catch (error) {
        this.logger.error('Error in findFollowRequestsForUser:','UsersController','users.controller.ts');
        throw new InternalServerErrorException('An error occurred while fetching follow requests');
      }
    }




  @Get(':username/followers')
  async listOfFollowers(@Param('username') username: string): Promise<any> {
  const user = await this.usersService.findOne(username);
  if (!user) {
    this.logger.info('buradayız','UsersController','users.controller.ts');
    throw new NotFoundException('User not found');
  }

  const followers = await this.usersService.listOfFollowers(user.data.id);
  console.log(followers);
  return {
    data: followers,
    message: 'Followers retrieved successfully',
    statusCode: HttpStatus.OK,
  };
}




// Get one user
@Get(':username')
async findOne(@Param('username') username: string): Promise<{
  data: User | null;
  message: string;
  statusCode: number;
}> {
  const user = await this.usersService.findOne(username);
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

  

  

  
  //update users name
  @Put(':username')
  async update(
    @Param('username') username: string,
    @Body() updatedUser: Partial<User>,
  ): Promise<{
    data: User | null;
    message: string;
    statusCode: number;
  }> {
    const user = await this.usersService.update(username, updatedUser);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  



  // Delete user
  @Delete(':username')
  async delete(@Param('username') username: string): Promise<{
    data: number;
    message: string;
    statusCode: number;
  }> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('User not found');
    }
   

    try {
      const result = await this.usersService.delete(username);
      return result;
    } catch (error) {
      throw new UnprocessableEntityException('Error deleting user');
    }
  }

  @Post('follow/:followeeId')
  @UseGuards(JwtAuthGuard)
  async followUser(@ Request() req, @Param('followeeId') followeeId: string) {
    
    const followerId = req.user.userId;
    
    return this.usersService.followUser(followerId, followeeId);
  }
  

  @Post('unfollow/:followeeId')
  @UseGuards(JwtAuthGuard)
  async unfollowUser(@Request() req, @Param('followeeId') followeeId: string) {
    const followerId = req.user.userId;
    console.log(req.user);
    return this.usersService.unfollowUser(followerId, followeeId);
  }

  @Post('sendFollowRequest/:followeeId')
  @UseGuards(JwtAuthGuard)
  async sendFollowRequest(
    @Request() req,
    @Param('followeeId') followeeId: string,
  ) {
    const followerId = req.user.userId;

    // Check if the followerId is the same as followeeId
    if (followerId === parseInt(followeeId, 10)) {
      return {
        message: "You cannot send a follow request to yourself",
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    // Check if a follow request already exists
    const existingRequest = await this.usersService.findExistingRequest(
      followerId,
      parseInt(followeeId, 10),
    );

    if (existingRequest) {
      return {
        message: 'Follow request already sent',
        statusCode: HttpStatus.CONFLICT,
      };
    }

    // Create a new follow request
    await this.usersService.createFollowRequest(followerId, parseInt(followeeId, 10));

    return { message: 'Follow request sent', statusCode: HttpStatus.CREATED };
  }

  // Accept follow request
  @UseGuards(JwtAuthGuard)
  @Post('acceptFollowRequest/:followRequestId')
  async acceptFollowRequest(
    @Request() req,
    @Param('followRequestId') followRequestId: number,
  ) {
    const followerId = req.user.userId;

    try {
      const followRequest = await this.usersService.acceptFollowRequest(
        followRequestId,
      );
      
      if (followRequest) {
        return {
          message: 'Follow request accepted successfully',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: 'Follow request not found or already accepted',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        message: 'Error accepting follow request',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  // Reject follow request
  @UseGuards(JwtAuthGuard)
  @Post('rejectFollowRequest/:followRequestId')
  async rejectFollowRequest(
    @Request() req,
    @Param('followRequestId') followRequestId: number,
  ) {
    const followerId = req.user.userId;

    try {
      const followRequest = await this.usersService.rejectFollowRequest(
        followRequestId,
      );
      
      if (followRequest) {
        return {
          message: 'Follow request rejected successfully',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: 'Follow request not found or already rejected',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        message: 'Error rejecting follow request',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}

  


