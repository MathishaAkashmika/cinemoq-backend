import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { UnauthorizedException } from '@nestjs/common';
  import { SupportService } from './support.service';
  import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
  
  @ApiTags('Customer Support WebSocket') // Swagger category for WebSocket
  @ApiBearerAuth() // Indicates JWT is required
  @WebSocketGateway({ cors: true })
  export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private connectedClients: Map<string, { username: string; userType: string }> = new Map();
  
    constructor(
      private readonly jwtService: JwtService,
      private readonly supportService: SupportService,
    ) {}
  
    async handleConnection(client: Socket) {
      const token = client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        throw new UnauthorizedException('Authentication token missing');
      }
  
      try {
        const payload = this.jwtService.verify(token, { secret: 'JWT_PUBLIC_KEY' });
        this.connectedClients.set(client.id, { username: payload.email, userType: payload.userType });
        console.log(`Client connected: ${payload.email}`);
      } catch (error) {
        client.disconnect();
        throw new UnauthorizedException('Invalid authentication token');
      }
    }
  
    handleDisconnect(client: Socket) {
      console.log('Client disconnected:', client.id);
      this.connectedClients.delete(client.id);
    }
  
    @SubscribeMessage('ask-question')
    async handleAskQuestion(client: Socket, payload: { question: string }) {
      const user = this.connectedClients.get(client.id);
      if (!user) {
        client.disconnect();
        throw new UnauthorizedException('User not authenticated');
      }
  
      // Save the question to the database
      const savedQuestion = await this.supportService.saveQuestion(user.username, payload.question);
  
      const newQuestion = {
        id: savedQuestion._id,
        userId: client.id,
        username: user.username,
        question: savedQuestion.question,
      };
  
      console.log(`Question from ${user.username}: ${payload.question}`);
      this.server.emit('new-question', newQuestion);
    }
  
    @SubscribeMessage('answer-question')
    async handleAnswerQuestion(client: Socket, payload: { questionId: string; answer: string }) {
      const user = this.connectedClients.get(client.id);
      if (!user || user.userType !== 'admin') {
        throw new UnauthorizedException('Only admins can answer questions');
      }
  
      // Save the answer in the database
      const updatedQuestion = await this.supportService.saveAnswer(payload.questionId, payload.answer);
  
      const userSocketId = [...this.connectedClients.entries()]
        .find(([socketId, details]) => details.username === updatedQuestion.username)?.[0];
  
      console.log(`Answer by admin (${user.username}): ${payload.answer}`);
  
      if (userSocketId) {
        this.server.to(userSocketId).emit('answer', {
          answer: payload.answer,
          admin: user.username,
        });
      }
    }
  }
  