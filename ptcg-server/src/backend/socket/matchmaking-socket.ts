import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Message } from '../../storage';
import { ApiErrorEnum } from '../common/errors';
import { MessageInfo } from '../interfaces/message.interface';
import MatchmakingService from '../services/matchmaking.service';
import { CoreSocket } from './core-socket';
import { Response, SocketWrapper } from './socket-wrapper';

export class MatchmakingSocket {

  private client: Client;
  private matchmakingService: MatchmakingService;
  private isInQueue: boolean = false;

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;
    this.matchmakingService = MatchmakingService.getInstance(this.core);

    // message socket listeners
    this.socket.addListener('matchmaking:joinQueue', this.joinQueue.bind(this));
    this.socket.addListener('matchmaking:leaveQueue', this.leaveQueue.bind(this));

    // Handle disconnects
    this.socket.addListener('disconnect', () => {
      if (this.isInQueue) {
        this.matchmakingService.removeFromQueue(this.client.id);
      }
    });
  }

  public onJoinQueue(from: Client, message: Message): void {
    try {
      const messageInfo: MessageInfo = this.buildMessageInfo(message);
      const user = CoreSocket.buildUserInfo(from.user);
      this.socket.emit('message:received', { message: messageInfo, user });
    } catch (error) {
      console.error('Error in onJoinQueue:', error);
    }
  }

  public onLeaveQueue(): void {
    // Removed empty handler to prevent unnecessary socket events
  }

  private async joinQueue(params: { format: string, deck: string[] }, response: Response<void>): Promise<void> {
    try {
      if (!params || !params.format || !params.deck) {
        response('error', ApiErrorEnum.INVALID_FORMAT);
        return;
      }

      // Prevent duplicate queue joins
      if (this.isInQueue) {
        response('error', ApiErrorEnum.OPERATION_NOT_PERMITTED);
        return;
      }

      console.log(`Player ${this.client.id} joined queue for format: ${params.format}`);
      await this.matchmakingService.addToQueue(this.client.id, params.format, params.deck);
      this.isInQueue = true;
      response('ok');
    } catch (error) {
      console.error('Error in joinQueue:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private async leaveQueue(params: {}, response: Response<void>): Promise<void> {
    try {
      if (!this.isInQueue) {
        response('ok');
        return;
      }

      await this.matchmakingService.removeFromQueue(this.client.id);
      this.isInQueue = false;
      response('ok');
    } catch (error) {
      console.error('Error in leaveQueue:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private buildMessageInfo(message: Message): MessageInfo {
    if (!message) {
      throw new Error('Invalid message object');
    }

    return {
      messageId: message.id,
      senderId: message.sender.id,
      created: message.created,
      text: message.text,
      isRead: message.isRead
    };
  }

}