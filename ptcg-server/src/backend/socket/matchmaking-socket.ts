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

    this.socket.addListener('matchmaking:join', this.joinQueue.bind(this));
    this.socket.addListener('matchmaking:leave', this.leaveQueue.bind(this));
    this.socket.addListener('matchmaking:getQueueData', this.getQueueData.bind(this));
  }

  public onJoinQueue(from: Client, message: Message): void {
    this.socket.emit('matchmaking:playerJoined', {
      player: from.user.name
    });
  }

  public onLeaveQueue(): void {
    // The matchmaking service will handle broadcasting to all clients
    // No need to emit here since broadcastQueueUpdate() is called by the service
  }

  public getQueueData(response: Response<{ players: string[], formatCounts: { [format: number]: number } }>): void {
    response('ok', {
      players: this.matchmakingService.getQueuedPlayers(),
      formatCounts: this.matchmakingService.getQueueCountsByFormat()
    });
  }

  public joinQueue(params: { format: Format, deck: string[], artworks?: { code: string; artworkId?: number }[], deckId?: number }, response: Response<void>): void {
    if (!params || !params.format || !Array.isArray(params.deck) || params.deck.length === 0) {
      response('error', ApiErrorEnum.INVALID_FORMAT);
      return;
    }

    this.matchmakingService.addToQueue(
      this.client,
      this.socket,
      params.format,
      params.deck,
      params.artworks,
      params.deckId
    );
    response('ok');
  }

  private leaveQueue(_params: void, response: Response<void>): void {
    if (this.matchmakingService.isPlayerInQueue(this.client)) {
      this.matchmakingService.removeFromQueue(this.client);
    }
    response('ok');
  }

  public dispose(): void {
    if (this.matchmakingService.isPlayerInQueue(this.client)) {
      this.matchmakingService.removeFromQueue(this.client);
    }
    this.socket.removeListener('matchmaking:join');
    this.socket.removeListener('matchmaking:leave');
  }
}