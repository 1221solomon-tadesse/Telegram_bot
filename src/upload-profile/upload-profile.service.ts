import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { lookup as mimeLookup } from 'mime-types';

@Injectable()
export class UploadProfileService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  constructor(private readonly configService: ConfigService,) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.getOrThrow('AWS_S3_BUCKET_NAME');
  }

  async upload(fileKey: string, file: Buffer, mimetype: string): Promise<string> {
    const finalMimeType = mimetype || mimeLookup(fileKey) || 'application/octet-stream';

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
        Body: file,
        ContentType: finalMimeType,
      }),
    );

    return fileKey;
  }

  async getProfile(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour
  }
}
