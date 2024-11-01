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

  constructor(client: Client, private socket: SocketWrapper, private core: Core) {
    this.client = client;
    this.matchmakingService = MatchmakingService.getInstance(this.core);

    // message socket listeners
    this.socket.addListener('matchmaking:joinQueue', this.joinQueue.bind(this));
    this.socket.addListener('matchmaking:leaveQueue', this.leaveQueue.bind(this));
  }

  public onJoinQueue(from: Client, message: Message): void {
    const messageInfo: MessageInfo = this.buildMessageInfo(message);
    const user = CoreSocket.buildUserInfo(from.user);
    this.socket.emit('message:received', { message: messageInfo, user });
  }

  public onLeaveQueue(): void {
    // this.socket.emit('message:read', { user: CoreSocket.buildUserInfo(user) });
  }
  
  private joinQueue(params: { format: string, deck: string[] }, response: Response<void>): void {
    if (!params.format) {
      response('error', ApiErrorEnum.INVALID_FORMAT);
      return;
    }
    
    this.matchmakingService.addToQueue(this.client.id, params.format, params.deck);

    response('ok');
  }
  
  private leaveQueue(params: { }, response: Response<void>): void {
    this.matchmakingService.removeFromQueue(this.client.id);

    response('ok');
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
