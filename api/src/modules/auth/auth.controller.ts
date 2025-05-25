/**
 * File Manager - Authentication Controller
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth/local-auth.guard';
import { Request as Req } from 'express';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import { SignupDto } from '@modules/auth/dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: Req) {
    return this.authService.login(
      req.tenantId,
      req.user as unknown as JwtPayloadInterface,
    );
  }

  @IsPublic()
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Get('me')
  getMe(@Request() req: Req) {
    return req.user.data;
  }
}
