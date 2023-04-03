import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Group } from 'src/entities/group.entity';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';
import { AddUsersToGroupDto, CreateGroupDto } from 'src/utils/dtos/group.dto';
import { ExtractJwt } from 'src/utils/guards/extractJwt.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createGroups(
    @Body() createGroupDto: CreateGroupDto,
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group>> {
    return this.groupService.createGroup(createGroupDto, jwtDetails);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getAllGroups(
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group[]>> {
    return this.groupService.getAllGroup(jwtDetails);
  }

  @Get('/my-groups')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getMyGroups(
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group[]>> {
    return this.groupService.getAllUserGroups('', jwtDetails);
  }

  @Post('/add-multiple-user')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async addUsersToGroup(
    @Body() addUsersToGroupDto: AddUsersToGroupDto,
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group[]>> {
    return this.groupService.addUsersToGroup(addUsersToGroupDto, jwtDetails);
  }
}
