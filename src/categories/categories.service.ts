import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './entities/category.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument> &
      PaginateModel<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = new this.categoryModel({
      ...createCategoryDto,
    });

    return category.save();
  }

  findAll() {
    return this.categoryModel.find().exec(); // Fetch all categories
  }

  findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    return this.categoryModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryDocument | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryModel.findByIdAndDelete(id).exec();
    return { message: `Category with ID ${id} has been deleted successfully` };
  }
}
