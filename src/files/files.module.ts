import { Module } from '@nestjs/common';
import { FilesController } from './files.controller.js';
import { FilesService } from './files.service.js';
import { S3Module } from '../s3/s3.module.js';

@Module({
  imports: [S3Module],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
