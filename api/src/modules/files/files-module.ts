import { Module } from '@nestjs/common';
import { FilesController } from './files-controller';
import { FilesService } from './files-service';
import { MinioModule } from '@libs/storage/minio/minio.module';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Module({
  imports: [MinioModule],
  controllers: [FilesController],
  providers: [FilesService, PrismaService],
})
export class FilesModule {}
