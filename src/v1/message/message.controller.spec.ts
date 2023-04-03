import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { UserGroup } from 'src/entities/user-group.entity';
import { Message } from 'src/entities/message.entity';
import { Group } from 'src/entities/group.entity';
import { JwtDetailsDto } from 'src/utils/dtos/auth.dto';

describe('MessageController', () => {
  let messageController: MessageController;
  // let messageService: MessageService;
  let moduleRef: TestingModule;
  const userId = '1f4009c2-ab0d-4cd4-927c-dee2a337a27d';
  const groupId = 'e68d06af-d581-4f83-8000-a5db51fe114e';

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
          entities: [User, Message, UserGroup, Group],
          synchronize: false,
        }),
        TypeOrmModule.forFeature([User, Message]),
      ],
      controllers: [MessageController],
      providers: [MessageService, ApiResponseHandler],
    }).compile();

    // messageService = moduleRef.get<MessageService>(MessageService);
    messageController = moduleRef.get<MessageController>(MessageController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Create New Message', () => {
    it('should return a created message', async () => {
      const payload = {
        message: 'Hello Indore',
        groupId: groupId,
      };
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await messageController.createMessages(payload, jwtDetails);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully Created message');
    });

    it('should return error', async () => {
      const payload = {
        message: 'Hello Indore',
        groupId: groupId,
      };
      const jwtDetails: JwtDetailsDto = {
        id: 'userId',
      };
      const res = await messageController.createMessages(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        'invalid input syntax for type uuid: "userId"',
      );
    });

    it('should return invalid JWT', async () => {
      const payload = {
        message: 'Hello Indore',
        groupId: groupId,
      };
      const jwtDetails: JwtDetailsDto = {
        id: '1dbe6d91-ca1e-44de-93af-5166e51c3950',
      };
      const res = await messageController.createMessages(payload, jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual('Invalid Jwt');
    });
  });

  describe('Get All Message', () => {
    it('should return a created user', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: userId,
      };
      const res = await messageController.getAllMessages(jwtDetails);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully returned all messages');
    });

    it('should return error', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: 'userId',
      };
      const res = await messageController.getAllMessages(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        'invalid input syntax for type uuid: "userId"',
      );
    });

    it('should return invalid jwt', async () => {
      const jwtDetails: JwtDetailsDto = {
        id: '1dbe6d91-ca1e-44de-93af-5166e51c3950',
      };
      const res = await messageController.getAllMessages(jwtDetails);
      expect(res.success).toBe(false);
      expect(res.status).toBe(401);
      expect(res.message).toEqual('Invalid Jwt');
    });
  });

  describe('Get All Group Message', () => {
    it('should return all group messages', async () => {
      const res = await messageController.getAllGroupMessage(groupId);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully returned all groups messages');
    });

    it('should return a error', async () => {
      const res = await messageController.getAllGroupMessage('groupId');
      expect(res.success).toBe(false);
      expect(res.status).toBe(500);
      expect(res.message).toEqual(
        'invalid input syntax for type uuid: "groupId"',
      );
    });

    it('should return a error', async () => {
      const res = await messageController.getAllGroupMessage(
        '4794d075-1dc3-422d-88ff-c4f50f3a9e46',
      );
      expect(res.success).toBe(false);
      expect(res.status).toBe(204);
      expect(res.message).toEqual('No messages found');
    });
  });
});
