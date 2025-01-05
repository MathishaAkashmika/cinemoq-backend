import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime, ShowtimeDocument } from './entities/showtime.entity';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectModel(Showtime.name)
    private showtimeModel: Model<ShowtimeDocument> &
      PaginateModel<ShowtimeDocument>,
  ) {}

  async create(
    createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeDocument> {
    const showtime = new this.showtimeModel({
      ...createShowtimeDto,
      availableSeats: createShowtimeDto.totalSeats,
      bookedSeats: [],
    });
    return showtime.save();
  }

  async findAll(query: any) {
    const { page = 1, limit = 10, movie, startDate, endDate, isActive } = query;

    const filter: any = {};

    if (movie) {
      filter.movie = movie;
    }

    if (startDate || endDate) {
      filter.showDate = {};
      if (startDate) filter.showDate.$gte = new Date(startDate);
      if (endDate) filter.showDate.$lte = new Date(endDate);
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    return this.showtimeModel.paginate(filter, {
      page,
      limit,
      sort: { showDate: 1, startTime: 1 },
      populate: 'movie',
    });
  }

  async findOne(id: string): Promise<ShowtimeDocument> {
    const showtime = await this.showtimeModel
      .findById(id)
      .populate('movie')
      .exec();

    if (!showtime) {
      throw new HttpException('Showtime not found', HttpStatus.NOT_FOUND);
    }

    return showtime;
  }

  async update(
    id: string,
    updateShowtimeDto: UpdateShowtimeDto,
  ): Promise<ShowtimeDocument> {
    const showtime = await this.findOne(id);

    // Don't allow updating if seats are already booked
    if (
      showtime.bookedSeats.length > 0 &&
      (updateShowtimeDto.totalSeats ||
        updateShowtimeDto.showDate ||
        updateShowtimeDto.startTime)
    ) {
      throw new HttpException(
        'Cannot update showtime with booked seats',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.showtimeModel
      .findByIdAndUpdate(id, updateShowtimeDto, { new: true })
      .populate('movie')
      .exec();
  }

  async remove(id: string): Promise<ShowtimeDocument> {
    const showtime = await this.findOne(id);

    if (showtime.bookedSeats.length > 0) {
      throw new HttpException(
        'Cannot delete showtime with booked seats',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.showtimeModel.findByIdAndDelete(id).exec();
  }
}
