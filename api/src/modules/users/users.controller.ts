import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Put,
  ParseIntPipe,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllFiles(@Request() req: Req) {
    return this.usersService.getAllUsers(req.tenantId);
  }

  @Post()
  async create(@Body() dto: CreateUserDto, @Request() req: Req) {
    return this.usersService.createUser(dto, req.tenantId);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @Request() req: Req,
  ) {
    return this.usersService.updateUser(id, dto, req.tenantId);
  }

  @Patch(':id/toggle-status')
  async toggleUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Req,
  ) {
    if (id === req.user.data.id)
      throw new UnauthorizedException('No puedes cambiar tu propio estado');
    return this.usersService.toggleUserStatus(id, req.tenantId);
  }
}
