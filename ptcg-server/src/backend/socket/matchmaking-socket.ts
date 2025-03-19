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
  }

  public onJoinQueue(from: Client, message: Message): void {
    try {
      if (!this.socket.isConnected()) {
        console.warn(`[Matchmaking] Cannot notify disconnected player ${this.client.name} about queue join`);
        return;
      }

      this.socket.emit('matchmaking:playerJoined', {
        player: from.user.name
      });
    } catch (error: any) {
      console.error(`[Matchmaking] Error notifying player about queue join: ${error.message || error}`);
    }
  }

  public onLeaveQueue(): void {
    try {
      if (!this.socket.isConnected()) {
        console.warn(`[Matchmaking] Cannot update disconnected player ${this.client.name} about queue update`);
        return;
      }

      this.socket.emit('matchmaking:queueUpdate', {
        players: this.matchmakingService.getQueuedPlayers()
      });
    } catch (error: any) {
      console.error(`[Matchmaking] Error notifying player about queue update: ${error.message || error}`);
    }
  }

  private joinQueue(params: { format: Format, deck: string[] }, response: Response<void>): void {
    try {
      if (!params || !params.format || !Array.isArray(params.deck) || params.deck.length === 0) {
        console.warn(`[Matchmaking] Player ${this.client.name} tried to join queue with invalid parameters`);
        response('error', ApiErrorEnum.INVALID_FORMAT);
        return;
      }

      if (!this.socket.isConnected()) {
        console.warn(`[Matchmaking] Player ${this.client.name} tried to join queue with disconnected socket`);
        response('error', ApiErrorEnum.SOCKET_ERROR);
        return;
      }

      console.log(`[Matchmaking] Player ${this.client.name} joined queue for format: ${params.format}`);

      this.matchmakingService.addToQueue(
        this.client,
        this.socket,
        params.format,
        params.deck
      );

      response('ok');
    } catch (error: any) {
      console.error(`[Matchmaking] Error joining queue: ${error.message || error}`);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  private leaveQueue(_params: void, response: Response<void>): void {
    try {
      if (this.matchmakingService.isPlayerInQueue(this.client)) {
        console.log(`[Matchmaking] Player ${this.client.name} is leaving queue`);
        this.matchmakingService.removeFromQueue(this.client);
      } else {
        console.log(`[Matchmaking] Player ${this.client.name} tried to leave queue but wasn't in it`);
      }

      response('ok');
    } catch (error: any) {
      console.error(`[Matchmaking] Error leaving queue: ${error.message || error}`);
      response('error', ApiErrorEnum.SOCKET_ERROR);
    }
  }

  public dispose(): void {
    try {
      console.log(`[Matchmaking] Disposing socket for player ${this.client.name}`);

      if (this.matchmakingService.isPlayerInQueue(this.client)) {
        this.matchmakingService.removeFromQueue(this.client);
      }
    } catch (error: any) {
      console.error(`[Matchmaking] Error disposing matchmaking socket: ${error.message || error}`);
    }
  }
}