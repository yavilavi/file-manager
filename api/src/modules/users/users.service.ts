/**
 * File Manager - users.service Service
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import * as argon2 from 'argon2';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findByEmail(email: string, tenantId?: string, selectPassword = false) {
    return this.prisma.client.user.findFirst({
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
    return this.prisma.client.user.findUnique({
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
            canSendEmail: true,
          },
        },
      },
    });
  }

  async getAllUsers(tenantId: string, selectPassword = false) {
    return this.prisma.client.user.findMany({
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
      throw new ConflictException('El correo electrÃ³nico ya estÃ¡ registrado');
    }
    const hashedPassword = await argon2.hash(dto.password);

    const newUser = await this.prisma.client.user.create({
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
    this.eventEmitter.emit('user.created', {
      user: {
        name: newUser.name,
        email: newUser.email,
        password: dto.password,
      },
      company: {
        name: newUser.company.name,
        tenantId: newUser.company.tenantId,
      },
    });
    return newUser;
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    tenantId: string,
    selectPassword = false,
  ) {
    const user = await this.prisma.client.user.findUnique({
      where: { id, tenantId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const data: {
      name: string;
      email: string;
      password?: string;
      departmentId: number;
    } = {
      name: dto.name,
      email: dto.email.toLowerCase(),
      departmentId: dto.departmentId,
    };

    if (dto.password) {
      data.password = await argon2.hash(dto.password);
    }

    return this.prisma.client.user.update({
      where: { id, tenantId, deletedAt: null },
      data,
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

  async toggleUserStatus(id: number, tenantId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id, tenantId, deletedAt: null },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado o no permitido');
    }

    return this.prisma.client.user.update({
      where: { id, tenantId, deletedAt: null },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }
}
