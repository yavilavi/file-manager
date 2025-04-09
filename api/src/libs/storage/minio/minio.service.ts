import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioService {
  private s3: S3Client;
  private readonly bucket: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: this.configService.getOrThrow<string>('minio.endpoint'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('minio.accessKey'),
        secretAccessKey:
          this.configService.getOrThrow<string>('minio.secretKey'),
      },
      forcePathStyle: true, // Necesario para MinIO
    });

    this.bucket = this.configService.getOrThrow<string>('minio.bucket');
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return key;
  }
}
