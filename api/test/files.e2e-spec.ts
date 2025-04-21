import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/libs/database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import '@types/jest';

describe('FilesController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

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
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

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

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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

      await request(app.getHttpServer())
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

      await request(app.getHttpServer())
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

      await request(app.getHttpServer())
        .delete('/files/999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
}); 