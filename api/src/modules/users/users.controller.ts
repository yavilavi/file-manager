import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { Request as Req } from 'express';
import { UsersService } from '@modules/users/users.service';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

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
}
