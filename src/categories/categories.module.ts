import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from "./entities/category.entity"
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    UserModule,
    ClsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
