import { Test, TestingModule } from '@nestjs/testing';
import { FileStorageController } from './file-storage.controller';
import { FileStorageService } from './file-storage.service';

describe('FileStorageController', () => {
  let controller: FileStorageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileStorageController],
      providers: [FileStorageService],
    }).compile();

    controller = module.get<FileStorageController>(FileStorageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
