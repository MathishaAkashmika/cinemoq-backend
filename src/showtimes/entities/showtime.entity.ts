import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Movie } from 'src/movies/entities/movie.entity';

export type ShowtimeDocument = Showtime & Document;

@Schema({ _id: false })
class Seat {
  @Prop({ required: true, min: 0 })
  row: number;

  @Prop({ required: true, min: 0 })
  col: number;
}

const SeatSchema = SchemaFactory.createForClass(Seat);

@Schema({ _id: false })
class LockedSeat {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  row: number;

  @Prop({ required: true, min: 0 })
  col: number;
}

const LockedSeatSchema = SchemaFactory.createForClass(LockedSeat);

@Schema({ _id: false })
class SeatLayout {
  @Prop({ required: true, min: 0 })
  rows: number;

  @Prop({ required: true, min: 0 })
  cols: number;
}

const SeatLayoutSchema = SchemaFactory.createForClass(SeatLayout);

@Schema({ timestamps: true })
export class Showtime {
  @Prop({ type: Types.ObjectId, ref: 'Movie', required: true })
  movieId: Types.ObjectId;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ type: [SeatSchema], default: [] })
  bookedSeats: Seat[];

  @Prop({ type: [LockedSeatSchema], default: [] })
  lockedSeats: LockedSeat[];

  @Prop({ required: true, min: 0 })
  totalSeats: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true })
  screenNo: number;

  @Prop({ type: SeatLayoutSchema, required: true })
  seatLayout: SeatLayout;
}

const ShowtimeSchema = SchemaFactory.createForClass(Showtime);
ShowtimeSchema.plugin(mongoosePaginate);

export { ShowtimeSchema };
