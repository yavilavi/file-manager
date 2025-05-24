# Migration Guide: Files Module Refactoring

This guide helps you migrate from the old files module implementation to the new CLEAN architecture.

## Overview of Changes

The files module has been completely refactored to follow CLEAN Architecture principles. Here's what changed:

### Old Structure
```
files/
├── files-controller.ts
├── files-service.ts
└── files-module.ts
```

### New Structure
```
files/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   └── services/
├── application/
│   ├── use-cases/
│   └── dtos/
├── infrastructure/
│   ├── repositories/
│   └── adapters/
├── presentation/
│   └── files.controller.ts
├── files.module.ts
└── README.md
```

## Step-by-Step Migration

### 1. Update Module Imports

**Before:**
```typescript
import { FilesModule } from './modules/files/files-module';
```

**After:**
```typescript
import { FilesModule } from './modules/files/files.module';
```

### 2. Update Controller References

The controller path has changed:

**Before:**
```typescript
import { FilesController } from './modules/files/files-controller';
```

**After:**
```typescript
import { FilesController } from './modules/files/presentation/files.controller';
```

### 3. Replace Direct Service Usage

If you were injecting `FilesService` directly in other modules, replace it with specific use cases:

**Before:**
```typescript
constructor(private readonly filesService: FilesService) {}

async someMethod() {
  return this.filesService.uploadFile(file, tenantId, userId);
}
```

**After:**
```typescript
constructor(private readonly uploadFileUseCase: UploadFileUseCase) {}

async someMethod() {
  const uploadDto = new UploadFileDto({
    originalname: file.originalname,
    buffer: file.buffer,
    mimetype: file.mimetype,
    size: file.size,
    tenantId,
    userId,
  });
  return this.uploadFileUseCase.execute(uploadDto);
}
```

### 4. Update Test Files

**Before:**
```typescript
import { FilesService } from '../files-service';

describe('FilesService', () => {
  let service: FilesService;
  // ...
});
```

**After:**
```typescript
import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case';

describe('UploadFileUseCase', () => {
  let useCase: UploadFileUseCase;
  // ...
});
```

## API Compatibility

The HTTP API endpoints remain the same to ensure backward compatibility:

- `POST /files/upload` - Upload a file
- `GET /files` - Get all files
- `GET /files/:id` - Get file by ID
- `GET /files/:id/download` - Download file
- `DELETE /files/:id` - Delete file

## Breaking Changes

### 1. Direct Service Injection

If you were injecting `FilesService` in other modules, you'll need to:

1. Import the specific use cases you need
2. Update your module's providers array
3. Update the constructor injection

### 2. Method Signatures

Some internal method signatures have changed. If you were calling service methods directly:

**Before:**
```typescript
filesService.uploadFile(file, tenantId, userId)
```

**After:**
```typescript
uploadFileUseCase.execute(new UploadFileDto({
  originalname: file.originalname,
  buffer: file.buffer,
  mimetype: file.mimetype,
  size: file.size,
  tenantId,
  userId,
}))
```

### 3. Error Handling

Error handling is now more consistent across use cases. All use cases throw standard NestJS exceptions.

## Benefits After Migration

1. **Better Testability**: Each use case can be tested in isolation
2. **Improved Maintainability**: Clear separation of concerns
3. **Enhanced Flexibility**: Easy to swap implementations
4. **Better Type Safety**: Stronger typing with DTOs and entities
5. **Domain-Driven Design**: Business logic is properly encapsulated

## Rollback Plan

If you need to rollback:

1. Keep the old files (`files-controller.ts`, `files-service.ts`) as backup
2. Update the module to use the old controller and service
3. Revert any imports in other modules

## Testing the Migration

1. Run existing tests to ensure API compatibility
2. Test file upload functionality
3. Test file download functionality
4. Test file deletion functionality
5. Verify error handling works correctly

## Common Issues and Solutions

### Issue: Cannot find module errors
**Solution**: Update import paths to match the new structure

### Issue: Dependency injection errors
**Solution**: Ensure all providers are properly registered in the module

### Issue: Type errors with DTOs
**Solution**: Use the new DTO constructors instead of plain objects

## Support

If you encounter issues during migration:

1. Check the README.md for architecture documentation
2. Review the use case implementations for examples
3. Ensure all dependencies are properly injected
4. Verify that the module is properly configured

## Next Steps

After successful migration:

1. Consider extracting OnlyOffice editor functionality to a separate module
2. Add comprehensive unit tests for use cases
3. Implement integration tests for the new architecture
4. Consider adding file validation and virus scanning capabilities 