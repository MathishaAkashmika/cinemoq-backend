import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // Create a new message
  async createMessage(
    content: string,
    user: { userId: string; firstName: string; lastName: string },
  ) {
    const newMessage = new this.messageModel({
      content,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
    });
    return newMessage.save();
  }

  // Add a reply to a message
  async addReply(
    messageId: string,
    reply: {
      content: string;
      userId: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.messageModel.findByIdAndUpdate(
      messageId,
      { $push: { replies: reply } },
      { new: true }, // Return the updated message
    );
  }

  // Get all messages with replies
  async getMessages() {
    return this.messageModel.find().populate('userId').exec(); // Populate user details if needed
  }
}
