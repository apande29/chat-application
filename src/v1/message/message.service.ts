import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/utils/dtos/message.dto';
import { Message } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly apiResponseHandler: ApiResponseHandler,
  ) {}

  async createMessage(
    userInfo,
    createMessageDto: CreateMessageDto,
    jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Message>> {
    try {
      const userDetails = await this.userRepository.findOneBy({
        id: jwtDetails?.id,
      });
      if (!userDetails) {
        return this.apiResponseHandler.handleFailed(
          'Invalid Jwt',
          '',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const message = new Message();
      message.senderId = userDetails.id;
      Object.assign(message, createMessageDto);
      const newMessage = await this.messageRepository.save(message);
      return this.apiResponseHandler.handleSuccess(
        'Successfully Created message',
        newMessage,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.apiResponseHandler.handleFailed(
        error.message,
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMessage(jwtDetails): Promise<IApiResponse<Message[]>> {
    try {
      const userDetails = await this.userRepository.findOneBy({
        id: jwtDetails?.id,
      });
      if (!userDetails) {
        return this.apiResponseHandler.handleFailed(
          'Invalid Jwt',
          '',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const messages = await this.messageRepository.find();
      return this.apiResponseHandler.handleSuccess(
        'Successfully returned all messages',
        messages,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.apiResponseHandler.handleFailed(
        error.message,
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getGroupMessagesByGroupId(
    groupId: string,
  ): Promise<Message[] | undefined> {
    return this.messageRepository
      .createQueryBuilder('Message')
      .select(['Message.id', 'Message.message', 'Message.groupId'])
      .where('Message.groupId = :groupId', { groupId })
      .getMany();
  }

  async getAllGroupMessages(groupId: string): Promise<IApiResponse<Message[]>> {
    try {
      const messages = await this.getGroupMessagesByGroupId(groupId);
      if (!messages?.length) {
        return this.apiResponseHandler.handleFailed(
          `No messages found`,
          '',
          HttpStatus.NO_CONTENT,
        );
      }
      return this.apiResponseHandler.handleSuccess(
        `Successfully returned all groups messages`,
        messages,
        HttpStatus.OK,
      );
    } catch (error) {
      return this.apiResponseHandler.handleFailed(
        error.message,
        error,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
