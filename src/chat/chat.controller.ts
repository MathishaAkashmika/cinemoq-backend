import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat') // Groups endpoints under the "chat" section in Swagger
@ApiBearerAuth() // Indicates that these endpoints require authentication
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Create a new chat message' })
  @Post()
  async createMessage(
    @Body()
    body: {
      content: string;
      userId: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.chatService.createMessage(body.content, {
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
    });
  }

  @ApiOperation({ summary: 'Reply to an existing message' })
  @Post(':id/reply')
  async addReply(
    @Param('id') messageId: string,
    @Body()
    body: {
      content: string;
      userId: string;
      firstName: string;
      lastName: string;
    },
  ) {
    return this.chatService.addReply(messageId, {
      content: body.content,
      userId: body.userId,
      firstName: body.firstName,
      lastName: body.lastName,
    });
  }

  @ApiOperation({ summary: 'Get all messages with replies' })
  @Get()
  async getMessages() {
    return this.chatService.getMessages();
  }
}
