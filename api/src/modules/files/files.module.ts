/**
 * File Manager - files.module Module
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Presentation Layer
import { FilesController } from './presentation/files.controller';

// Application Layer - Use Cases
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { DownloadFileUseCase } from './application/use-cases/download-file.use-case';
import { GetFileByIdUseCase } from './application/use-cases/get-file-by-id.use-case';
import { GetAllFilesUseCase } from './application/use-cases/get-all-files.use-case';
import { DeleteFileUseCase } from './application/use-cases/delete-file.use-case';

// Infrastructure Layer
import { FileRepository } from './infrastructure/repositories/file.repository';
import { FileVersionRepository } from './infrastructure/repositories/file-version.repository';
import { MinioStorageAdapter } from './infrastructure/adapters/minio-storage.adapter';

// Domain Layer - Repository Interfaces
import { FILE_REPOSITORY } from './domain/repositories/file.repository.interface';
import { FILE_STORAGE_SERVICE } from './domain/services/file-storage.service.interface';

// External Dependencies
import { MinioModule } from '@libs/storage/minio/minio.module';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  imports: [
    MinioModule,
    JwtModule.register({}), // JWT configuration should be handled globally
  ],
  controllers: [FilesController],
  providers: [
    // Use Cases
    UploadFileUseCase,
    DownloadFileUseCase,
    GetFileByIdUseCase,
    GetAllFilesUseCase,
    DeleteFileUseCase,

    // Repository Implementations
    {
      provide: FILE_REPOSITORY,
      useClass: FileRepository,
    },
    FileVersionRepository,

    // Service Implementations
    {
      provide: FILE_STORAGE_SERVICE,
      useClass: MinioStorageAdapter,
    },

    // External Dependencies
    PrismaService,
  ],
  exports: [
    // Export use cases for potential use in other modules
    UploadFileUseCase,
    DownloadFileUseCase,
    GetFileByIdUseCase,
    GetAllFilesUseCase,
    DeleteFileUseCase,
  ],
})
export class FilesModule {}
