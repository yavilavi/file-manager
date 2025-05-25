# Auth Module - Proper Clean Architecture Implementation

## Overview
The auth module has been completely reorganized to strictly follow Clean Architecture's four-layer pattern with no sublayers outside the main architectural boundaries.

## ✅ Proper Clean Architecture Structure

```
auth/
├── domain/                           # Layer 1: Enterprise Business Rules
│   ├── entities/
│   │   └── user-credentials.entity.ts
│   ├── repositories/
│   │   └── user-credentials.repository.interface.ts
│   ├── services/
│   │   └── authentication.domain-service.ts
│   └── exceptions/
│       └── auth.errors.ts
├── application/                      # Layer 2: Application Business Rules
│   ├── use-cases/
│   │   ├── authentication.use-case.ts
│   │   ├── user-registration.use-case.ts
│   │   ├── company-creation.use-case.ts
│   │   └── company-onboarding.use-case.ts
│   ├── dtos/
│   │   └── authentication.dto.ts    # CQRS Commands/Queries
│   └── services/
│       └── jwt.service.ts
├── infrastructure/                   # Layer 3: Frameworks & Drivers
│   ├── repositories/
│   │   └── user-credentials.repository.ts
│   └── passport/
│       ├── local.strategy.ts
│       └── jwt.strategy.ts
├── presentation/                     # Layer 4: Interface Adapters
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth-application.service.ts
│   ├── guards/
│   │   ├── local-auth.guard.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── permission.guard.ts
│   ├── decorators/
│   │   └── require-permission.decorator.ts
│   └── dtos/
│       └── signup.dto.ts            # API Input DTOs
├── auth.module.ts                    # Module configuration
└── index.ts                         # Clean exports by layer
```

## Key Architectural Principles Applied

### 1. Strict Layer Separation
- **No sublayers outside the four main layers**
- Each component belongs to exactly one layer
- Clear responsibility boundaries

### 2. Dependency Rule
- Dependencies point inward only
- Domain layer has no external dependencies
- Infrastructure depends on domain interfaces

### 3. Layer Responsibilities

#### Domain Layer (Enterprise Business Rules)
- **Entities**: `UserCredentialsEntity` - Core business objects
- **Repository Interfaces**: Contracts for data access
- **Domain Services**: Business logic that doesn't fit in entities
- **Exceptions**: Domain-specific error handling

#### Application Layer (Application Business Rules)
- **Use Cases**: Application-specific business rules
- **DTOs**: CQRS commands and queries
- **Application Services**: Orchestration services (JWT handling)

#### Infrastructure Layer (Frameworks & Drivers)
- **Repository Implementations**: Data access adapters
- **Passport Strategies**: Authentication framework adapters
- **External Service Adapters**: Third-party integrations

#### Presentation Layer (Interface Adapters)
- **Controllers**: HTTP request/response handling
- **Guards**: Authentication/authorization middleware
- **Decorators**: Metadata decorators for permissions
- **Application Services**: Presentation layer orchestration
- **DTOs**: API input/output models

## Benefits of This Structure

### 1. Clear Boundaries
- No confusion about where components belong
- Easy to understand and navigate
- Consistent with Clean Architecture principles

### 2. Testability
- Each layer can be tested in isolation
- Clear mocking boundaries
- Domain logic is framework-independent

### 3. Maintainability
- Changes in one layer don't affect others
- Easy to replace implementations
- Clear separation of concerns

### 4. Extensibility
- New features follow established patterns
- Easy to add new authentication methods
- Framework changes don't affect business logic

## Migration from Previous Structure

### What Was Moved

#### From Root to Presentation Layer:
- `auth.controller.ts` → `presentation/controllers/auth.controller.ts`
- `auth.service.ts` → `presentation/services/auth-application.service.ts`
- `dtos/signup.dto.ts` → `presentation/dtos/signup.dto.ts`

#### From Scattered Locations to Proper Layers:
- `guards/` → `presentation/guards/`
- `passport/` → `infrastructure/passport/`
- All components now in their correct architectural layer

#### Removed:
- Empty directories and scattered sublayers
- Inconsistent folder structures
- Mixed concerns

### Import Updates
All imports have been updated to reflect the new structure:
```typescript
// Before
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth/local-auth.guard';

// After
import { AuthApplicationService } from './presentation/services/auth-application.service';
import { LocalAuthGuard } from './presentation/guards/local-auth.guard';
```

## Compliance with Clean Architecture

### ✅ What We Fixed
1. **No sublayers outside main layers** - All components now belong to one of the four layers
2. **Proper dependency direction** - All dependencies point inward
3. **Clear layer responsibilities** - Each layer has a single, well-defined purpose
4. **Consistent structure** - Follows Uncle Bob's Clean Architecture exactly

### ✅ SOLID Principles Maintained
- **SRP**: Each class has a single responsibility
- **OCP**: Open for extension, closed for modification
- **LSP**: Proper inheritance hierarchies
- **ISP**: Focused, specific interfaces
- **DIP**: Dependencies on abstractions, not concretions

### ✅ DRY Principles Applied
- Shared value objects and base classes
- Centralized error handling
- Reusable domain services

## Usage Examples

### Importing from Layers
```typescript
// Domain layer imports
import { UserCredentialsEntity } from '@modules/auth/domain/entities/user-credentials.entity';
import { IUserCredentialsRepository } from '@modules/auth/domain/repositories/user-credentials.repository.interface';

// Application layer imports
import { AuthenticationUseCase } from '@modules/auth/application/use-cases/authentication.use-case';
import { ValidateUserCommand } from '@modules/auth/application/dtos/authentication.dto';

// Infrastructure layer imports
import { UserCredentialsRepository } from '@modules/auth/infrastructure/repositories/user-credentials.repository';
import { LocalStrategy } from '@modules/auth/infrastructure/passport/local.strategy';

// Presentation layer imports
import { AuthController } from '@modules/auth/presentation/controllers/auth.controller';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
```

### Clean Exports
The `index.ts` file provides clean exports organized by layer:
```typescript
// Use the index for clean imports
import { 
  UserCredentialsEntity,           // Domain
  AuthenticationUseCase,           // Application
  UserCredentialsRepository,       // Infrastructure
  AuthController                   // Presentation
} from '@modules/auth';
```

## Conclusion

The auth module now strictly adheres to Clean Architecture principles with:
- **Four distinct layers** with no sublayers outside them
- **Clear dependency direction** (inward only)
- **Proper separation of concerns**
- **Framework-independent business logic**
- **Testable and maintainable structure**

This structure serves as a template for other modules and demonstrates proper Clean Architecture implementation in a NestJS application. 