/**
 * File Manager - Files.E2e Spec
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';
import 'jest';

describe('FilesController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let httpServer: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    department: {
      id: 1,
      name: 'Test Department',
    },
    company: {
      id: 1,
      name: 'Test Company',
      tenantId: 'test-tenant',
      nit: '123456789',
    },
  };

  const mockFile = {
    id: 1,
    name: 'test.pdf',
    extension: 'pdf',
    path: '/test/path',
    hash: 'test-hash',
    size: 1024,
    mimeType: 'application/pdf',
    documentType: 'document',
    userId: 1,
    tenantId: 'test-tenant',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      department: {
        id: 1,
        name: 'Test Department',
      },
    },
    company: {
      id: 1,
      name: 'Test Company',
      tenantId: 'test-tenant',
      nit: '123456789',
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    httpServer = app.getHttpServer();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/files (GET)', () => {
    it('should return all files for a tenant', async () => {
      const token = jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        tenantId: mockUser.company.tenantId,
      });

      const response = await request(httpServer)
        .get('/files')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/files/:id (GET)', () => {
    it('should return a file by id', async () => {
      const token = jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        tenantId: mockUser.company.tenantId,
      });

      const response = await request(httpServer)
        .get(`/files/${mockFile.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', mockFile.id);
      expect(response.body).toHaveProperty('name', mockFile.name);
    });

    it('should return 404 when file does not exist', async () => {
      const token = jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        tenantId: mockUser.company.tenantId,
      });

      await request(httpServer)
        .get('/files/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('/files/:id (DELETE)', () => {
    it('should delete a file', async () => {
      const token = jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        tenantId: mockUser.company.tenantId,
      });

      await request(httpServer)
        .delete(`/files/${mockFile.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('should return 404 when trying to delete non-existent file', async () => {
      const token = jwtService.sign({
        sub: mockUser.id,
        email: mockUser.email,
        tenantId: mockUser.company.tenantId,
      });

      await request(httpServer)
        .delete('/files/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
