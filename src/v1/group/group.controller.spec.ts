import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { UserGroup } from 'src/entities/user-group.entity';
import { Group } from 'src/entities/group.entity';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';
import { BackendConfigService } from 'src/config/config.service';
import { BackendConfigModule } from 'src/config/config.module';

describe('GroupController', () => {
  let groupController: GroupController;
  // let groupService: GroupService;
  let moduleRef: TestingModule;
  const userId = '1f4009c2-ab0d-4cd4-927c-dee2a337a27d';
  let groupId;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (config: BackendConfigService) =>
            config.typeormTestingConfigOptions,
          inject: [BackendConfigService],
          imports: [BackendConfigModule],
        }),
        TypeOrmModule.forFeature([Group, UserGroup, User]),
      ],
      controllers: [GroupController],
      providers: [GroupService, ApiResponseHandler],
    }).compile();

    // groupService = moduleRef.get<GroupService>(GroupService);
    groupController = moduleRef.get<GroupController>(GroupController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Create New Group', () => {
    it('should return a created group', async () => {
      const payload = {
        name: 'TeamOne',
        groupIcon: 'NANAN',
      };
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await groupController.createGroups(payload, jwtDetails);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully Created group');
      groupId = res?.data?.id;
    });

    it('should return error', async () => {
      const payload = {
        name: 'TeamOne',
        groupIcon: 'NANAN',
      };
      const jwtDetails: JwtDetailsDto = {};
      const res = await groupController.createGroups(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        'null value in column "userId" violates not-null constraint',
      );
    });

    it('should return invalid jwt', async () => {
      const payload = {
        name: 'TeamOne',
        groupIcon: 'NANAN',
      };
      const jwtDetails: JwtDetailsDto = {
        id: '1f4009c2-ab0d-4cd4-927c-dee2a337a275',
      };
      const res = await groupController.createGroups(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual('Invalid Jwt');
    });
  });

  describe('Add Users to Group', () => {
    it('should return user added success', async () => {
      const payload = {
        groupId,
        userIds: [userId],
      };
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await groupController.addUsersToGroup(payload, jwtDetails);

      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
    });

    it('should return error', async () => {
      const payload = {
        groupId,
        userIds: [userId],
      };
      const jwtDetails: JwtDetailsDto = {
        id: 'userId',
      };
      const res = await groupController.addUsersToGroup(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        'invalid input syntax for type uuid: "userId"',
      );
    });

    it('should return invalid jwt error', async () => {
      const payload = {
        groupId,
        userIds: [userId],
      };
      const jwtDetails: JwtDetailsDto = {
        id: '1dbe6d91-ca1e-44de-93af-5166e51c3956',
      };
      const res = await groupController.addUsersToGroup(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual('Invalid Jwt');
    });

    it('should return unauthorized error', async () => {
      const payload = {
        groupId: '7c99b21e-6626-4d9d-8392-d65a82e2e1b2',
        userIds: [userId],
      };
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await groupController.addUsersToGroup(payload, jwtDetails);
      console.log(res);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual('Only Admin can add users');
    });

    it('should return group not found error', async () => {
      const payload = {
        groupId: 'de36f54b-da62-41f4-bc06-b63fd639e52b',
        userIds: [userId],
      };
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await groupController.addUsersToGroup(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(400);
      expect(res.message).toEqual('Group Not found');
    });
  });

  describe('Get my Groups', () => {
    it('should return list of groups', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await groupController.getMyGroups(jwtDetails);

      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual(
        `Successfully returned all groups for user with id ${jwtDetails?.id}`,
      );
    });

    it('should return internal server error', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: 'userId',
      };
      const res = await groupController.getMyGroups(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        `invalid input syntax for type uuid: "userId"`,
      );
    });

    it('should return no group found', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: '1dbe6d91-ca1e-44de-93af-5166e51c3959',
      };
      const res = await groupController.getMyGroups(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(204);
      expect(res.message).toEqual(`No group found`);
    });

    it('should return  invalid jwt error', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: '1dbe6d91-ca1e-44de-93af-5166e51c3955',
      };
      const res = await groupController.getAllGroups(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual(`Invalid Jwt`);
    });

    it('should return 500 error', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: 'userId',
      };
      const res = await groupController.getAllGroups(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
    });
  });
});
