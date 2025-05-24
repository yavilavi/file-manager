import { Module } from '@nestjs/common';
import { FilesController } from './files-controller.old';
import { FilesService } from './files-service.old';
import { MinioModule } from '@libs/storage/minio/minio.module';
import { PrismaService } from '@libs/database/prisma/prisma.service';

@Module({
  imports: [MinioModule],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
