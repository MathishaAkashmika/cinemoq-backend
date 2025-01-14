import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(): Promise<ReviewDocument[]> {
    return this.reviewModel.find().exec();
  }

  async findOne(id: string): Promise<ReviewDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return review;
  }

  async update(
    id: string,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ message: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const review = await this.reviewModel.findById(id).exec();
    if (!review) {
      throw new HttpException('Review not found', HttpStatus.NOT_FOUND);
    }
    await this.reviewModel.findByIdAndDelete(id).exec();
    return { message: `Review with ID ${id} deleted successfully` };
  }
}
