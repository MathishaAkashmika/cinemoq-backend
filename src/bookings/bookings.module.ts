import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from './entities/booking.entity';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';
import { ShowtimeModule } from 'src/showtimes/showtimes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    UserModule,
    ClsModule,
    ShowtimeModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
