import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.client = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('minio.endpoint'),
      accessKey: this.configService.getOrThrow<string>('minio.accessKey'),
      secretKey: this.configService.getOrThrow<string>('minio.secretKey'),
      port: this.configService.getOrThrow<number>('minio.port'),
      useSSL: configService.getOrThrow('minio.useSSL'),
    });

    this.bucket = this.configService.getOrThrow<string>('minio.bucket');
  }

  async initBucket() {
    const exists = await this.client.bucketExists(
      this.configService.getOrThrow('minio.bucket'),
    );
    if (!exists) {
      await this.client.makeBucket(
        this.configService.getOrThrow('minio.bucket'),
      );
      Logger.log('Bucket created successfully');
    } else {
      Logger.log('Bucket already exists, skipping creation');
    }
  }

  async uploadFile(file: Express.Multer.File, fileName: string): Promise<void> {
    await this.client.putObject(this.bucket, fileName, file.buffer, file.size, {
      'Content-type': file.mimetype,
    });
  }

  async downloadFile(filePath: string) {
    try {
      return await this.client.getObject(this.bucket, filePath);
    } catch (error: unknown) {
      throw new Error(
        `Error downloading file ${filePath}: ${(error as Error).message}`,
      );
    }
  }
}
