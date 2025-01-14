import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  exports: [S3Service],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
