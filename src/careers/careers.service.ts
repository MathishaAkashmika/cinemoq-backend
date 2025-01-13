import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { Career, CareerDocument } from './entities/career.entity';

@Injectable()
export class CareersService {
  constructor(
    @InjectModel(Career.name)
    private careerModel: Model<CareerDocument> & PaginateModel<CareerDocument>,
  ) {}

  async create(createCareerDto: CreateCareerDto): Promise<CareerDocument> {
    const createdCareer = new this.careerModel(createCareerDto);
    return createdCareer.save();
  }

  async getPaginatedList({
    filter,
    options,
  }: {
    filter: { [key: string]: any };
    options: { [key: string]: any };
  }): Promise<PaginateResult<Career>> {
    const queryFilter: any = {};

    // Handle search
    if (filter.search && filter.search.trim() !== '') {
      queryFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }
    delete filter.search;

    // Handle status filter
    if (filter.status) {
      queryFilter.status = filter.status;
    }

    // Handle date range filter
    const isValidDate = (date: any) => {
      if (!date) return false;
      const parsedDate = new Date(date);
      return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    };

    const startDate = isValidDate(filter.startDate)
      ? new Date(filter.startDate)
      : null;
    const endDate = isValidDate(filter.endDate)
      ? new Date(filter.endDate)
      : null;

    if (startDate || endDate) {
      queryFilter.createdAt = {};

      if (startDate) {
        queryFilter.createdAt.$gte = startDate;
      }

      if (endDate) {
        queryFilter.createdAt.$lte = endDate;
      }
    }

    // Handle sorting
    if (options.sortBy) {
      options.sort = this.createSortObject(options.sortBy);
    }
    delete options.sortBy;

    return this.careerModel.paginate(queryFilter, options);
  }

  private createSortObject(sortBy: string): Record<string, 1 | -1> {
    const [field, order] = sortBy.split(':');
    return { [field]: order === 'desc' ? -1 : 1 };
  }

  async findOne(query: any): Promise<CareerDocument | null> {
    return this.careerModel.findOne(query).exec();
  }

  async update(
    id: string,
    updateCareerDto: UpdateCareerDto,
  ): Promise<CareerDocument | null> {
    const career = await this.careerModel.findById(id).exec();
    if (!career) {
      throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
    }
    return this.careerModel
      .findByIdAndUpdate(id, updateCareerDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<CareerDocument | null> {
    const career = await this.careerModel.findById(id).exec();
    if (!career) {
      throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
    }
    return this.careerModel.findByIdAndDelete(id).exec();
  }
}
