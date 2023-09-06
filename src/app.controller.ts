import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyAuthGuard } from './modules/authentication/guard/apikey-auth.guard';
import { AuthenticationService } from './modules/authentication/authentication.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthenticationService,
  ) {}

  @Get()
  @UseGuards(ApiKeyAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
