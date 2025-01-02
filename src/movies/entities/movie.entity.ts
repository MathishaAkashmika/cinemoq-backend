import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  thumbnailImage: string;

  @Prop({ required: true })
  bannerImage: string;

  @Prop({ required: true, default: true })
  is_thumbnail: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

const MovieSchema = SchemaFactory.createForClass(Movie);
MovieSchema.plugin(mongoosePaginate);

// This will run before saving and update timestamps
MovieSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

export { MovieSchema };
