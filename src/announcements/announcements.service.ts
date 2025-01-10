import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult } from 'mongoose';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement, AnnouncementDocument } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private announcementModel: Model<AnnouncementDocument> &
      PaginateModel<AnnouncementDocument>,
  ) {}

  async create(
    createAnnouncementDto: CreateAnnouncementDto,
  ): Promise<AnnouncementDocument> {
    const createdAnnouncement = new this.announcementModel(createAnnouncementDto);
    return createdAnnouncement.save();
  }

  async getPaginatedList({
    filter,
    options,
  }: {
    filter: { [key: string]: any };
    options: { [key: string]: any };
  }): Promise<PaginateResult<Announcement>> {
    const queryFilter: any = {};

    // Handle search
    if (filter.search && filter.search.trim() !== '') {
      queryFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
      ];
    }
    delete filter.search;

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
      queryFilter.$and = [];

      if (startDate) {
        queryFilter.$and.push({ endDate: { $gte: startDate } });
      }

      if (endDate) {
        queryFilter.$and.push({ startDate: { $lte: endDate } });
      }
    }

    // Handle sorting
    if (options.sortBy) {
      options.sort = this.createSortObject(options.sortBy);
    }
    delete options.sortBy;

    return this.announcementModel.paginate(queryFilter, options);
  }

  private createSortObject(sortBy: string): Record<string, 1 | -1> {
    const [field, order] = sortBy.split(':');
    return { [field]: order === 'desc' ? -1 : 1 };
  }

  async findOne(query: any): Promise<AnnouncementDocument | null> {
    const announcement = await this.announcementModel.findOne(query).exec();
    if (!announcement) {
      throw new HttpException('Announcement not found', HttpStatus.NOT_FOUND);
    }
    return announcement;
  }

  async update(
    id: string,
    updateAnnouncementDto: UpdateAnnouncementDto,
  ): Promise<AnnouncementDocument | null> {
    const announcement = await this.announcementModel.findById(id).exec();
    if (!announcement) {
      throw new HttpException('Announcement not found', HttpStatus.NOT_FOUND);
    }
    return this.announcementModel
      .findByIdAndUpdate(id, updateAnnouncementDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<AnnouncementDocument | null> {
    const announcement = await this.announcementModel.findById(id).exec();
    if (!announcement) {
      throw new HttpException('Announcement not found', HttpStatus.NOT_FOUND);
    }
    return this.announcementModel.findByIdAndDelete(id).exec();
  }
}