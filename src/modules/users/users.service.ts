import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string, tenantId?: string, selectPassword = false) {
    return await this.prisma.client.user.findFirst({
      where: {
        email,
        tenantId: tenantId,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: selectPassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
          },
        },
      },
    });
  }

  async findById(id: number, tenantId?: string, selectPassword = false) {
    return await this.prisma.client.user.findUnique({
      where: {
        id,
        tenantId: tenantId,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: selectPassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
          },
        },
      },
    });
  }

  async getAllUsers(tenantId: string, selectPassword = false) {
    return await this.prisma.client.user.findMany({
      relationLoadStrategy: 'join',
      orderBy: {
        name: 'asc',
      },
      where: {
        deletedAt: null,
        tenantId: tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: selectPassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
          },
        },
      },
    });
  }

  async createUser(
    dto: CreateUserDto,
    tenantId: string,
    selectPassword = false,
  ) {
    const existing = await this.prisma.client.user.findFirst({
      where: {
        email: dto.email,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
    const hashedPassword = await argon2.hash(dto.password);

    return await this.prisma.client.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        tenantId: tenantId,
        departmentId: dto.departmentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        password: selectPassword,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            nit: true,
            tenantId: true,
          },
        },
      },
    });
  }
}
