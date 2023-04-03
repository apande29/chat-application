import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';

@Module({
  imports: [JwtModule, TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, ApiResponseHandler],
  exports: [UserService],
})
export class UserModule {}
