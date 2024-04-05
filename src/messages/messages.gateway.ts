import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*' })
export class MessagesGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('newMessage')
  handleNewMessage(client: Socket, payload: any): void {
    this.server.emit('newMessage', payload);
  }
}