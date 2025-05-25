# Shared Layer - Clean Architecture Implementation

This directory contains the shared abstractions and utilities that form the foundation of our Clean Architecture implementation, following **SOLID principles** and **DRY patterns**.

## 🏗️ Architecture Overview

The shared layer provides:

1. **Repository Interfaces** - Contracts for data access
2. **Domain Exceptions** - Structured error handling
3. **Base Mappers** - Data transformation utilities
4. **Common Decorators** - Cross-cutting concerns
5. **Utility Functions** - Reusable helpers

## 📁 Directory Structure

```
src/shared/
├── interfaces/           # Repository and entity interfaces
│   ├── base-repository.interface.ts
│   ├── base-entity.interface.ts
│   ├── user-repository.interface.ts
│   ├── role-repository.interface.ts
│   ├── permission-repository.interface.ts
│   ├── company-repository.interface.ts
│   ├── tenant-repository.interface.ts
│   └── index.ts
├── exceptions/           # Domain error classes
│   ├── domain-error.ts
│   ├── user.errors.ts
│   ├── role.errors.ts
│   ├── permission.errors.ts
│   ├── company.errors.ts
│   ├── tenant.errors.ts
│   └── index.ts
├── mappers/             # Data transformation classes
│   ├── base-mapper.ts
│   ├── user.mapper.ts
│   ├── role.mapper.ts
│   ├── permission.mapper.ts
│   ├── company.mapper.ts
│   ├── tenant.mapper.ts
│   └── index.ts
├── decorators/          # Custom decorators
├── utils/              # Utility functions
└── README.md
```

## 🎯 SOLID Principles Applied

### 1. Single Responsibility Principle (SRP)
- Each interface has a single, well-defined responsibility
- Repository interfaces focus only on data access patterns
- Mappers handle only data transformation
- Exceptions represent specific error scenarios

### 2. Open/Closed Principle (OCP)
- Base classes are open for extension through inheritance
- New repositories can be added without modifying existing code
- Error hierarchies can be extended for new domains

### 3. Liskov Substitution Principle (LSP)
- All repository implementations can substitute their interfaces
- Error classes properly extend base error types
- Mappers follow consistent transformation contracts

### 4. Interface Segregation Principle (ISP)
- Separate interfaces for different entity concerns
- Base entities vs. soft-deletable vs. tenant-scoped
- Read vs. write operations separated where appropriate

### 5. Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (interfaces)
- Concrete implementations depend on abstractions
- Dependency injection tokens provided for all abstractions

## 📋 Repository Interfaces

### Base Repository Interface
```typescript
interface IRepository<T, K = number> {
  findById(id: K): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<void>;
  count(filters?: Record<string, any>): Promise<number>;
}
```

### Entity-Specific Repositories
- **IUserRepository** - User management with tenant scoping
- **IRoleRepository** - Role and permission management
- **IPermissionRepository** - System permissions
- **ICompanyRepository** - Company/tenant data
- **ITenantRepository** - Tenant operations

## 🚨 Domain Exceptions

### Error Hierarchy
```
DomainError (abstract)
├── EntityNotFoundError (abstract)
│   ├── UserNotFoundError
│   ├── RoleNotFoundError
│   ├── PermissionNotFoundError
│   ├── CompanyNotFoundError
│   └── TenantNotFoundError
├── ValidationError (abstract)
│   ├── InvalidEmailError
│   ├── InvalidPasswordError
│   ├── InvalidRoleNameError
│   └── InvalidPermissionFormatError
├── BusinessRuleViolationError (abstract)
│   ├── EmailAlreadyExistsError
│   ├── RoleHasAssignedUsersError
│   └── PermissionInUseError
└── PermissionError (abstract)
```

### Error Features
- **Structured Error Codes** - Programmatic error handling
- **Contextual Information** - Rich error details
- **Cause Chaining** - Track error origins
- **JSON Serialization** - API-friendly error responses

## 🔄 Data Mappers

### Base Mapper Classes
- **BaseMapper** - Standard CRUD transformations
- **BaseRelationalMapper** - Handles entity relationships

### Mapper Features
- **Type Safety** - Full TypeScript support
- **Batch Operations** - Efficient list transformations
- **Validation** - Required field checking
- **Error Handling** - Safe conversion with fallbacks
- **Audit Fields** - Consistent timestamp handling

### Available Mappers
- **UserMapper** - User entity transformations
- **RoleMapper** - Role and permission mappings
- **PermissionMapper** - Permission format validation
- **CompanyMapper** - Company data handling
- **TenantMapper** - Tenant concept mapping

## 🔧 Usage Examples

### Repository Usage
```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async findUser(id: number): Promise<IUser> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }
    return user;
  }
}
```

### Mapper Usage
```typescript
@Injectable()
export class UserController {
  constructor(
    private readonly userMapper: UserMapper,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserDto> {
    const userData = this.userMapper.fromCreateDto(dto);
    const user = await this.userService.create(userData);
    return this.userMapper.toDto(user);
  }
}
```

### Exception Handling
```typescript
try {
  await this.userService.createUser(userData);
} catch (error) {
  if (error instanceof EmailAlreadyExistsError) {
    throw new ConflictException(error.message);
  }
  if (isDomainError(error)) {
    throw new BadRequestException(error.message);
  }
  throw error;
}
```

## 🚀 Benefits

1. **Consistency** - Uniform patterns across all modules
2. **Type Safety** - Full TypeScript support with strict typing
3. **Testability** - Easy mocking and testing with interfaces
4. **Maintainability** - Clear separation of concerns
5. **Extensibility** - Easy to add new entities and operations
6. **Error Handling** - Structured and predictable error management
7. **Performance** - Efficient batch operations and transformations

## 📝 Next Steps

This foundation enables:
- **Domain Entity Implementation** - Rich business objects
- **Use Case Development** - Application business logic
- **Repository Implementations** - Data persistence layer
- **API Controllers** - HTTP interface layer
- **Validation Pipes** - Input validation
- **Error Filters** - Global error handling

The abstractions created here will be used throughout the application to maintain consistency and follow Clean Architecture principles. 