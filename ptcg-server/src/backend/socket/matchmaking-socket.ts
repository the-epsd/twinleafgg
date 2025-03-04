import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Format } from '../../game';
import { ApiErrorEnum } from '../common/errors';
import { MatchmakingService } from '../services/matchmaking.service';
import { SocketWrapper, Response } from './socket-wrapper';
import { Message } from '../../storage';

export class MatchmakingSocket {
  private matchmakingService: MatchmakingService;

  constructor(
    private client: Client,
    private socket: SocketWrapper,
    private core: Core
  ) {
    this.matchmakingService = MatchmakingService.getInstance(this.core);

    // Set up socket listeners
    this.socket.addListener('matchmaking:join', this.joinQueue.bind(this));
    this.socket.addListener('matchmaking:leave', this.leaveQueue.bind(this));
  }

  // Add these methods to match the Client interface expectations
  public onJoinQueue(from: Client, message: Message): void {
    // This method is called when another client joins the queue
    // You might want to update the UI or handle other logic
    this.socket.emit('matchmaking:playerJoined', {
      player: from.user.name
    });
  }

  public onLeaveQueue(): void {
    // This method is called when another client leaves the queue
    // You might want to update the UI or handle other logic
    this.socket.emit('matchmaking:queueUpdate', {
      players: this.matchmakingService.getQueuedPlayers()
    });
  }

  private joinQueue(params: { format: Format, deck: string[] }, response: Response<void>): void {
    if (!params.format || !Array.isArray(params.deck)) {
      response('error', ApiErrorEnum.INVALID_FORMAT);
      return;
    }

    try {
      this.matchmakingService.addToQueue(
        this.client,
        this.socket,
        params.format,
        params.deck
      );
      response('ok');
    } catch (error) {
      console.error('Error joining queue:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private leaveQueue(_params: void, response: Response<void>): void {
    try {
      this.matchmakingService.removeFromQueue(this.client);
      response('ok');
    } catch (error) {
      console.error('Error leaving queue:', error);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  public dispose(): void {
    // Clean up when socket disconnects
    this.matchmakingService.removeFromQueue(this.client);
  }
}