import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { S3Service } from '../s3/s3.service.js';

@Controller('api/files')
export class FilesController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('{*path}')
  async getFile(@Param('path') path: string | string[], @Res() res: any) {
    const key = Array.isArray(path) ? path.join('/') : path;

    try {
      const object = await this.s3Service.getObject(key);

      if (!object.Body) {
        throw new NotFoundException('File not found');
      }

      res.setHeader(
        'Content-Type',
        object.ContentType ?? 'application/octet-stream',
      );

      if (object.ContentLength !== undefined) {
        res.setHeader('Content-Length', object.ContentLength.toString());
      }

      const stream = object.Body as NodeJS.ReadableStream;

      stream.pipe(res);
    } catch {
      throw new NotFoundException('File not found');
    }
  }
}
