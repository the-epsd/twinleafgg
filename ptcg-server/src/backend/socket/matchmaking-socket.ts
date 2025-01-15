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
  private boundJoinQueue = this.joinQueue.bind(this);
  private boundLeaveQueue = this.leaveQueue.bind(this);

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;
    this.matchmakingService = MatchmakingService.getInstance(this.core);
    this.bindListeners();
  }

  private bindListeners(): void {
    this.socket.addListener('matchmaking:joinQueue', this.boundJoinQueue);
    this.socket.addListener('matchmaking:leaveQueue', this.boundLeaveQueue);
  }

  public onJoinQueue(from: Client, message: Message): void {
    const messageInfo: MessageInfo = this.buildMessageInfo(message);
    const user = CoreSocket.buildUserInfo(from.user);
    this.socket.emit('message:received', { message: messageInfo, user });
  }

  public onLeaveQueue(from: Client): void {
    this.socket.emit('matchmaking:left', { user: CoreSocket.buildUserInfo(from.user) });
  }

  private joinQueue(params: { format: string, deck: string[] }, response: Response<void>): void {
    if (!params.format) {
      response('error', ApiErrorEnum.INVALID_FORMAT);
      return;
    }

    this.matchmakingService.addToQueue(this.client.id, params.format, params.deck);

    response('ok');
  }

  private leaveQueue(params: {}, response: Response<void>): void {
    this.matchmakingService.removeFromQueue(this.client.id);

    response('ok');
  }

  public destroy(): void {
    this.socket.socket.removeListener('matchmaking:joinQueue', this.boundJoinQueue);
    this.socket.socket.removeListener('matchmaking:leaveQueue', this.boundLeaveQueue);
    this.matchmakingService.removeFromQueue(this.client.id);
  }

  private buildMessageInfo(message: Message): MessageInfo {
    const messageInfo: MessageInfo = {
      messageId: message.id,
      senderId: message.sender.id,
      created: message.created,
      text: message.text,
      isRead: message.isRead
    };
    return messageInfo;
  }

}
