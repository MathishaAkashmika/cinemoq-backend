import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  profilePicture: string;

  @Prop([
    {
      content: { type: String, required: true },
      userId: { type: Types.ObjectId, ref: 'User', required: true },
      firstName: String,
      lastName: String,
      profilePicture: String,
      createdAt: { type: Date, default: Date.now },
    },
  ])
  replies: Array<{
    content: string;
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    profilePicture: string;
    createdAt: Date;
  }>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
