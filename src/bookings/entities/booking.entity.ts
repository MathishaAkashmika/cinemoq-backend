import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Showtime } from 'src/showtimes/entities/showtime.entity';
import { User } from 'src/users/entities/user.entity';

export type BookingDocument = Booking & Document;

@Schema({ _id: false })
class Seat {
  @Prop({ required: true, min: 0 })
  row: number;

  @Prop({ required: true, min: 0 })
  col: number;
}

const SeatSchema = SchemaFactory.createForClass(Seat);

@Schema({ timestamps: true })
export class Booking {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  })
  showtimeId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [SeatSchema], default: [] })
  seats: Seat[];

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({ required: true })
  completed: boolean;
}

const BookingSchema = SchemaFactory.createForClass(Booking);
BookingSchema.plugin(mongoosePaginate);

export { BookingSchema };
