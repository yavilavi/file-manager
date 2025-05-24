# Migration Guide: Tenant Module Refactoring

This guide helps you migrate from the old tenant module implementation to the new CLEAN architecture.

## Overview of Changes

The tenant module has been completely refactored to follow CLEAN Architecture principles. Here's what changed:

### Old Structure
```
tenant/
├── tenant.controller.ts
├── tenant.middleware.ts
└── tenant.module.ts
```

### New Structure
```
tenant/
├── domain/
│   ├── entities/
│   │   └── tenant.entity.ts
│   ├── value-objects/
│   │   ├── tenant-identifier.vo.ts
│   │   └── company-info.vo.ts
│   ├── repositories/
│   │   └── tenant.repository.interface.ts
│   └── services/
│       └── tenant-validation.service.interface.ts
├── application/
│   ├── use-cases/
│   │   ├── check-subdomain-availability.use-case.ts
│   │   ├── create-tenant.use-case.ts
│   │   └── get-tenant-by-id.use-case.ts
│   └── dtos/
│       ├── check-subdomain.dto.ts
│       └── create-tenant.dto.ts
├── infrastructure/
│   ├── repositories/
│   │   └── tenant.repository.ts
│   └── services/
│       └── tenant-validation.service.ts
├── presentation/
│   └── tenant.controller.ts
├── tenant.module.refactored.ts
├── tenant.middleware.ts (unchanged)
├── README.md
└── MIGRATION.md
```

## Step-by-Step Migration

### 1. Backup Original Files

First, let's rename the original files as backups:

```bash
# Navigate to the tenant module directory
cd api/src/modules/tenant

# Rename original files
mv tenant.controller.ts tenant.controller.old.ts
mv tenant.module.ts tenant.module.old.ts
# Keep tenant.middleware.ts as it doesn't need changes
```

### 2. Update Module Configuration

Replace the old module with the new one:

**Before:**
```typescript
import { Module } from '@nestjs/common';
import { TenantController } from '@modules/tenant/tenant.controller';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  controllers: [TenantController],
})
export class TenantModule {}
```

**After:**
```typescript
// Rename tenant.module.refactored.ts to tenant.module.ts
mv tenant.module.refactored.ts tenant.module.ts
```

### 3. Update Import Statements

If other modules import from the tenant module, update them:

**Before:**
```typescript
import { TenantModule } from '@modules/tenant/tenant.module';
```

**After:**
```typescript
import { TenantModule } from '@modules/tenant/tenant.module';
// No change needed in import path, but internal structure changed
```

### 4. Update Direct Usage (If Any)

If you were directly injecting any tenant services in other modules, update them to use the new use cases:

**Before:**
```typescript
constructor(private readonly prisma: PrismaService) {}

async someMethod() {
  const company = await this.prisma.client.company.findFirst({
    where: { tenantId: 'example' }
  });
}
```

**After:**
```typescript
constructor(
  private readonly getTenantByIdUseCase: GetTenantByIdUseCase
) {}

async someMethod() {
  const tenant = await this.getTenantByIdUseCase.execute('example');
}
```

### 5. Update the TenantId Value Object Usage

The new architecture provides a reusable `TenantIdentifier` value object. Update the files module to use it:

**In files module:**
```typescript
// Replace the old TenantId value object import
import { TenantIdentifier } from '../tenant/domain/value-objects/tenant-identifier.vo';

// Use TenantIdentifier instead of the old TenantId
const tenantId = TenantIdentifier.create(uploadDto.tenantId);
```

## API Compatibility

The HTTP API endpoints remain the same to ensure backward compatibility:

- `GET /tenant/check-subdomain?subdomain=example` - Enhanced with suggestions
- `POST /tenant` - New endpoint for tenant creation
- `GET /tenant/:tenantId` - New endpoint for tenant retrieval

### Enhanced Response Format

The `check-subdomain` endpoint now provides enhanced responses:

**Old Response:**
```json
{ "available": false }
```

**New Response:**
```json
{
  "available": false,
  "reason": "This subdomain is already taken",
  "suggestions": ["example1", "example2", "exampleinc"]
}
```

## Breaking Changes

### 1. Direct Database Access

If you were directly accessing the company table through PrismaService in other modules for tenant-related operations, you should now use the tenant repository or use cases:

**Before:**
```typescript
const company = await this.prisma.client.company.findFirst({
  where: { tenantId: 'example' }
});
```

**After:**
```typescript
const tenant = await this.getTenantByIdUseCase.execute('example');
```

### 2. Tenant Validation

If you were doing manual tenant validation, you can now use the validation service:

**Before:**
```typescript
if (tenantId.length < 3 || tenantId.length > 15) {
  throw new Error('Invalid tenant ID');
}
```

**After:**
```typescript
try {
  const validatedTenantId = TenantIdentifier.create(tenantId);
} catch (error) {
  throw new BadRequestException(error.message);
}
```

## Module Dependencies

Update your imports in other modules that depend on tenant functionality:

```typescript
import { TenantModule } from '@modules/tenant/tenant.module';
import { 
  CheckSubdomainAvailabilityUseCase,
  GetTenantByIdUseCase 
} from '@modules/tenant/tenant.module';
```

## Testing the Migration

1. **API Testing**: Verify that existing API calls still work
2. **Unit Testing**: Run existing tests to ensure compatibility
3. **Integration Testing**: Test tenant-related functionality across modules

### Test Commands
```bash
# Test the check-subdomain endpoint
curl "http://localhost:3000/tenant/check-subdomain?subdomain=test"

# Test tenant creation (new endpoint)
curl -X POST "http://localhost:3000/tenant" \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"test","name":"Test Company","nit":"123456789"}'

# Test tenant retrieval (new endpoint)
curl "http://localhost:3000/tenant/test"
```

## Rollback Plan

If you need to rollback to the old implementation:

1. Restore the backup files:
   ```bash
   mv tenant.controller.old.ts tenant.controller.ts
   mv tenant.module.old.ts tenant.module.ts
   ```

2. Remove the new directory structure:
   ```bash
   rm -rf domain/ application/ infrastructure/ presentation/
   rm tenant.module.refactored.ts README.md MIGRATION.md
   ```

3. Restart the application

## Benefits After Migration

1. **Enhanced Validation**: Comprehensive tenant identifier and company validation
2. **Better User Experience**: Subdomain suggestions when unavailable
3. **Improved Maintainability**: Clear separation of concerns
4. **Better Testing**: Each layer can be tested independently
5. **Extensibility**: Easy to add new tenant-related features
6. **Domain Logic**: Business rules are clearly expressed

## Common Issues and Solutions

### Issue: Import path errors
**Solution**: Update import paths to match the new structure

### Issue: Dependency injection errors
**Solution**: Ensure all providers are properly registered in the module

### Issue: Type errors with DTOs
**Solution**: Use the new DTO constructors instead of plain objects

### Issue: Validation errors
**Solution**: Use the new value objects for validation instead of manual checks

## Support

If you encounter issues during migration:

1. Check the README.md for architecture documentation
2. Review the use case implementations for examples
3. Ensure all dependencies are properly injected
4. Verify that the module is properly configured

## Next Steps

After successful migration:

1. Consider updating other modules to use the new tenant use cases
2. Add comprehensive unit tests for the new architecture
3. Consider extracting common value objects (like TenantIdentifier) to a shared module
4. Implement additional tenant features using the new architecture patterns 