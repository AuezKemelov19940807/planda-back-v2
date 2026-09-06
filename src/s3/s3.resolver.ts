import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { S3Service } from './s3.service.js';
import { CreateUploadUrlInput } from './dto/create-upload-url.input.js';
import { UploadUrlType } from './types/upload-url.type.js';

@Resolver()
export class S3Resolver {
  constructor(private readonly s3Service: S3Service) {}

  @Mutation(() => UploadUrlType)
  async createUploadUrl(@Args('input') input: CreateUploadUrlInput) {
    const key = `${input.folder}/${crypto.randomUUID()}-${input.fileName}`;

    const uploadUrl = await this.s3Service.getUploadUrl(key, input.contentType);

    return {
      uploadUrl,
      key,
    };
  }
}
