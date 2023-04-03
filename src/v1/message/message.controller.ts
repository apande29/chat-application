import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Message } from 'src/entities/message.entity';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';
import { CreateMessageDto } from 'src/utils/dtos/message.dto';
import { ExtractJwt } from 'src/utils/guards/extractJwt.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async createMessages(
    @Body() createMessageDto: CreateMessageDto,
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Message>> {
    return this.messageService.createMessage('', createMessageDto, jwtDetails);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getAllMessages(
    @ExtractJwt() jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Message[]>> {
    return this.messageService.getAllMessage(jwtDetails);
  }

  @Get('/group-messages')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  async getAllGroupMessage(
    @Query('groupId') groupId: string,
  ): Promise<IApiResponse<Message[]>> {
    return this.messageService.getAllGroupMessages(groupId);
  }
}
