import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the guard
import { CreateMessageDto } from './dto/create-message.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('chat')
@ApiBearerAuth() // Adds BearerAuth to Swagger for testing
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Create a new chat message' })
  @UseGuards(JwtAuthGuard) // Protect this route
  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto.content, {
      userId: createMessageDto.userId,
      firstName: createMessageDto.firstName,
      lastName: createMessageDto.lastName,
      profilePicture: createMessageDto.profilePicture,
    });
  }

  @ApiOperation({ summary: 'Add a reply to a message' })
  @UseGuards(JwtAuthGuard) // Protect this route
  @Post(':id/reply')
  async addReply(@Param('id') messageId: string, @Body() addReplyDto: AddReplyDto) {
    return this.chatService.addReply(messageId, {
      content: addReplyDto.content,
      userId: addReplyDto.userId,
      firstName: addReplyDto.firstName,
      lastName: addReplyDto.lastName,
      profilePicture: addReplyDto.profilePicture,
    });
  }

  @ApiOperation({ summary: 'Get all chat messages and replies' })
  @UseGuards(JwtAuthGuard) // Protect this route
  @Get()
  async getMessages() {
    return this.chatService.getMessages();
  }
}
