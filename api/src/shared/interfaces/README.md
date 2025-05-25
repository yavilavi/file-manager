# Repository Interfaces - Clean Architecture Implementation

This directory contains the base abstractions for our repository layer, following **Clean Architecture** principles and **SOLID** design patterns.

## 🏗️ Architecture Overview

The interfaces are designed with the following SOLID principles:

### 1. Single Responsibility Principle (SRP)
- Each interface has a single, well-defined responsibility
- Entity interfaces focus only on data structure
- Repository interfaces focus only on data access patterns

### 2. Open/Closed Principle (OCP)
- Interfaces are open for extension through inheritance
- Base interfaces provide common functionality that can be extended
- New repositories can be added without modifying existing code

### 3. Liskov Substitution Principle (LSP)
- All implementations must be substitutable for their interface
- Derived interfaces maintain the contract of their base interfaces

### 4. Interface Segregation Principle (ISP)
- Interfaces are focused and cohesive
- Separate interfaces for different concerns (e.g., `IUserWithRelations` vs `IUser`)
- Clients depend only on the methods they actually use

### 5. Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions, not concrete implementations
- Repository tokens provided for dependency injection
- Business logic depends on interfaces, not concrete repositories

## 📁 File Structure

```
src/shared/interfaces/
├── base-repository.interface.ts      # Generic CRUD operations
├── base-entity.interface.ts          # Common entity patterns
├── user-repository.interface.ts      # User-specific operations
├── role-repository.interface.ts      # Role and permission management
├── permission-repository.interface.ts # Permission-specific operations
├── company-repository.interface.ts   # Company/organization operations
├── tenant-repository.interface.ts    # Multi-tenancy operations
├── index.ts                          # Centralized exports
└── README.md                         # This documentation
```

## 🔧 Base Interfaces

### `IRepository<T, K>`
Generic repository interface providing standard CRUD operations:

```typescript
interface IRepository<T, K = number> {
  findById(id: K): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  update(id: K, updates: Partial<T>): Promise<T | null>;
  delete(id: K): Promise<boolean>;
  exists(id: K): Promise<boolean>;
  count(filters?: Record<string, any>): Promise<number>;
}
```

### Entity Base Interfaces
- `IBaseEntity`: Common audit fields (id, createdAt, updatedAt)
- `ISoftDeletableEntity`: Adds soft delete capability (deletedAt)
- `ITenantEntity`: Adds tenant scoping (tenantId)
- `ITenantSoftDeletableEntity`: Combines tenant scoping and soft delete
- `IUserOwnedEntity`: Adds user ownership (userId)

## 🚀 Usage Examples

### Basic Usage
```typescript
import { 
  IUserRepository, 
  ICreateUserData, 
  REPOSITORY_TOKENS 
} from '@shared/interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async createUser(userData: ICreateUserData) {
    return await this.userRepository.createUser(userData);
  }
}
```

### Dependency Injection Setup
```typescript
// In your module
{
  provide: REPOSITORY_TOKENS.USER_REPOSITORY,
  useClass: PrismaUserRepository,
}
```

## 🎯 Domain-Specific Features

### User Repository (`IUserRepository`)
- Email-based lookups with tenant scoping
- Password inclusion control
- Relationship loading (department, company)
- Tenant-scoped operations

### Role Repository (`IRoleRepository`)
- Permission management (add, remove, set)
- User-role assignment operations
- Tenant-scoped role operations
- Admin role handling

### Permission Repository (`IPermissionRepository`)
- Resource:action pattern support (`users:create`)
- Pattern matching (`users:*`, `*:read`)
- Global permissions (not tenant-scoped)
- Bulk operations

### Company Repository (`ICompanyRepository`)
- NIT (tax ID) validation
- Tenant ID management
- Relationship aggregation
- Email capability management

### Tenant Repository (`ITenantRepository`)
- Multi-tenancy abstraction layer
- Tenant initialization workflows
- Statistics and aggregation
- Archive/restore operations

## 🔒 Security Considerations

1. **Tenant Isolation**: All tenant-scoped repositories enforce tenant boundaries
2. **Password Security**: User interfaces provide control over password inclusion
3. **Soft Deletes**: Maintains data integrity while providing logical deletion
4. **Permission Validation**: Permission format validation prevents injection

## 🧪 Testing Strategy

### Unit Testing
```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      // ... other methods
    } as jest.Mocked<IUserRepository>;

    userService = new UserService(mockUserRepository);
  });

  it('should create user', async () => {
    // Test implementation
  });
});
```

### Integration Testing
- Test against real database with test containers
- Verify tenant isolation
- Test relationship loading
- Validate constraint enforcement

## 🔄 Migration Path

When implementing concrete repositories:

1. **Create Implementation**: Implement the interface in infrastructure layer
2. **Register Provider**: Add to module providers with token
3. **Update Tests**: Replace mocks with test implementations
4. **Gradual Migration**: Replace existing direct database calls

## 📊 Benefits Achieved

### ✅ Clean Architecture Compliance
- Clear separation between domain and infrastructure
- Business logic independent of database technology
- Testable in isolation

### ✅ SOLID Principles Applied
- **SRP**: Each interface has single responsibility
- **OCP**: Extensible without modification
- **LSP**: Implementations are substitutable
- **ISP**: Focused, cohesive interfaces
- **DIP**: Depend on abstractions

### ✅ Developer Experience
- IntelliSense support
- Type safety
- Clear contracts
- Consistent patterns

### ✅ Maintainability
- Easy to mock for testing
- Clear upgrade paths
- Consistent error handling
- Documentation through types

## 🚀 Next Steps

1. **Implement Concrete Repositories**: Create Prisma-based implementations
2. **Add Validation**: Implement business rule validation
3. **Error Handling**: Standardize error responses
4. **Caching Layer**: Add caching interfaces
5. **Audit Logging**: Add audit trail interfaces

## 🤝 Contributing

When adding new repository interfaces:

1. Follow existing naming conventions
2. Extend appropriate base interfaces
3. Add proper JSDoc documentation
4. Include type-safe filters
5. Consider tenant isolation requirements
6. Add to centralized exports
7. Update this README

---

*This implementation represents Phase 1 of the architectural refactoring plan, focusing on creating solid foundations for Clean Architecture adoption.* 