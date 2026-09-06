import { Module } from '@nestjs/common';
import { S3Service } from './s3.service.js';
import { S3Resolver } from './s3.resolver.js';
import { FilesController } from '../files/files.controller.js';

@Module({
  controllers: [FilesController],
  providers: [S3Service, S3Resolver],
  exports: [S3Service],
})
export class S3Module {}
