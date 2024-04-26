import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('joinChannel')
  handleJoinChannel(client: Socket, channelId: string): void {
    client.join(channelId);
  }

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, payload: any): void {
    // Émettre le message uniquement aux clients du même canal
    client.join(payload.channelId);
    this.server.to(payload.channelId).emit('newMessage', payload);
  }
}