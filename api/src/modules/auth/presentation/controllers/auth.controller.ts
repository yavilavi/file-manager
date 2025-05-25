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
import { SignupDto } from '@modules/auth';
import { Request as Req } from 'express';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import { AuthApplicationService } from '@modules/auth/presentation/services/auth-application.service';
import { LocalAuthGuard } from '@modules/auth/presentation/guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authApplicationService: AuthApplicationService) {}

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Request() req: Req) {
    return this.authApplicationService.login(
      req.tenantId,
      req.user as unknown as { aud: string; sub: number; iss: string },
    );
  }

  @IsPublic()
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authApplicationService.signup(signupDto);
  }

  @Get('me')
  getMe(@Request() req: Req) {
    return req.user.data;
  }
}
