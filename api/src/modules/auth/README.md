# Authentication Module - Clean Architecture Implementation

This module implements authentication functionality following Clean Architecture, SOLID principles, and DRY patterns.

## Architecture Overview

The auth module is structured following Clean Architecture's four layers:

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

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- **UserCredentialsEntity**: Only handles user authentication data
- **AuthenticationDomainService**: Only handles authentication business logic
- **JwtApplicationService**: Only handles JWT token operations
- **UserCredentialsRepository**: Only handles user credentials data access

### Open/Closed Principle (OCP)
- Domain events allow extension without modification
- Repository interfaces allow different implementations
- Error hierarchy allows new error types without changing existing code

### Liskov Substitution Principle (LSP)
- All repository implementations can substitute their interfaces
- Error classes properly extend base error classes
- Value objects maintain contracts

### Interface Segregation Principle (ISP)
- `IUserCredentialsRepository` is specific to authentication needs
- `IPasswordHashingService` only exposes password operations
- DTOs are focused on specific operations

### Dependency Inversion Principle (DIP)
- Use cases depend on repository abstractions, not implementations
- Domain services depend on service abstractions
- Infrastructure implements domain interfaces

## DRY Principle Implementation

### Shared Components
- **Base Domain Entity**: Common domain entity functionality
- **Value Objects**: Reusable Email and Password validation
- **Error Classes**: Hierarchical error handling
- **Base Mappers**: Common mapping functionality

### Reusable Services
- **JwtApplicationService**: Centralized JWT operations
- **AuthenticationDomainService**: Reusable authentication logic
- **Password Hashing Service**: Abstracted password operations

## Key Components

### Domain Layer

#### Entities
- **UserCredentialsEntity**: Encapsulates user authentication data and business rules

#### Value Objects
- **Email**: Validates and normalizes email addresses
- **Password**: Validates password requirements

#### Domain Services
- **AuthenticationDomainService**: Contains authentication business logic that doesn't belong in entities

#### Repository Interfaces
- **IUserCredentialsRepository**: Defines contract for user credentials data access

### Application Layer

#### Use Cases
- **AuthenticationUseCase**: Orchestrates user authentication flow
- **UserRegistrationUseCase**: Handles user registration
- **CompanyOnboardingUseCase**: Manages company signup process

#### DTOs
- **ValidateUserCommand**: Command for user validation
- **LoginCommand**: Command for user login
- **LoginResult**: Result of login operation

#### Services
- **JwtApplicationService**: Handles JWT token generation and validation

### Infrastructure Layer

#### Repository Implementations
- **UserCredentialsRepository**: Prisma-based implementation of user credentials repository

### Presentation Layer

#### Controllers
- **AuthController**: HTTP endpoints for authentication

#### Guards
- **JwtAuthGuard**: JWT token validation
- **LocalAuthGuard**: Local authentication strategy
- **PermissionGuard**: Permission-based authorization

#### Decorators
- **RequirePermission**: Decorator for endpoint permission requirements

## Usage Examples

### User Authentication
```typescript
// In a controller or service
const result = await this.authenticationUseCase.validateUser({
  email: 'user@example.com',
  password: 'password123',
  tenantId: 'tenant-id'
});

if (result.isValid) {
  const token = await this.authenticationUseCase.login({
    tenantId: 'tenant-id',
    jwtPayload: result.jwtPayload!
  });
}
```

### Domain Entity Usage
```typescript
// Creating user credentials
const credentials = UserCredentialsEntity.create(
  1,
  'user@example.com',
  'hashedPassword',
  true,
  'tenant-id',
  null
);

// Validating authentication
const canAuth = await credentials.canAuthenticate(
  'plainPassword',
  passwordHashingService
);
```

### Value Object Usage
```typescript
// Email validation
const email = Email.create('user@example.com'); // Throws if invalid
console.log(email.domain); // 'example.com'

// Password validation
const password = Password.create('password123'); // Throws if invalid
```

### Permission Decorator Usage
```typescript
import { RequirePermission } from '@modules/auth';

@Controller('users')
export class UsersController {
  @Get()
  @RequiredPermission('user:read')
  async getUsers() {
    // This endpoint requires 'user:read' permission
  }

  @Post()
  @RequiredPermission('user:create')
  async createUser() {
    // This endpoint requires 'user:create' permission
  }
}
```

## Error Handling

The module uses a hierarchical error system:

```typescript
try {
  const email = Email.create('invalid-email');
} catch (error) {
  if (error instanceof EmailValidationError) {
    // Handle email validation error
  }
}

try {
  await authenticationUseCase.validateUser(command);
} catch (error) {
  if (error instanceof AuthenticationFailedError) {
    // Handle authentication failure
  }
}
```

## Testing Strategy

### Unit Tests
- Domain entities and value objects
- Domain services
- Use cases (with mocked dependencies)
- Application services

### Integration Tests
- Repository implementations
- Use case flows with real dependencies
- Controller endpoints

### Example Test Structure
```typescript
describe('AuthenticationUseCase', () => {
  let useCase: AuthenticationUseCase;
  let mockRepository: jest.Mocked<IUserCredentialsRepository>;
  let mockPasswordService: jest.Mocked<IPasswordHashingService>;

  beforeEach(() => {
    // Setup mocks and dependencies
  });

  it('should validate user credentials successfully', async () => {
    // Test implementation
  });
});
```

## Configuration

### Module Dependencies
- `@nestjs/jwt`: JWT token handling
- `@nestjs/passport`: Authentication strategies
- `argon2`: Password hashing
- `class-validator`: DTO validation

### Environment Variables
```env
JWT_SECRET=your-jwt-secret
JWT_AUDIENCE=your-app
JWT_ISSUER=your-app
```

## Migration Guide

When migrating from the old structure:

1. **Update imports**: Use new DTO and service imports
2. **Update error handling**: Use domain-specific errors
3. **Update tests**: Mock new interfaces and services
4. **Update validation**: Use value objects for validation

## Future Enhancements

- **Multi-factor Authentication**: Add MFA support
- **OAuth Integration**: Support external providers
- **Session Management**: Add session-based authentication
- **Audit Logging**: Track authentication events
- **Rate Limiting**: Prevent brute force attacks 
