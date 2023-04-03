import { Test, TestingModule } from '@nestjs/testing';
import { HttpServer, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: HttpServer;
  let userId;
  const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = await app.getHttpServer();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Register User', () => {
    it('/register (POST)', async () => {
      const payload = {
        firstName: 'Vitthal',
        lastName: 'Anjana',
        email: 'vitthal22@deqode.com',
        password: '123456',
      };

      const res = await request(server).post('/auth/register').send(payload);

      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.message).toEqual('Successfully registered user');
      userId = res?.body?.data?.id;
    });

    it('Error /register (POST)', async () => {
      const payload = {
        firstName: 'Vitthal',
        lastName: 'Anjana',
      };

      const res = await request(server).post('/auth/register').send(payload);

      expect(res?.body?.statusCode).toEqual(400);
    });

    it('Error /register (POST)', async () => {
      const payload = {
        firstName: 'Vitthal',
        lastName: 'Anjana',
        email: 'vitthal@deqode.com',
        password: '123456',
      };

      const res = await request(server).post('/auth/register').send(payload);
      expect(res?.body?.success).toEqual(false);
      expect(res?.body?.status).toEqual(500);
      expect(res?.body?.message).toEqual(
        'duplicate key value violates unique constraint "UQ_e12875dfb3b1d92d7d7c5377e22"',
      );
    });
  });

  let token;
  let groupId;

  describe('Login User', () => {
    it('/login (POST)', async () => {
      const payload = {
        email: 'vitthal@deqode.com',
        password: '123456',
      };

      const res = await request(server).post('/auth/login').send(payload);

      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
      expect(res?.body?.message).toEqual('Successfully logged In');
      token = res?.body?.data?.access_token;
    });

    it('Error /login (POST)', async () => {
      const payload = {
        email: 'vitthal@deqode.com',
        password: '1234567',
      };

      const res = await request(server).post('/auth/login').send(payload);

      expect(res?.body?.success).toEqual(false);
      expect(res?.body?.status).toEqual(401);
      expect(res?.body?.message).toEqual('Wrong Credentials provided');
    });
  });

  describe('Get All Groups', () => {
    it('/group (POST)', async () => {
      const payload = {
        name: 'TeamOne',
        groupIcon: 'NANAN',
      };

      const res = await request(server)
        .post('/group')
        .set('Content-type', 'application/json')
        .set('jwt-token', token)
        .send(payload);

      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
      expect(res?.body?.message).toEqual('Successfully Created group');
      groupId = res?.body?.data?.id;
    });

    it('/group (GET)', async () => {
      const res = await request(server)
        .get('/group')
        .set('Content-type', 'application/json')
        .set('jwt-token', token);
      expect(res.status).toBe(200);
    });

    it('Error /group (GET)', async () => {
      const res = await request(server).get('/group');
      expect(res.status).toBe(401);
    });

    it('Error Invalid JWT /group (GET)', async () => {
      const res = await request(server)
        .get('/group')
        .set('Content-type', 'application/json')
        .set('jwt-token', invalidToken);
      expect(res.status).toBe(401);
    });

    it('Error Invalid JWT /group (GET)', async () => {
      const res = await request(server)
        .get('/group')
        .set('Content-type', 'application/json')
        .set('jwt-token', '');
      expect(res.status).toBe(401);
    });
  });

  describe('Add Multiple Users', () => {
    it('/group/add-multiple-user (POST)', async () => {
      const payload = {
        groupId: groupId,
        userIds: [userId],
      };

      const res = await request(server)
        .post('/group/add-multiple-user')
        .set('Content-type', 'application/json')
        .set('jwt-token', token)
        .send(payload);

      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
      expect(res?.body?.message).toEqual(
        `Successfully added all users to group with ${payload.groupId}`,
      );
    });
  });

  describe('My groups', () => {
    it('/group/my-groups (GET)', async () => {
      const res = await request(server)
        .get('/group/my-groups')
        .set('Content-type', 'application/json')
        .set('jwt-token', token);
      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
    });
  });

  describe('Send Message', () => {
    it('/message (POST)', async () => {
      const payload = {
        groupId: groupId,
        message: 'Message for testing',
      };
      const res = await request(server)
        .post(`/message`)
        .set('Content-type', 'application/json')
        .set('jwt-token', token)
        .send(payload);

      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
      expect(res?.body?.message).toEqual('Successfully Created message');
    });
  });

  describe('Get Messages', () => {
    it('/message/group-messages (GET)', async () => {
      const res = await request(server)
        .get(`/message/group-messages?groupId=${groupId}`)
        .set('Content-type', 'application/json')
        .set('jwt-token', token);
      expect(res?.body?.success).toEqual(true);
      expect(res?.body?.status).toEqual(200);
      expect(res?.body?.message).toEqual(
        'Successfully returned all groups messages',
      );
    });

    it('/message (GET)', async () => {
      return await request(server)
        .get('/message')
        .set('Content-type', 'application/json')
        .set('jwt-token', token)
        .expect(200);
    });

    it('/message return error (GET)', async () => {
      const res = await request(server).get('/message');
      expect(res.status).toBe(401);
    });
  });

  describe('Get All group Users', () => {
    it('should return list of group users (GET)', async () => {
      return await request(server)
        .get(`/user/group-users?groupId=${groupId}`)
        .set('Content-type', 'application/json')
        .set('jwt-token', token)
        .expect(200);
    });

    it('should return no group found error (GET)', async () => {
      const wrongGroupID = '23b3315a-6c7c-442c-9f84-a7fb60150b85';
      const res = await request(server)
        .get(`/user/group-users?groupId=${wrongGroupID}`)
        .set('Content-type', 'application/json')
        .set('jwt-token', token);

      expect(res?.body?.success).toBe(false);
      expect(res?.body?.status).toBe(204);
    });

    it('should return internal server error (GET)', async () => {
      const wrongGroupID = 'groupid';
      const res = await request(server)
        .get(`/user/group-users?groupId=${wrongGroupID}`)
        .set('Content-type', 'application/json')
        .set('jwt-token', token);

      expect(res?.body?.success).toBe(false);
      expect(res?.body?.status).toBe(500);
    });
  });
});
