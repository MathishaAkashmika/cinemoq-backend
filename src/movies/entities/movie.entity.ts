import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsString,
  Min,
  Max,
  IsBoolean,
  IsArray,
} from 'class-validator';

export type MovieDocument = Document & Movie;

@Schema({ timestamps: true })
export class Movie {
  _id: unknown;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsString()
  @Prop({ default: '' })
  description: string;

  @IsString()
  @Prop({ default: '' })
  thumbnailImage: string;

  @IsString()
  @Prop({ default: '' })
  heroImage: string;

  @IsBoolean()
  @Prop({ default: false })
  isHero: boolean;

  @IsNumber()
  @Min(0)
  @Prop({ required: true })
  price: number;

  @IsString()
  @Prop({ default: '' })
  genre: string;

  @IsString()
  @Prop({ default: '' })
  categoryId: Types.ObjectId;

  @IsString()
  @Prop({ default: '' })
  director: string;

  @IsDate()
  @Prop({ default: null })
  releaseDate: Date;

  @IsNumber()
  @Min(0)
  @Max(10)
  @Prop({ default: 0 })
  rating: number;

  @IsArray()
  @Prop({ type: [String], default: [] })
  cast: string[];

  @IsNumber()
  @Prop({ default: 0 })
  durationMinutes: number;
}

const MovieSchema = SchemaFactory.createForClass(Movie);

// Apply the mongoose paginate plugin
MovieSchema.plugin(mongoosePaginate);

export { MovieSchema };
