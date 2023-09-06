import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { LoginDto } from './dto/authentication.dto';
import { RegistrationDto } from './dto/registration.dto';
import { User } from 'src/modules/users/user.entity';
import { RESPONSE_MESSAGES } from 'src/core/constant';
import { ILoginResponse } from './interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateApiKey(apiKey: string): boolean {
    const apiKeys: string[] = ['api-key-1', 'api-key-2'];
    return apiKeys.includes(apiKey);
  }

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsernameAndPassword(username, pass);
    if (user) {
      return user.data;
    }
    return null;
  }

  async register(registrationDto: RegistrationDto): Promise<ILoginResponse> {
    const user = await this.usersService.create(registrationDto);
    return {
      data: user.data, // Extract the user data from the response
      message: RESPONSE_MESSAGES.REGISTERED,
      statusCode: HttpStatus.CREATED,
    };
  }

  async login(loginDto: LoginDto): Promise<{
    access_token: string;
    statusCode: number;
  }> {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (user) {
      const payload = { uid: user.id, username: user.name };
      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        statusCode: HttpStatus.OK,
      };
    }
    throw new UnauthorizedException({
      message: RESPONSE_MESSAGES.UNAUTHORIZED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }
}
