import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import configuration from 'src/config/configuration';
import { Constants } from 'src/utils/constants/constants';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configuration().keys.jwtServerSecret,
      signOptions: { expiresIn: Constants.TOKEN_LIFETIME_IN_SECONDS },
    }),
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, ApiResponseHandler, JwtStrategy],
})
export class AuthModule {}
