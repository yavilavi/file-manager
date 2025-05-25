/**
 * File Manager - Auth Module Exports (Clean Architecture)
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

// Domain Layer Exports (Enterprise Business Rules)
export * from './domain/entities/user-credentials.entity';
export * from './domain/repositories/user-credentials.repository.interface';
export * from './domain/services/authentication.domain-service';
export * from './domain/exceptions/auth.errors';

// Application Layer Exports (Application Business Rules)
export * from './application/use-cases/authentication.use-case';
export * from './application/use-cases/company-onboarding.use-case';
export * from './application/dtos/authentication.dto';
export * from './application/services/jwt.service';

// Infrastructure Layer Exports (Frameworks & Drivers)
export * from './infrastructure/repositories/user-credentials.repository';
export * from './infrastructure/passport/local.strategy';
export * from './infrastructure/passport/jwt.strategy';

// Presentation Layer Exports (Interface Adapters)
export * from './presentation/controllers/auth.controller';
export * from './presentation/guards/jwt-auth.guard';
export * from './presentation/guards/permission.guard';
export * from './presentation/decorators/require-permission.decorator';
export * from './presentation/dtos/signup.dto';

// Module Export
export * from './auth.module';
