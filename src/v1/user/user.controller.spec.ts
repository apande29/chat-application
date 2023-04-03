import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { JwtModule } from '@nestjs/jwt';
import { UserGroup } from 'src/entities/user-group.entity';
import { Message } from 'src/entities/message.entity';
import { Group } from 'src/entities/group.entity';
import configuration from 'src/config/configuration';
import { Constants } from 'src/utils/constants/constants';

describe('UserController', () => {
  let userController: UserController;
  // let userService: UserService;
  let moduleRef: TestingModule;
  // const userId = '1f4009c2-ab0d-4cd4-927c-dee2a337a27d';
  const groupId = 'ec156734-e19f-4649-baf1-ab59c280c3fb';

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'chat',
          entities: [User, Group, Message, UserGroup],
          synchronize: true,
        }),
        JwtModule.register({
          secret: configuration().keys.jwtServerSecret,
          signOptions: { expiresIn: Constants.TOKEN_LIFETIME_IN_SECONDS },
        }),
        TypeOrmModule.forFeature([User]),
      ],
      controllers: [UserController],
      providers: [UserService, UserService, ApiResponseHandler],
    }).compile();

    // userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Get Users of group', () => {
    it('should return list of users by groupId', async () => {
      const res = await userController.getGroupUsers(groupId);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual(
        `Successfully returned all users for group with id ${groupId}`,
      );
    });
  });
});
