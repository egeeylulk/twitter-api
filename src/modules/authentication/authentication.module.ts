import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from 'src/modules/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ApiKeyStrategy } from './strategy/apikey.strategy';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.register({
      secret: 'jwt-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthenticationService,
    ApiKeyStrategy,
    LocalStrategy,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthenticationService, JwtStrategy, JwtAuthGuard],
  controllers: [AuthenticationController],
})
export class AuthModule {}
