# Files Module - CLEAN Architecture Implementation

This module has been refactored to follow CLEAN Architecture principles, SOLID principles, and DRY (Don't Repeat Yourself) practices.

## Architecture Overview

The module is organized into the following layers:

### 1. Domain Layer (`domain/`)
Contains the core business logic and rules, independent of external concerns.

- **Entities** (`entities/`): Core business objects with behavior
  - `FileEntity`: Represents a file with business logic methods
  - `FileVersionEntity`: Represents file versions with versioning logic

- **Value Objects** (`value-objects/`): Immutable objects that represent concepts
  - `FileMetadata`: Encapsulates file metadata with validation
  - `TenantId`: Represents tenant identification with validation

- **Repository Interfaces** (`repositories/`): Contracts for data access
  - `IFileRepository`: Interface for file data operations
  - `IFileVersionRepository`: Interface for file version operations

- **Service Interfaces** (`services/`): Contracts for external services
  - `IFileStorageService`: Interface for file storage operations

### 2. Application Layer (`application/`)
Contains application-specific business rules and orchestrates the domain.

- **Use Cases** (`use-cases/`): Application business rules
  - `UploadFileUseCase`: Handles file upload logic
  - `DownloadFileUseCase`: Handles file download logic
  - `GetFileByIdUseCase`: Retrieves a specific file
  - `GetAllFilesUseCase`: Retrieves all files for a tenant
  - `DeleteFileUseCase`: Handles file deletion logic

- **DTOs** (`dtos/`): Data Transfer Objects for input/output
  - `UploadFileDto`: Input for file upload
  - `DownloadFileDto`: Input for file download
  - `FileResponseDto`: Output for file operations

### 3. Infrastructure Layer (`infrastructure/`)
Contains implementations of interfaces defined in the domain layer.

- **Repositories** (`repositories/`): Data access implementations
  - `FileRepository`: Prisma-based file repository implementation
  - `FileVersionRepository`: Prisma-based file version repository

- **Adapters** (`adapters/`): External service adapters
  - `MinioStorageAdapter`: Adapter for MinIO storage service

### 4. Presentation Layer (`presentation/`)
Contains the HTTP controllers and API endpoints.

- `FilesController`: HTTP endpoints for file operations

## SOLID Principles Applied

### Single Responsibility Principle (SRP)
- Each use case has a single responsibility
- Entities contain only business logic related to their domain
- Controllers only handle HTTP concerns

### Open/Closed Principle (OCP)
- Interfaces allow for extension without modification
- New storage providers can be added by implementing `IFileStorageService`
- New repositories can be added by implementing repository interfaces

### Liskov Substitution Principle (LSP)
- All implementations can be substituted for their interfaces
- Repository implementations are interchangeable

### Interface Segregation Principle (ISP)
- Interfaces are focused and specific to their use cases
- Storage service interface only contains storage-related methods

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions (interfaces)
- Use cases depend on repository interfaces, not concrete implementations
- Infrastructure implementations depend on domain interfaces

## DRY Principles Applied

- Common validation logic is centralized in value objects
- Entity mapping logic is reused across repositories
- DTO construction patterns are consistent
- Error handling patterns are standardized

## Benefits of This Architecture

1. **Testability**: Each layer can be tested in isolation
2. **Maintainability**: Clear separation of concerns makes code easier to maintain
3. **Flexibility**: Easy to swap implementations (e.g., different storage providers)
4. **Scalability**: New features can be added without affecting existing code
5. **Independence**: Domain logic is independent of frameworks and external services

## Usage Examples

### Uploading a File
```typescript
const uploadDto = new UploadFileDto({
  originalname: file.originalname,
  buffer: file.buffer,
  mimetype: file.mimetype,
  size: file.size,
  tenantId: 'tenant-123',
  userId: 1,
});

const result = await uploadFileUseCase.execute(uploadDto);
```

### Downloading a File
```typescript
const downloadDto = new DownloadFileDto({
  id: 1,
  tenantId: 'tenant-123',
  versionId: 'version-456', // optional
});

const result = await downloadFileUseCase.execute(downloadDto);
```

## Future Enhancements

1. **Editor Module**: Extract OnlyOffice editor functionality into a separate module
2. **File Versioning**: Enhance version management capabilities
3. **File Permissions**: Add fine-grained permission system
4. **Audit Trail**: Add comprehensive audit logging
5. **File Validation**: Add virus scanning and content validation
6. **Caching**: Implement caching for frequently accessed files

## Migration Notes

The old `FilesService` and `FilesController` have been replaced with this new architecture. The API endpoints remain the same to maintain backward compatibility, but the internal implementation has been completely refactored.

Key changes:
- Business logic moved from service to use cases
- Data access abstracted through repository interfaces
- External services abstracted through service interfaces
- Proper separation of concerns across layers 