import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';
import { CreateAnnouncementDto } from '../src/announcements/dto/create-announcement.dto';
import { UpdateAnnouncementDto } from '../src/announcements/dto/update-announcement.dto';
import { AuthService } from '../src/auth/auth.service';

describe('AnnouncementsController (e2e)', () => {
  let app: INestApplication;
  let dbConnection: Connection;
  let authService: AuthService;
  let adminToken: string;
  let userToken: string;

  const validAnnouncement: CreateAnnouncementDto = {
    name: 'Test Announcement',
    description: 'Test Description',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31')
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getDbHandle();
    authService = moduleFixture.get<AuthService>(AuthService);

    // Generate tokens for testing
    adminToken = await authService.generateToken({ email: 'admin@test.com', role: 'admin' });
    userToken = await authService.generateToken({ email: 'user@test.com', role: 'user' });
  });

  afterAll(async () => {
    await dbConnection.collection('announcements').deleteMany({});
    await app.close();
  });

  describe('POST /announcements', () => {
    it('should create announcement when admin is authenticated', () => {
      return request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validAnnouncement)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.name).toBe(validAnnouncement.name);
          expect(res.body.description).toBe(validAnnouncement.description);
        });
    });

    it('should fail when user is not admin', () => {
      return request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validAnnouncement)
        .expect(403);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          description: 'Test',
          startDate: 'invalid-date'
        })
        .expect(400);
    });
  });

  describe('GET /announcements', () => {
    it('should return all announcements', () => {
      return request(app.getHttpServer())
        .get('/announcements')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
        });
    });
  });

  describe('GET /announcements/:id', () => {
    let announcementId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validAnnouncement);
      announcementId = response.body._id;
    });

    it('should return announcement by id', () => {
      return request(app.getHttpServer())
        .get(`/announcements/${announcementId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(announcementId);
          expect(res.body.name).toBe(validAnnouncement.name);
        });
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .get('/announcements/5f7d3a2b9d3e3c001f7c2b1a')
        .expect(404);
    });
  });

  describe('PATCH /announcements/:id', () => {
    let announcementId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validAnnouncement);
      announcementId = response.body._id;
    });

    const updateData: UpdateAnnouncementDto = {
      name: 'Updated Announcement',
      description: 'Updated Description'
    };

    it('should update announcement when admin is authenticated', () => {
      return request(app.getHttpServer())
        .patch(`/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200)
        .expect((res) => {
          expect(res.body.name).toBe(updateData.name);
          expect(res.body.description).toBe(updateData.description);
        });
    });

    it('should fail when user is not admin', () => {
      return request(app.getHttpServer())
        .patch(`/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(403);
    });

    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .patch(`/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: '',
          startDate: 'invalid-date'
        })
        .expect(400);
    });
  });

  describe('DELETE /announcements/:id', () => {
    let announcementId: string;

    beforeAll(async () => {
      const response = await request(app.getHttpServer())
        .post('/announcements')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validAnnouncement);
      announcementId = response.body._id;
    });

    it('should delete announcement when admin is authenticated', () => {
      return request(app.getHttpServer())
        .delete(`/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
    });

    it('should fail when user is not admin', () => {
      return request(app.getHttpServer())
        .delete(`/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent id', () => {
      return request(app.getHttpServer())
        .delete('/announcements/5f7d3a2b9d3e3c001f7c2b1a')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});