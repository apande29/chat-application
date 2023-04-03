import {
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/group-users')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getGroupUsers(
    @Query('groupId') groupId: string,
  ): Promise<IApiResponse<User[]>> {
    return this.userService.getAllGroupUsers('', groupId);
  }
}
