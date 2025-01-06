import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking, BookingDocument } from './entities/booking.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument> &
      PaginateModel<BookingDocument>,
  ) {}

  async create(
    userId: string,
    totalAmount: number,
    createBookingDto: CreateBookingDto,
  ): Promise<BookingDocument> {
    const booking = new this.bookingModel({
      ...createBookingDto,
      userId: new Types.ObjectId(userId),
      totalAmount,
      completed: false,
    });

    return booking.save();
  }

  async findAll(userId: string, query: any) {
    const { page = 1, limit = 10, showtimeId } = query;

    const filter: any = {
      userId: new Types.ObjectId(userId),
    };

    if (showtimeId) {
      filter.showtimeId = showtimeId;
    }

    return this.bookingModel.paginate(filter, {
      page,
      limit,
    });
  }

  async findOne(userId: string, id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findOne({ _id: id, userId: new Types.ObjectId(userId) })
      .exec();

    if (!booking) {
      throw new HttpException('Booking not found', HttpStatus.NOT_FOUND);
    }

    return booking;
  }

  async findById(id: string): Promise<BookingDocument> {
    return this.bookingModel.findById(id).exec();
  }

  async complete(id: string): Promise<void> {
    await this.bookingModel.findByIdAndUpdate(id, { completed: true }).exec();
  }
}
