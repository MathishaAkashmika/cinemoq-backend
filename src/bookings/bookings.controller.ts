import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShowtimeService } from 'src/showtimes/showtimes.service';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/users.types';
import { UsersService } from 'src/users/users.service';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import { createHash } from 'crypto';

function md5(v: string): string {
  return createHash('md5').update(v).digest('hex').toUpperCase();
}

@ApiTags('bookings')
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly clsService: ClsService,
    private readonly showtimeService: ShowtimeService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'The booking has been created' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const showtime = await this.showtimeService.findOne(
      createBookingDto.showtimeId,
    );
    if (!showtime) {
      throw new HttpException('Showtime not found', HttpStatus.BAD_REQUEST);
    }

    for (const seat of createBookingDto.seats) {
      const lockedRow = showtime.lockedSeats.find(
        (s) => s.col === seat.col && s.row === seat.row,
      );
      if (lockedRow == null || lockedRow.userId.toString() !== user.id) {
        throw new HttpException(
          `Seat in row ${seat.row} and column ${seat.col} already locked`,
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.showtimeService.unlockSeat(
        showtime.id as string,
        user.id,
        seat.row,
        seat.col,
      );
      await this.showtimeService.bookSeat(
        showtime.id as string,
        seat.row,
        seat.col,
      );
    }

    const amount = showtime.price * createBookingDto.seats.length;
    const booking = await this.bookingsService.create(
      user.id,
      amount,
      createBookingDto,
    );

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const orderId = booking.id;
    const hashedSecret = md5(merchantSecret);
    const amountFormated = amount
      .toLocaleString('en-us', { minimumFractionDigits: 2 })
      .replaceAll(',', '');
    const currency = 'LKR';
    const hash = md5(
      merchantId + orderId + amountFormated + currency + hashedSecret,
    );

    return {
      booking,
      hash,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  async findAll(@Query() query: any) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return this.bookingsService.findAll(user.id, query);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({ summary: 'Get booking by id' })
  async findOne(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return this.bookingsService.findOne(user.id, id);
  }

  @Post('confirm/:id')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: ConfirmBookingDto })
  @ApiOperation({ summary: 'Confirm booking payment' })
  async confirm(@Body() data: ConfirmBookingDto, @Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) return;

    const hashedSecret = md5(process.env.PAYHERE_MERCHANT_SECRET);
    const unhashedSig =
      data.merchant_id +
      data.order_id +
      data.payhere_amount +
      data.payhere_currency +
      data.status_code +
      hashedSecret.toUpperCase();

    const sig = md5(unhashedSig);

    if (sig === data.md5sig) {
      const code = +data.status_code;
      if (code === 2) {
        await this.bookingsService.complete(id);
      } else if (code < 0) {
        for (const seat of booking.seats) {
          await this.showtimeService.unbookSeat(
            booking.showtimeId.toString(),
            seat.row,
            seat.col,
          );
        }
      }
    }
  }
}
