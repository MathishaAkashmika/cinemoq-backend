import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true }) // Adds createdAt and updatedAt automatically
export class Message extends Document {
  @Prop({ required: true })
  content: string; // Main message text

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // Link to the user who sent the message

  @Prop()
  firstName: string; // Populated from the user's collection for convenience

  @Prop()
  lastName: string; // Populated from the user's collection for convenience

  @Prop([
    {
      content: { type: String, required: true }, // Text of the reply
      userId: { type: Types.ObjectId, ref: 'User', required: true }, // User who replied
      firstName: { type: String }, // Reply sender's first name
      lastName: { type: String },  // Reply sender's last name
      createdAt: { type: Date, default: Date.now }, // Timestamp for the reply
    },
  ])
  replies: Types.Array<{
    content: string;
    userId: Types.ObjectId;
    firstName: string;
    lastName: string;
    createdAt: Date;
  }>; // Array of replies
}

export const MessageSchema = SchemaFactory.createForClass(Message);
