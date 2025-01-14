import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime, ShowtimeDocument } from './entities/showtime.entity';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectModel(Showtime.name)
    private showtimeModel: Model<ShowtimeDocument> &
      PaginateModel<ShowtimeDocument>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(
    createShowtimeDto: CreateShowtimeDto,
  ): Promise<ShowtimeDocument> {
    const showtime = new this.showtimeModel({
      ...createShowtimeDto,
      bookedSeats: [],
      lockedSeats: [],
    });
    return showtime.save();
  }

  async findAll(query: any) {
    let { page = 1, limit = 10, movieId, startDate, endDate, active } = query;
    page = parseInt(page);
    limit = parseInt(limit);

    const filter: any = {};

    if (movieId) {
      filter.movieId = new Types.ObjectId(movieId);
    }

    if (startDate || endDate) {
      filter.showDate = {};
      if (startDate) filter.showDate.$gte = new Date(startDate);
      if (endDate) filter.showDate.$lte = new Date(endDate);
    }

    if (active !== undefined) {
      filter.active = active === 'true';
    }

    return this.showtimeModel.paginate(filter, {
      page,
      limit,
      sort: { showDate: 1, startTime: 1 },
    });
  }

  async findOne(id: string): Promise<ShowtimeDocument> {
    const showtime = await this.showtimeModel.findById(id).exec();

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
      (updateShowtimeDto.totalSeats || updateShowtimeDto.startTime)
    ) {
      throw new HttpException(
        'Cannot update showtime with booked seats',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.showtimeModel
      .findByIdAndUpdate(id, updateShowtimeDto, { new: true })
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

  async lockSeat(
    id: string,
    _userId: string,
    row: number,
    col: number,
    delay: number,
  ): Promise<boolean> {
    const userId = new Types.ObjectId(_userId);
    const showtime = await this.showtimeModel.findById(id);

    if (!showtime) return false;
    if (showtime.lockedSeats.some((s) => s.row === row && s.col === col))
      return false;
    if (showtime.bookedSeats.some((s) => s.row === row && s.col === col))
      return false;

    await showtime.updateOne({ $push: { lockedSeats: { userId, row, col } } });

    if (delay > 0) {
      const timeout = setTimeout(() => {
        this.showtimeModel.findByIdAndUpdate(id, {
          $pull: { lockedSeats: { userId, row, col } },
        });
      }, delay);

      this.schedulerRegistry.addTimeout(
        `${id}-${_userId}-${row}-${col}-lock`,
        timeout,
      );
    }

    return true;
  }

  async unlockSeat(
    id: string,
    _userId: string,
    row: number,
    col: number,
  ): Promise<boolean> {
    const userId = new Types.ObjectId(_userId);
    const showtime = await this.showtimeModel.findById(id);

    if (
      !showtime ||
      !showtime.lockedSeats.some(
        (s) =>
          s.userId.toString() === _userId && s.row === row && s.col === col,
      )
    )
      return false;

    await showtime.updateOne({ $pull: { lockedSeats: { userId, row, col } } });

    const name = `${id}-${_userId}-${row}-${col}-lock`;
    if (this.schedulerRegistry.doesExist('timeout', name)) {
      this.schedulerRegistry.deleteTimeout(name);
    }

    return true;
  }

  async bookSeat(id: string, row: number, col: number): Promise<void> {
    const showtime = await this.showtimeModel.findById(id);
    if (
      !showtime ||
      showtime.lockedSeats.some((s) => s.row === row && s.col === col)
    )
      return;

    await this.showtimeModel.findByIdAndUpdate(id, {
      $push: { bookedSeats: { row, col } },
    });
  }

  async unbookSeat(id: string, row: number, col: number): Promise<void> {
    const showtime = await this.showtimeModel.findById(id);
    if (
      !showtime ||
      !showtime.bookedSeats.some((s) => s.row === row && s.col === col)
    )
      return;

    await this.showtimeModel.findByIdAndUpdate(id, {
      $pull: { bookedSeats: { row, col } },
    });
  }
}
