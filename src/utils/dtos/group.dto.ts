import { IsString, IsUUID, IsNotEmpty, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  groupIcon: string;
}

export class UpdateGroupDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class AddUsersToGroupDto {
  @IsString()
  groupId: string;

  @IsArray()
  userIds: Array<string>;
}
