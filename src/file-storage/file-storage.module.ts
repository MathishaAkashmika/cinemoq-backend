import { Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';

@Module({
  controllers: [FileStorageController],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
