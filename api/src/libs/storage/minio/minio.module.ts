import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MinioService } from './minio.service';

@Module({
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule implements OnModuleInit {
  constructor(private readonly minioService: MinioService) {}

  async onModuleInit(): Promise<void> {
    Logger.log('Initializing Minio bucket...');
    await this.minioService.initBucket();
  }
}
