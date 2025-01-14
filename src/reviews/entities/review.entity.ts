import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
