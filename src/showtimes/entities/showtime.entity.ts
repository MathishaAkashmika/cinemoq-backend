import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Movie } from 'src/movies/entities/movie.entity';

export type ShowtimeDocument = Showtime & Document;

@Schema({ timestamps: true })
export class Showtime {
  _id: unknown;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true })
  movie: Movie;

  @Prop({ required: true })
  showDate: Date;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  bookedSeats: string[];

  @Prop({ required: true, min: 0 })
  totalSeats: number;

  @Prop({ required: true, min: 0 })
  availableSeats: number;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ default: '' })
  screenNumber: string;

  @Prop({ type: Object, default: {} })
  seatLayout: Record<string, any>;
}

const ShowtimeSchema = SchemaFactory.createForClass(Showtime);
ShowtimeSchema.plugin(mongoosePaginate);

export { ShowtimeSchema };
