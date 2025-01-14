import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  question: string;

  @Prop()
  answer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
