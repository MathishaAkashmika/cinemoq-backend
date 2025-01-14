import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;
}

const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(mongoosePaginate);

export { CategorySchema };
