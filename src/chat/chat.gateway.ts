import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(
      private readonly jwtService: JwtService,
      private readonly chatService: ChatService,
    ) {}
  
    // Handle client connection
    async handleConnection(client: Socket) {
      try {
        const token = client.handshake.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('Token not provided');
  
        // Verify the JWT
        const user = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        client.data.user = user; // Attach user info to the client
        console.log(`Client connected: ${user.email}`);
      } catch (error) {
        console.log('Connection denied:', error.message);
        client.disconnect(); // Disconnect unauthorized clients
      }
    }
  
    // Handle client disconnection
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Handle "sendMessage" events
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
      @ConnectedSocket() client: Socket,
      @MessageBody() message: { content: string },
    ) {
      const user = client.data.user; // Retrieve user info from the connection
      if (!user) return; // Reject if user is not authenticated
  
      // Save the message in the database
      const savedMessage = await this.chatService.createMessage(message.content, {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      });
  
      // Broadcast the message to all clients
      this.server.emit('receiveMessage', savedMessage);
    }
  }
  