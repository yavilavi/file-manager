# Tenant Module - CLEAN Architecture Implementation

This module has been refactored to follow CLEAN Architecture principles, SOLID principles, and DRY (Don't Repeat Yourself) practices.

## Architecture Overview

The module is organized into the following layers:

### 1. Domain Layer (`domain/`)
Contains the core business logic and rules for tenant management, independent of external concerns.

- **Entities** (`entities/`): Core business objects with behavior
  - `TenantEntity`: Represents a tenant/company with business logic methods

- **Value Objects** (`value-objects/`): Immutable objects that represent concepts
  - `TenantIdentifier`: Encapsulates tenant ID validation and business rules
  - `CompanyInfo`: Represents company information with validation

- **Repository Interfaces** (`repositories/`): Contracts for data access
  - `ITenantRepository`: Interface for tenant data operations

- **Service Interfaces** (`services/`): Contracts for domain services
  - `ITenantValidationService`: Interface for tenant validation business rules

### 2. Application Layer (`application/`)
Contains application-specific business rules and orchestrates the domain.

- **Use Cases** (`use-cases/`): Application business rules
  - `CheckSubdomainAvailabilityUseCase`: Validates subdomain availability
  - `CreateTenantUseCase`: Handles tenant creation logic
  - `GetTenantByIdUseCase`: Retrieves tenant information

- **DTOs** (`dtos/`): Data Transfer Objects for input/output
  - `CheckSubdomainDto`: Input for subdomain availability check
  - `CreateTenantDto`: Input for tenant creation
  - `TenantResponseDto`: Output for tenant operations

### 3. Infrastructure Layer (`infrastructure/`)
Contains implementations of interfaces defined in the domain layer.

- **Repositories** (`repositories/`): Data access implementations
  - `TenantRepository`: Prisma-based tenant repository implementation

- **Services** (`services/`): Domain service implementations
  - `TenantValidationService`: Business rule validation service

### 4. Presentation Layer (`presentation/`)
Contains the HTTP controllers and API endpoints.

- `TenantController`: HTTP endpoints for tenant operations

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each use case has a single responsibility
- Value objects handle specific validation concerns
- Controllers only handle HTTP concerns
- Services focus on specific domain validation

### Open/Closed Principle (OCP)
- Interfaces allow for extension without modification
- New validation rules can be added without changing existing code
- Repository implementations are swappable

### Liskov Substitution Principle (LSP)
- All implementations can be substituted for their interfaces
- Repository and service implementations are interchangeable

### Interface Segregation Principle (ISP)
- Interfaces are focused and specific to their use cases
- Validation service interface only contains validation-related methods

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (interfaces)
- Use cases depend on repository interfaces, not concrete implementations
- Infrastructure implementations depend on domain interfaces

## DRY Principles Applied

- Common validation logic is centralized in value objects
- Tenant identifier validation is reused across the system
- Error handling patterns are standardized
- DTO construction patterns are consistent

## Key Features

### Multi-Tenancy Support
- Robust tenant identifier validation
- Subdomain availability checking with suggestions
- Reserved keyword protection
- Company information validation

### Business Rule Validation
- Comprehensive tenant identifier format validation
- Company NIT (Tax ID) validation
- Reserved keyword checking
- Suspicious pattern detection

### Extensibility
- Easy to add new validation rules
- Support for additional tenant features
- Pluggable validation services

## API Endpoints

### Check Subdomain Availability
```http
GET /tenant/check-subdomain?subdomain=mycompany
```

**Response:**
```json
{
  "available": true
}
```

Or with suggestions if unavailable:
```json
{
  "available": false,
  "reason": "This subdomain is already taken",
  "suggestions": ["mycompany1", "mycompany2", "mycompanyinc"]
}
```

### Create Tenant
```http
POST /tenant
Content-Type: application/json

{
  "tenantId": "mycompany",
  "name": "My Company Inc.",
  "nit": "123456789-0",
  "canSendEmail": false
}
```

### Get Tenant by ID
```http
GET /tenant/mycompany
```

## Usage Examples

### Checking Subdomain Availability
```typescript
const checkDto = new CheckSubdomainDto('mycompany');
const result = await checkSubdomainAvailabilityUseCase.execute(checkDto);

if (result.available) {
  console.log('Subdomain is available!');
} else {
  console.log(`Not available: ${result.reason}`);
  console.log('Suggestions:', result.suggestions);
}
```

### Creating a Tenant
```typescript
const createDto = new CreateTenantDto({
  tenantId: 'mycompany',
  name: 'My Company Inc.',
  nit: '123456789-0',
  canSendEmail: true,
});

const result = await createTenantUseCase.execute(createDto);
console.log('Tenant created:', result.tenant);
```

## Business Rules

### Tenant Identifier Rules
- Must be 3-15 characters long
- Must start with a letter
- Can contain only alphanumeric characters, hyphens, and underscores
- Cannot end with hyphen or underscore
- Cannot be a reserved keyword
- Cannot contain consecutive special characters

### Company Information Rules
- Company name must be 2-255 characters
- NIT must be 5-20 characters with valid format
- Cannot contain test/demo related terms
- Cannot contain suspicious patterns

### Reserved Keywords
The system protects against the use of reserved keywords such as:
- Technical terms: `api`, `www`, `admin`, `root`
- Common services: `mail`, `ftp`, `ssl`
- Application terms: `app`, `dashboard`, `portal`
- Environment terms: `dev`, `staging`, `prod`

## Benefits of This Architecture

1. **Domain-Driven Design**: Business rules are clearly expressed in the domain layer
2. **Testability**: Each layer can be tested in isolation
3. **Maintainability**: Clear separation of concerns makes code easier to maintain
4. **Flexibility**: Easy to swap implementations or add new features
5. **Scalability**: New tenant features can be added without affecting existing code
6. **Business Rule Centralization**: All tenant validation rules are in one place

## Future Enhancements

1. **Tenant Configuration**: Add tenant-specific configuration management
2. **Tenant Analytics**: Add usage tracking and analytics
3. **Tenant Quotas**: Implement storage and feature quotas
4. **Tenant Themes**: Add customization capabilities
5. **Tenant Backup**: Implement tenant data backup/restore
6. **Advanced Validation**: Add external NIT validation services

## Migration Notes

The refactored module maintains backward compatibility with the existing API. The `/tenant/check-subdomain` endpoint works exactly as before, but now includes enhanced validation and suggestion features.

Key improvements:
- Enhanced subdomain validation with business rules
- Better error messages and user guidance
- Structured response format with suggestions
- Extensible architecture for future enhancements 