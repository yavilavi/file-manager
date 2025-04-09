import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private client: Minio.Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    // this.s3 = new S3Client({
    //   region: 'us-east-1',
    //   endpoint: this.configService.getOrThrow<string>('minio.endpoint'),
    //   credentials: {
    //     accessKeyId: this.configService.getOrThrow<string>('minio.accessKey'),
    //     secretAccessKey:
    //       this.configService.getOrThrow<string>('minio.secretKey'),
    //   },
    //   forcePathStyle: true, // Necesario para MinIO
    // });
    this.client = new Minio.Client({
      endPoint: this.configService.getOrThrow<string>('minio.endpoint'),
      accessKey: this.configService.getOrThrow<string>('minio.accessKey'),
      secretKey: this.configService.getOrThrow<string>('minio.secretKey'),
      port: 9000,
      useSSL: false,
    });

    this.bucket = this.configService.getOrThrow<string>('minio.bucket');
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
