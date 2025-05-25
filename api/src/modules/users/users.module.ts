/**
 * File Manager - users.module Module
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { UsersController } from '@modules/users/users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
