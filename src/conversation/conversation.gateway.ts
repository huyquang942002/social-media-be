import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ConversationService } from '../services/conversation.service';
import {
  CreateConversationDto,
  DeleteConversationDto,
  DetailConversationFilter,
  GhimMessageDto,
  ListConversationFilter,
} from './dto/conversation.dto';
import { Socket, Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ConversationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly conversationService: ConversationService) {}
  @WebSocketServer() server: Server;

  // CHAT WITH OTHER USER

  @SubscribeMessage('chat')
  async createChat(
    @MessageBody() dto: CreateConversationDto,
    @ConnectedSocket() client: any,
  ) {
    try {
      const conversation = await this.conversationService.createChat(
        dto,
        client.handshake.headers.authorization,
      );
      this.server.emit('listenChat', conversation);
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(
    @MessageBody() dto: DeleteConversationDto,
    @ConnectedSocket() client: any,
  ) {
    try {
      const conversation = await this.conversationService.deleteChat(
        dto,
        client.handshake.headers.authorization,
      );
      this.server.emit('listenDeleteChat', conversation);
      return conversation;
    } catch (error) {
      throw error;
    }
  }

  // GHIM MESSAGE BY ID CONVERSATION

  @SubscribeMessage('ghimMessage')
  async ghimMessage(
    @MessageBody() dto: GhimMessageDto,
    @ConnectedSocket() client: any,
  ) {
    try {
      const conversation = await this.conversationService.ghimMessage(
        dto,
        client.handshake.headers.authorization,
      );
      this.server.emit('listenGhimMessage', conversation);
      return {
        message: 'Ghim Success',
      };
    } catch (error) {
      throw error;
    }
  }

  // LIST GHIM MESSAGE

  // @SubscribeMessage('listGhimMessasge')
  // async listGhimMessasge(
  //   @MessageBody('receiverId') receiverId: string,
  //   @ConnectedSocket() client: any,
  // ) {
  //   try {
  //     const conversation = await this.conversationService.listGhimMessasge(
  //       receiverId,
  //       client.handshake.headers.authorization,
  //     );
  //     this.server.emit('listenListGhimMessasge', conversation);
  //     return conversation;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // DETAIL CONVERSATIONx

  @SubscribeMessage('detailConversation')
  async detailConversation(
    @MessageBody() dto: DetailConversationFilter,
    @ConnectedSocket() client: any,
  ) {
    try {
      const listConversation =
        await this.conversationService.detailConversation(
          dto,
          client.handshake.headers.authorization,
        );
      this.server.emit('listenDetailConversation', listConversation);
      return listConversation;
    } catch (error) {
      throw error;
    }
  }

  // LIST CONVERSATION

  @SubscribeMessage('listConversation')
  async listConversation(
    @MessageBody() dto: ListConversationFilter,
    @ConnectedSocket() client: any,
  ) {
    try {
      const listConversation = await this.conversationService.listConversation(
        dto,
        client.handshake.headers.authorization,
      );
      this.server.emit('listenListConversation', listConversation);
      return listConversation;
    } catch (error) {
      throw error;
    }
  }

  // @SubscribeMessage('sharePost')
  // async sharePost(
  //   @ConnectedSocket() client: any,
  //   @MessageBody() sharePostDto: SharePostDto,
  // ) {
  //   try {
  //     const conversation = await this.conversationService.sharePost(
  //       sharePostDto,
  //       client.handshake.headers.authorization,
  //     );
  //     this.server.emit('client_sharePost', conversation);
  //     return conversation;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }
}
