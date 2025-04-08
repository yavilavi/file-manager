import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string, tenantId?: string) {
    return await this.prisma.client.user.findFirst({
      where: {
        email,
        tenantId: tenantId,
        deletedAt: null,
        isActive: true,
      },
    });
  }

  async findById(id: number, tenantId?: string) {
    return await this.prisma.client.user.findUnique({
      where: {
        id,
        tenantId: tenantId,
        deletedAt: null,
        isActive: true,
      },
    });
  }
}
