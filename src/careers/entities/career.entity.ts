import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export type CareerDocument = Document & Career;

@Schema({ timestamps: true })
export class Career {
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
  image: string;
}

const CareerSchema = SchemaFactory.createForClass(Career);

// Apply the mongoose paginate plugin
CareerSchema.plugin(mongoosePaginate);

export { CareerSchema };