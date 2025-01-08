import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>) {}

  // Create a new message
  async createMessage(content: string, user: { userId: string; firstName: string; lastName: string; profilePicture: string }) {
    const newMessage = new this.messageModel({
      content: content,
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
    });
    return newMessage.save();
  }

  // Add a reply to an existing message
  async addReply(
    messageId: string,
    reply: { content: string; userId: string; firstName: string; lastName: string; profilePicture: string },
  ) {
    return this.messageModel.findByIdAndUpdate(
      messageId, // The ID of the message being replied to
      {
        $push: {
          replies: {
            content: reply.content,
            userId: reply.userId,
            firstName: reply.firstName,
            lastName: reply.lastName,
            profilePicture: reply.profilePicture,
            createdAt: new Date(),
          },
        },
        updatedAt: new Date(), // Update the timestamp
      },
      { new: true }, // Return the updated document
    );
  }

  // Retrieve all messages
  async getMessages() {
    return this.messageModel.find().exec();
  }
}
