import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsString()
  groupId: string;
}

export class UpdateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
