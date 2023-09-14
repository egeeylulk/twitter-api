import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { TweetsService } from 'src/modules/tweets/tweets.service';
import { Follower } from './follower.entity';
import { IUserResponse, IUserResponse2 } from './interface';
import { RESPONSE_MESSAGES } from 'src/core/constant';
import { MyLogger } from '../logger/logger.service';
import { RedisService } from 'nestjs-redis';
import { RedisCacheService } from '../redis/redis-cache.service';


@Injectable()
export class UsersService {
  tweetRepository: any;
  constructor(
    @Inject('userRepository') // Inject the User model
    private readonly usersRepository: typeof User, // Sequelize Model
    private readonly tweetService: TweetsService, // Sequelize Model
    @Inject('followerRepository')
    private readonly followerRepository: typeof Follower,
    private readonly logger:MyLogger,
    private readonly redisCacheService: RedisCacheService

  ) {}


  async getCachedData(key: string): Promise<any | null> {
    const cachedData = await this.redisCacheService.get(key);
    return cachedData;
  }

  async cacheData(key: string, data: any, ttl: number = 3600): Promise<void> {
    await this.redisCacheService.set(key, data, ttl);
  }
  

  async findAll(): Promise<IUserResponse> {
    const cacheKey = 'userList'; // Define a unique cache key

    try {
      this.logger.info('findAll method called', 'UsersService', 'users.service.ts');

      // Attempt to get data from Redis cache
      const cachedData = await this.redisCacheService.get(cacheKey);

      if (cachedData) {
        // If cached data exists, return it
        this.logger.info('Data retrieved from cache', 'UsersService', 'users.service.ts');
        return {
          data: cachedData,
          message: RESPONSE_MESSAGES.OK,
          statusCode: HttpStatus.OK,
        };
      }
      this.logger.info('Data retrieved from database', 'UsersService', 'users.service.ts')

      // If data is not in cache, retrieve it from the database
      const tweetList = await this.tweetService.tweetFindAll();
      const tweetMap = tweetList.reduce((ac, tweet) => {
        const key = tweet.authorId;

        if (!ac[key]) {
          ac[key] = [];
        }
        ac[key].push(tweet.toJSON());

        return ac;
      }, {});
      const users = await this.usersRepository.findAll();
      const newUserList = users.map((user) => {
        user = user.toJSON();
        const tweets = tweetMap[user.id];
        this.logger.info(`User: ${user.id}, Tweets: ${JSON.stringify(tweets)}`, 'UsersService', 'users.service.ts');

        return {
          ...user,
          tweetList: tweets,
        };
      });

      // Cache the data in Redis for future use
      await this.redisCacheService.set(cacheKey, newUserList, 3600); // Cache for 1 hour (3600 seconds)

      return {
        data: newUserList,
        message: RESPONSE_MESSAGES.OK,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('An error occurred in findAll method', 'UsersService', 'users.service.ts');
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
      this.logger.info(`findOne method called for username: ${username}`, 'UsersService', 'users.service.ts');

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
      this.logger.info(`findOneById method called for userId: ${userId}`, 'UsersService', 'users.service.ts');

      const user = await this.usersRepository.findByPk(userId);
      return user;
    } catch (error) {
      this.logger.error('An error occurred in findOneById method', 'UsersService','users.service.ts');
      // Handle errors
      throw new Error('Error finding user by ID');
    }
  }
  

  async findOneByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<IUserResponse2> {
    try {
      this.logger.info('findOneByUsernamePassword method called','UsersService','users.service.ts');
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
      this.logger.error('An error occured in findOneByUsernamePassword','UsersService','users.service.ts');
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
      this.logger.info('create method called','UsersService','users.service.ts');
      const newUser = await this.usersRepository.create(user);
      return {
        data: newUser,
        message: RESPONSE_MESSAGES.CREATED,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('An error occured','UsersService','users.service.ts');
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
      this.logger.info('delete method called','UsersService','users.service.ts');
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
      this.logger.error('An error occured in delete method','UsersService','users.service.ts');
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
      this.logger.info('listOfFollowers method called','UsersService','users.service.ts');
      const followers = await this.followerRepository.findAll({
        where: { followeeId: userId },
      });
      return followers;
    } catch (error) {
      this.logger.error('Error in listOfFollowers service:', 'UsersService','users.service.ts');
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
      this.logger.info('findFollowRequestsForUser','UsersService','users.service.ts');
      const followRequests = await this.followerRepository.findAll({
        where: { followeeId: userId, status: 'requested' }, // Assuming 'requested' is the status for follow requests
      });
      return followRequests;
    } catch (error) {
      this.logger.error('An error occured in findFollowRequestsForUser method','UsersService','users.service.ts');
      // Handle errors
      throw new Error('Error finding follow requests');
    }
  }
  
}

  



 
