// @ts-ignore
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer, WsException
} from "@nestjs/websockets"

import { Server, Socket } from 'socket.io';
import {CreateMessageDto} from "../message/dto/create-message.dto";
import {ChatsService} from "./chats.service";
import {MessageService} from "../message/message.service";

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway implements OnGatewayConnection {
  constructor(
      private readonly chatsService: ChatsService,
      private readonly messageService: MessageService,
  ) {
  }

  @WebSocketServer() server: Server

  handleConnection(socket: Socket): any {
    console.log(`on connect called : ${socket.id}`)
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.emit('message', `${data}`)
  }



  @SubscribeMessage('send_message')
  async sendMessages(
      @ConnectedSocket() socket: Socket,
      @MessageBody() createMessageDto:CreateMessageDto, userId: string  ) {

      const chatExists = await this.chatsService.checkIfChatExists(createMessageDto.chatId)
      if (!chatExists) {
        throw new WsException(`존재하지 않는 채팅방입니다. Chat ID : ${createMessageDto.chatId}`)
      }

      const message = await this.messageService.createMessages(createMessageDto, userId)

      socket.to(message.chat.id.toString()).emit('receive_message', message.message)
  }



}