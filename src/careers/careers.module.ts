import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';
import { Career, CareerSchema } from './entities/career.entity';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Career.name, schema: CareerSchema }]),
    UserModule,
    ClsModule,
    S3Module,
  ],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {}
