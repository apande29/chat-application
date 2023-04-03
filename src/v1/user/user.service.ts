import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/utils/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly apiResponseHandler: ApiResponseHandler,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | undefined> {
    const user = new User();
    Object.assign(user, createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserByID(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUsersByGroupId(groupId: string): Promise<User[] | undefined> {
    return this.userRepository
      .createQueryBuilder('User')
      .select(['User.id', 'User.email', 'User.firstName', 'User.lastName'])
      .innerJoin('User.UserGroup', 'UserGroup')
      .where('UserGroup.groupId = :groupId', { groupId })
      .getMany();
  }

  async getAllGroupUsers(userInfo, groupId): Promise<IApiResponse<User[]>> {
    try {
      const users = await this.getUsersByGroupId(groupId);
      if (!users?.length) {
        return this.apiResponseHandler.handleFailed(
          `No user found`,
          '',
          HttpStatus.NO_CONTENT,
        );
      }
      return this.apiResponseHandler.handleSuccess(
        `Successfully returned all users for group with id ${groupId}`,
        users,
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
