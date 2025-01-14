import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { ShowtimeModule } from 'src/showtimes/showtimes.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    UserModule,
    ClsModule,
    ShowtimeModule,
    S3Module,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
