import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddUsersToGroupDto, CreateGroupDto } from 'src/utils/dtos/group.dto';
import { Group } from 'src/entities/group.entity';
import { Repository } from 'typeorm';
import { IApiResponse } from 'src/utils/interfaces/global.interface';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { UserGroup } from 'src/entities/user-group.entity';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly apiResponseHandler: ApiResponseHandler,
  ) {}

  async createGroup(
    createGroupDto: CreateGroupDto,
    jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group>> {
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
      const group = new Group();
      Object.assign(group, createGroupDto);
      const newGroup = await this.groupRepository.save(group);
      const userGroupDto = {
        userId: jwtDetails?.id,
        groupId: newGroup.id,
        isAdmin: true,
      };
      const userGroup = new UserGroup();
      Object.assign(userGroup, userGroupDto);
      await this.userGroupRepository.save(userGroup);
      return this.apiResponseHandler.handleSuccess(
        'Successfully Created group',
        newGroup,
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

  async getAllGroup(jwtDetails: JwtDetailsDto): Promise<IApiResponse<Group[]>> {
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
      const groups = await this.groupRepository.find();
      return this.apiResponseHandler.handleSuccess(
        'Successfully returned all groups',
        groups,
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

  async addUsersToGroup(
    addUsersToGroupDto: AddUsersToGroupDto,
    jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group[]>> {
    try {
      const userDetails = await this.userRepository.findOneBy({
        id: jwtDetails?.id,
        email: jwtDetails?.email,
      });
      if (!userDetails) {
        return this.apiResponseHandler.handleFailed(
          'Invalid Jwt',
          '',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const groupDetails = await this.groupRepository.findOneBy({
        id: addUsersToGroupDto.groupId,
      });
      if (!groupDetails) {
        return this.apiResponseHandler.handleFailed(
          'Group Not found',
          '',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userGroupDetails = await this.userGroupRepository.findOneBy({
        groupId: addUsersToGroupDto?.groupId,
        userId: userDetails?.id,
      });
      if (!userGroupDetails?.isAdmin) {
        return this.apiResponseHandler.handleFailed(
          'Only Admin can add users',
          '',
          HttpStatus.UNAUTHORIZED,
        );
      }

      await Promise.all(
        addUsersToGroupDto?.userIds?.map(async (userId) => {
          const userGroupDto = {
            userId: userId,
            groupId: groupDetails.id,
          };
          await this.userGroupRepository.upsert(userGroupDto, [
            'userId',
            'groupId',
          ]);
        }),
      );
      return this.apiResponseHandler.handleSuccess(
        `Successfully added all users to group with ${addUsersToGroupDto.groupId}`,
        groupDetails,
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

  async getGroupByUserId(userId: string): Promise<Group[] | undefined> {
    return (
      this.groupRepository
        .createQueryBuilder('Group')
        //.select(['Group.id', 'Group.name', 'Group.groupIcon'])
        .innerJoin('Group.UserGroup', 'UserGroup')
        .where('UserGroup.userId = :userId', { userId })
        .getMany()
    );
  }

  async getAllUserGroups(
    userInfo,
    jwtDetails: JwtDetailsDto,
  ): Promise<IApiResponse<Group[]>> {
    try {
      const groups = await this.getGroupByUserId(jwtDetails?.id);
      if (!groups?.length) {
        return this.apiResponseHandler.handleFailed(
          `No group found`,
          '',
          HttpStatus.NO_CONTENT,
        );
      }
      return this.apiResponseHandler.handleSuccess(
        `Successfully returned all groups for user with id ${jwtDetails?.id}`,
        groups,
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
