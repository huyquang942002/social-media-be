import { BadGatewayException, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UploadService {
  private readonly s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file) {
    if (!file) {
      throw new BadGatewayException(
        'File not found , Please select file again',
      );
    }
    console.log('file', file);
    const uploadParams: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET,
      Key: `${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    };

    try {
      const result = await this.s3.upload(uploadParams).promise();
      return result?.Location;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}
