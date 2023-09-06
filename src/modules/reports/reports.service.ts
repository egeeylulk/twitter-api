// // reports/reports.service.ts
// import { Injectable } from '@nestjs/common';
// import { TweetsService } from '../tweets/tweets.service';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class ReportsService {
//     constructor(private readonly tweetsService: TweetsService,
//     private readonly usersService: UsersService,) {}


//     async showUsersTweeeted(): Promise<{ data: }



//   async generateUsersWhoTweetedReport(): Promise<{ data: number[]; message: string; statusCode: number }> {


//     const tweets = await this.tweetsService.findAll();
//     const usersWhoTweeted = tweets.data.map(tweet => tweet.authorId);
//     return {
//       data: usersWhoTweeted,
//       message: 'Users who tweeted report generated successfully',
//       statusCode: 200,
//     };
//   }

//   async generateUsersWhoDidNotTweetReport(): Promise<{ data: number[]; message: string; statusCode: number }> {
//     const allUsers = await this.usersService.findAll();
//     const tweets = await this.tweetsService.findAll();
  
//     const usersWhoTweeted = tweets.data.map(tweet => tweet.authorId);
//     const usersWhoDidNotTweet = allUsers.data.filter(user => !usersWhoTweeted.includes(user.id));
  
//     return {
//       data: usersWhoDidNotTweet.map(user => user.id),
//       message: 'Users who did not tweet report generated successfully',
//       statusCode: 200,
//     };
//   }

//   async generateNumberOfTweetsExactlySameContent(): Promise<{ data:{}; message: string; statusCode:number}>{
//     const tweets = await this.tweetsService.findAll();



//   //   //
//   //   const tweetcontent = tweets.data.map(tweet => tweet.content);
//   //   const cnt = {};
//   //  tweetcontent.forEach(element => {
//   //   if(cnt[element]){
//   //   cnt[element] += 1;
//   //   }
//   //   else{
//   //     cnt[element] = 1;
//   //   }
    
//   });

//    return {
//     data: cnt,
//     message: 'Users who did not tweet report generated successfully',
//     statusCode: 200,
//   };

//   }

//   async generateNumberOfTweetsExactlySameContent2(): Promise<{ 
//     data: Record<string,number>;
//     message:string;
//     statusCode:number;

//   }> {
//     const tweets = 
//   }
  
// }
