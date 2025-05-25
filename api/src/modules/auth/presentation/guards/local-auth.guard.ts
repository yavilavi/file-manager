/**
 * File Manager - Local Auth Guard (Presentation Layer)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local Authentication Guard
 * Following Single Responsibility Principle (SRP) - only handles local auth
 * Part of presentation layer (interface adapters)
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
