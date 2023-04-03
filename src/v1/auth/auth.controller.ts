import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { CreateUserDto, LoginDto } from 'src/utils/dtos/user.dto';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async createUsers(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IApiResponse<User>> {
    return this.authService.registerUser(createUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto): Promise<IApiResponse<any>> {
    return this.authService.authenticateUser(loginDto);
  }
}
