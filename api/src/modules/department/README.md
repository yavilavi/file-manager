# Department Module - Clean Architecture Implementation

This module implements the Department domain following Clean Architecture, SOLID principles, and DRY principles.

## Architecture Overview

```
src/modules/department/
├── domain/                     # Business logic & rules
│   ├── entities/
│   │   └── department.entity.ts
│   ├── repositories/
│   │   └── department.repository.interface.ts
│   └── services/
│       └── department-domain.service.ts
├── application/                # Use cases & DTOs
│   ├── dtos/
│   │   ├── create-department.dto.ts
│   │   ├── update-department.dto.ts
│   │   └── department-response.dto.ts
│   ├── exceptions/
│   │   └── department.exceptions.ts
│   └── use-cases/
│       ├── create-department.use-case.ts
│       ├── get-all-departments.use-case.ts
│       ├── update-department.use-case.ts
│       └── delete-department.use-case.ts
├── infrastructure/             # External interfaces
│   ├── controllers/
│   │   └── department.controller.ts
│   └── repositories/
│       └── prisma-department.repository.ts
├── department.module.ts
└── README.md
```

## Layers Explanation

### 🏛️ Domain Layer
- **Entities**: Core business objects with business logic
- **Repository Interfaces**: Contracts for data access (Dependency Inversion)
- **Domain Services**: Complex business rules that span multiple entities

### 🎯 Application Layer  
- **Use Cases**: Single-purpose business operations (Single Responsibility)
- **DTOs**: Data transfer objects for API communication
- **Exceptions**: Custom business exceptions

### 🔌 Infrastructure Layer
- **Controllers**: HTTP request/response handling
- **Repository Implementations**: Data persistence using Prisma

## SOLID Principles Applied

### ✅ Single Responsibility Principle (SRP)
- Each use case handles ONE operation
- Entity handles only department business logic
- Repository handles only data persistence
- Controller handles only HTTP concerns

### ✅ Open/Closed Principle (OCP)
- New use cases can be added without modifying existing ones
- Repository interface allows different implementations
- Domain service can be extended with new business rules

### ✅ Liskov Substitution Principle (LSP)
- Any implementation of `DepartmentRepository` can replace `PrismaDepartmentRepository`
- All use cases follow the same contract pattern

### ✅ Interface Segregation Principle (ISP)
- Repository interface only contains methods needed by use cases
- Each DTO contains only necessary fields for its operation

### ✅ Dependency Inversion Principle (DIP)
- Use cases depend on repository interface, not implementation
- Controller depends on use cases, not domain entities directly
- All dependencies point inward toward the domain

## DRY Principles Applied

### 🔄 Reusable Components
- **DepartmentResponseDto**: Single response format for all endpoints
- **Domain Entity**: Centralized business logic and validation
- **Custom Exceptions**: Reusable error handling
- **Repository Interface**: Consistent data access pattern

### 🔄 Shared Validation
- Entity validation in domain layer
- DTO validation for HTTP requests
- Domain service for complex business rules

## API Endpoints

### GET /departments
- **Use Case**: `GetAllDepartmentsUseCase`
- **Returns**: Array of active departments
- **Business Rule**: Only returns non-deleted departments

### POST /departments
- **Use Case**: `CreateDepartmentUseCase`
- **Body**: `CreateDepartmentDto`
- **Business Rule**: Name must be unique within tenant
- **Returns**: Created department

### PATCH /departments/:id
- **Use Case**: `UpdateDepartmentUseCase`
- **Body**: `UpdateDepartmentDto`
- **Business Rule**: New name must be unique (excluding current)
- **Returns**: Updated department

### DELETE /departments/:id ⭐ NEW
- **Use Case**: `DeleteDepartmentUseCase`
- **Business Rules**:
  - Department must exist and not be deleted
  - Cannot delete last department in tenant
  - Soft delete (sets deletedAt timestamp)
- **Returns**: 204 No Content

## Business Rules

### Department Creation
1. Name must be between 2-255 characters
2. Name must be unique within tenant
3. Name is automatically trimmed

### Department Update
1. Same validation as creation
2. Must check uniqueness excluding current department
3. Updates timestamp automatically

### Department Deletion
1. Cannot delete if department doesn't exist
2. Cannot delete if already deleted
3. Cannot delete last department in tenant
4. TODO: Cannot delete if has active users (needs User module integration)

## Domain Entity Features

### Factory Methods
```typescript
// Create new department
const dept = Department.create(name, tenantId);

// Reconstitute from database
const dept = Department.reconstitute(id, name, tenantId, createdAt, updatedAt, deletedAt);
```

### Business Methods
```typescript
dept.updateName(newName);    // With validation
dept.markAsDeleted();        // Soft delete
dept.restore();              // Undelete
dept.equals(otherDept);      // Domain equality
```

### Validation
- Automatic name trimming and length validation
- State consistency (can't delete twice, etc.)
- Immutable ID and tenantId

## Error Handling

### Custom Exceptions
- `DepartmentNotFoundException`
- `DepartmentNameAlreadyExistsException`  
- `DepartmentCannotBeDeletedException`
- `InvalidDepartmentDataException`

### HTTP Status Codes
- `200 OK`: Successful GET/PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Validation errors
- `404 Not Found`: Department not found
- `409 Conflict`: Name already exists

## Testing Strategy

### Unit Tests Needed
```typescript
// Domain
department.entity.spec.ts
department-domain.service.spec.ts

// Application
create-department.use-case.spec.ts
get-all-departments.use-case.spec.ts  
update-department.use-case.spec.ts
delete-department.use-case.spec.ts

// Infrastructure
department.controller.spec.ts
prisma-department.repository.spec.ts
```

### Integration Tests
- Full CRUD operations through API
- Business rule validation
- Multi-tenant isolation

## Migration from Old Architecture

### What Changed
- ❌ Removed: `DepartmentService` (replaced by use cases)
- ❌ Removed: Direct Prisma in controller
- ✅ Added: Domain entity with business logic
- ✅ Added: Repository interface for testability
- ✅ Added: DELETE operation (was missing)
- ✅ Added: Domain services for complex rules
- ✅ Added: Proper exception handling

### Backward Compatibility
- All existing API endpoints work the same
- Response format unchanged
- Same validation rules (improved error messages)
- New DELETE endpoint added

## Future Enhancements

### Planned Features
1. **User Integration**: Check for active users before deletion
2. **Audit Trail**: Track who created/modified departments  
3. **Department Hierarchy**: Support for sub-departments
4. **Bulk Operations**: Create/update/delete multiple departments
5. **Department Templates**: Predefined department sets

### Performance Optimizations
1. **Caching**: Cache frequently accessed departments
2. **Pagination**: For tenants with many departments  
3. **Indexes**: Optimize database queries
4. **Bulk Loading**: Efficient department lists

## Dependencies

### Internal
- `@libs/database/prisma/prisma.service`
- `@modules/auth/guards/jwt-auth/jwt-auth.guard`

### External
- `@nestjs/common`
- `@prisma/client`
- `class-validator`
- `class-transformer`

## Contributing

When adding new features:
1. Start with domain entities and business rules
2. Create use cases for specific operations
3. Add repository methods if needed
4. Update DTOs and controllers last
5. Write tests for all layers
6. Update this documentation 