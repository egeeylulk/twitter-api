// // reports/reports.controller.ts
// import { Controller, Get, Res } from '@nestjs/common';
// import { ReportsService } from './reports.service';
// import { Response } from 'express';

// @Controller('reports')
// export class ReportsController {
//   constructor(private readonly reportsService: ReportsService) {}

//   @Get('users-who-tweeted')
//   async generateUsersWhoTweetedReport(@Res() res: Response): Promise<void> {
//     const report = await this.reportsService.generateUsersWhoTweetedReport();
//     res.status(report.statusCode).json(report);
//   }

//   @Get('users-who-dont-tweeted')
//   async generateUsersWhoDidNotTweetReport (@Res() res: Response): Promise<void> {
//     const report = await this.reportsService.generateUsersWhoDidNotTweetReport();
//     res.status(report.statusCode).json(report);
//   }

//   @Get('exactly-same-tweet-number')
//   async generateNumberOfTweetsExactlySameContent(@Res() res:Response) : Promise<void> {
//     const report = await this.reportsService.generateNumberOfTweetsExactlySameContent();
//     res.status(report.statusCode).json(report);
//   }
// }
