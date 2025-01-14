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
import { S3Service } from 'src/s3/s3.service';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';
import { createHash } from 'crypto';
import {
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from '@paypal/paypal-server-sdk';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';

function md5(v: string): string {
  return createHash('md5').update(v).digest('hex').toUpperCase();
}

@ApiTags('bookings')
@Controller({ path: 'bookings', version: '1' })
export class BookingsController {
  private paypalClient: Client;
  private ordersController: OrdersController;
  private paymentsController: PaymentsController;

  constructor(
    private readonly bookingsService: BookingsService,
    private readonly clsService: ClsService,
    private readonly showtimeService: ShowtimeService,
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {
    this.paypalClient = new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.PAYPAL_CLIENT_ID,
        oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
      },
      timeout: 0,
      environment: Environment.Sandbox,
      logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
      },
    });

    this.ordersController = new OrdersController(this.paypalClient);
    this.paymentsController = new PaymentsController(this.paypalClient);
  }

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

      if (lockedRow == null) {
        throw new HttpException(`Lock the seats first`, HttpStatus.BAD_REQUEST);
      }

      if (lockedRow != null && lockedRow.userId.toString() !== user.id) {
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

    try {
      const { body } = await this.ordersController.ordersCreate({
        body: {
          intent: CheckoutPaymentIntent.Capture,
          purchaseUnits: [
            {
              amount: {
                currencyCode: 'USD',
                value: amount.toString(),
              },
            },
          ],
        },
        prefer: 'return=minimal',
      });

      return {
        booking,
        order: JSON.parse(body as string),
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
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
  @ApiBody({ type: ConfirmBookingDto })
  @ApiOperation({ summary: 'Confirm booking payment' })
  async confirm(@Body() data: ConfirmBookingDto, @Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) return;

    const { body, statusCode } = await this.ordersController.ordersCapture({
      id: data.orderId,
      prefer: 'return=minimal',
    });

    console.log(QRCode);
    const qrCode = await QRCode.toDataURL(md5(booking.id + ',' + 'secret_key'));
    const ticketDoc = new jsPDF();

    ticketDoc.setFontSize(40);
    ticketDoc.text(' CINEMOQ - Thank you for purchasing!', 35, 25);
    ticketDoc.addImage(qrCode, 'JPEG', 15, 40, 180, 180);

    const buffer = ticketDoc.output('arraybuffer');
    const s3Object = await this.s3Service.generatePresignedUrl({
      fileName: booking.id + '.pdf',
      contentType: 'application.pdf',
      domain: 'tickets',
    });

    try {
      await fetch(s3Object.presignedUrl, {
        method: 'PUT',
        body: buffer,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    } catch (e) {
      throw e;
    }

    await this.bookingsService.setS3URL(booking.id, s3Object.s3url);

    if (statusCode == 200 || statusCode == 201) {
      await this.bookingsService.complete(id);
      return {
        booking: await this.bookingsService.findById(id),
        order: JSON.parse(body as string),
      };
    } else {
      for (const seat of booking.seats) {
        await this.showtimeService.unbookSeat(
          booking.showtimeId.toString(),
          seat.row,
          seat.col,
        );
      }

      throw new HttpException(
        'Error capturing payment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
