import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { TweetsService } from 'src/modules/tweets/tweets.service';
import { Follower } from './follower.entity';
import { IUserResponse, IUserResponse2 } from './interface';
import { RESPONSE_MESSAGES } from 'src/core/constant';


@Injectable()
export class UsersService {
  tweetRepository: any;
  constructor(
    @Inject('userRepository') // Inject the User model
    private readonly usersRepository: typeof User, // Sequelize Model
    private readonly tweetService: TweetsService, // Sequelize Model
    @Inject('followerRepository')
    private readonly followerRepository: typeof Follower
  ) {}

  async findAll(): Promise<IUserResponse> {
    try {
      const tweetList = await this.tweetService.tweetFindAll()
      const tweetMap = tweetList.reduce((ac , tweet) => {
        const key = tweet.authorId;
        

        if(!ac[key] ) {
          ac[key] = [];
         
        }
        ac[key].push( tweet.toJSON());
        
        return ac;
      }, {})
      const users = await this.usersRepository.findAll();
      const newUserList = users.map(user => {
       user=user.toJSON();
        const tweets = tweetMap[user.id]
      console.log('user :' , user.id , 'tweets: ', tweets);

        return {
          ...user,
          tweetList: tweets,
        }
      })
      return {
        data: newUserList,
        message: RESPONSE_MESSAGES.OK,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        data: [],
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOne(
    username: string,
  ): Promise<IUserResponse> {
    try {
      const user = await this.usersRepository.findOne({ where: { username } });

      if (user) {
        return {
          data: user,
          message: RESPONSE_MESSAGES.OK,
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: null,
          message: RESPONSE_MESSAGES.NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findOneById(userId: number): Promise<User | null> {
    try {
      const user = await this.usersRepository.findByPk(userId);
      return user;
    } catch (error) {
      // Handle errors
      throw new Error('Error finding user by ID');
    }
  }
  

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<IUserResponse2> {
    try {
      const user = await this.usersRepository.findOne({
        where: {
          username,
          password,
        },
      });
      if (user) {
        return {
          data: user,
          message: RESPONSE_MESSAGES.OK,
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: null,
          message: RESPONSE_MESSAGES.UNAUTHORIZED,
          statusCode: HttpStatus.UNAUTHORIZED,
        };
      }
    } catch (error) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async create(
    user: Partial<User>,
  ): Promise<IUserResponse2> {
    try {
      const newUser = await this.usersRepository.create(user);
      return {
        data: newUser,
        message: RESPONSE_MESSAGES.CREATED,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    username: string,
    updatedUser: Partial<User>,
  ): Promise<IUserResponse2> {
    try {
      await this.usersRepository.update(updatedUser, {
        where: { username },
      });
      const updated = await this.findOne(username);
      return {
        data: updated.data,
        message: updated.message,
        statusCode: updated.statusCode,
      };
    } catch (error) {
      return {
        data: null,
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async delete(
    username: string,
  ): Promise<{ data: number; message: string; statusCode: number }> {
    try {
      const deletedCount = await this.usersRepository.destroy({
        where: { username },
      });
      if (deletedCount > 0) {
        return {
          data: deletedCount,
          message: RESPONSE_MESSAGES.OK,
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: 0,
          message: RESPONSE_MESSAGES.NOT_FOUND,
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        data: 0,
        message: RESPONSE_MESSAGES.ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async followUser(followerId: number, followeeId: string): Promise<any> {
    if (followerId === Number(followeeId)) {
      
      return {
        message: RESPONSE_MESSAGES.BAD_REQUEST2,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  
    const existingFollower = await this.followerRepository.findOne({
      where: { followerId, followeeId },
    });
  
    if (existingFollower) {
      return {
        message: RESPONSE_MESSAGES.FOLLOW_CONFLICT,
        statusCode: HttpStatus.CONFLICT,
      };
    }
  
    // Create a row in the Followers table
    await this.followerRepository.create({ followerId, followeeId: Number(followeeId) });
  
    return {
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }
  
  async unfollowUser(followerId: number, followeeId: string): Promise<any> {
    if (followerId === Number(followeeId)) {
      return {
        message: RESPONSE_MESSAGES.BAD_REQUEST2,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  
    const existingFollower = await this.followerRepository.findOne({
      where: { followerId, followeeId },
    });
  
    if (!existingFollower) {
      return {
        message: RESPONSE_MESSAGES.NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  
    // Delete the row in the Followers table
    await this.followerRepository.destroy({
      where: { followerId, followeeId },
    });
  
    return {
      message: RESPONSE_MESSAGES.OK,
      statusCode: HttpStatus.OK,
    };
  }

  async listOfFollowers(userId: number): Promise<any[]> {
    try {
      const followers = await this.followerRepository.findAll({
        where: { followeeId: userId },
      });
      return followers;
    } catch (error) {
      console.error('Error in listOfFollowers service:', error);
      return [];
    }
  }

  async createFollowRequest(
    followerId: number,
    followeeId: number,
  ): Promise<Follower> {
    return this.followerRepository.create({  
      followerId,
      followeeId,
      status: 'requested', // Set the status to "requested" when creating a follow request.
    });
  }


  async acceptFollowRequest(followRequestId: number): Promise<Follower | null> {
    const followRequest = await this.followerRepository.findByPk(followRequestId);

    if (!followRequest || followRequest.status !== 'requested') {
      throw new NotFoundException('Follow request not found or already accepted.');
    }

    followRequest.status = 'accepted';
    await followRequest.save();
    return followRequest;
  }

  async rejectFollowRequest(followRequestId: number): Promise<Follower | null> {
    const followRequest = await this.followerRepository.findByPk(followRequestId);

    if (!followRequest || followRequest.status !== 'requested') {
      throw new NotFoundException('Follow request not found or already rejected.');
    }

    followRequest.status = 'rejected';
    await followRequest.save();
    return followRequest;
  }

  async findExistingRequest(followerId: number, followeeId: number): Promise<Follower | null> {
    return this.followerRepository.findOne({
      where: {
        followerId,
        followeeId,
      },
    });
  }

  async findFollowRequestsForUser(userId: number): Promise<Follower[]> {
    try {
      const followRequests = await this.followerRepository.findAll({
        where: { followeeId: userId, status: 'requested' }, // Assuming 'requested' is the status for follow requests
      });
      return followRequests;
    } catch (error) {
      // Handle errors
      throw new Error('Error finding follow requests');
    }
  }
  
}

  



 
