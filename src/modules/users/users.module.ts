import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';
import { UsersController } from '@modules/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
