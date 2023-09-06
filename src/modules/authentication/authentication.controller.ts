import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/authentication.dto';
import { AuthenticationService } from './authentication.service';
import { RegistrationDto } from './dto/registration.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Request, Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationDto: RegistrationDto) {
    return await this.authenticationService.register(registrationDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authenticationService.login(loginDto);
  }

  @Get('jwt')
  @UseGuards(JwtAuthGuard)
  async jwt(@Req() req: Request) {
    console.log('Jwt route triggered', req.user);
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    // Clear the token from the client-side (e.g., remove from local storage or cookies)
    res.clearCookie('access_token'); // Clear the cookie

    return { message: 'Logged out successfully' };
  }
}
