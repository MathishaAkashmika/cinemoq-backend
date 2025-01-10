import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { IsNotEmpty, IsDate, IsString } from 'class-validator';

export type AnnouncementDocument = Document & Announcement;

@Schema({ timestamps: true })
export class Announcement {
  _id: unknown;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  description: string;

  @IsNotEmpty()
  @IsDate()
  @Prop({ required: true })
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Prop({ required: true })
  endDate: Date;
}

const AnnouncementSchema = SchemaFactory.createForClass(Announcement);

// Apply the mongoose paginate plugin
AnnouncementSchema.plugin(mongoosePaginate);

export { AnnouncementSchema };