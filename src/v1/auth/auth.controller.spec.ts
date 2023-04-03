import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiResponseHandler } from 'src/utils/helpers/ApiResponseHandler';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserGroup } from 'src/entities/user-group.entity';
import { Message } from 'src/entities/message.entity';
import { Group } from 'src/entities/group.entity';
import configuration from 'src/config/configuration';
import { Constants } from 'src/utils/constants/constants';

describe('AuthController', () => {
  let authController: AuthController;
  //let authService: AuthService;
  let moduleRef: TestingModule;

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
      controllers: [AuthController],
      providers: [AuthService, UserService, ApiResponseHandler],
    }).compile();

    // authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('Register New User', () => {
    it('should return a created user', async () => {
      const payload = {
        firstName: 'Vitthal',
        lastName: 'Anjana',
        email: 'akash22@deqode.com',
        password: '123456',
      };
      const res = await authController.createUsers(payload);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully registered user');
    });
  });

  describe('Login User', () => {
    it('should return login token', async () => {
      const payload = {
        email: 'vitthal@deqode.com',
        password: '123456',
      };
      const res = await authController.login(payload);
      expect(res.success).toBe(true);
      expect(res.status).toBe(200);
      expect(res.message).toEqual('Successfully logged In');
    });
  });
});
