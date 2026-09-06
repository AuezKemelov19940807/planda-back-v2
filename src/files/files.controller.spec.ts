import { Test, TestingModule } from '@nestjs/testing';

import { FilesController } from './files.controller.js';
import { S3Service } from '../s3/s3.service.js';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: S3Service,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
