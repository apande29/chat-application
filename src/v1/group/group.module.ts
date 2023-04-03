import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from 'src/entities/group.entity';
import { UserGroup } from 'src/entities/user-group.entity';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, UserGroup, User])],
  controllers: [GroupController],
  providers: [GroupService, ApiResponseHandler],
})
export class GroupModule {}
