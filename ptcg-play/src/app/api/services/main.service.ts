import { Injectable } from '@angular/core';
import { GameInfo, CoreInfo, ClientInfo, GameSettings, UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { GameService } from './game.service';
import { ClientUserData } from '../interfaces/main.interface';
import { SessionService } from '../../shared/session/session.service';
import { SocketService } from '../socket.service';

@Injectable()
export class MainService {

  public loading = false;
  private isInitialized = false;

  constructor(
    private gameService: GameService,
    private sessionService: SessionService,
    private socketService: SocketService
  ) { }

  public init(coreInfo: CoreInfo): void {
    // Clean up existing listeners if already initialized
    if (this.isInitialized) {
      this.cleanup();
    }

    this.isInitialized = true;
    const users = { ...this.sessionService.session.users };
    coreInfo.users.forEach(user => users[user.userId] = user);

    this.sessionService.set({
      users,
      clients: coreInfo.clients,
      games: coreInfo.games,
      clientId: coreInfo.clientId
    });
    if (coreInfo.reconnectableGameId !== undefined) {
      this.socketService.setGameId(coreInfo.reconnectableGameId);
    }
    this.socketService.on('core:join', (data: ClientUserData) => this.onJoin(data));
    this.socketService.on('core:leave', (clientId: number) => this.onLeave(clientId));
    this.socketService.on('core:gameInfo', (game: GameInfo) => this.onGameInfo(game));
    this.socketService.on('core:usersInfo', (infos: UserInfo[]) => this.onUsersInfo(infos));
    this.socketService.on('core:createGame', (game: GameInfo) => this.onCreateGame(game));
    this.socketService.on('core:deleteGame', (gameId: number) => this.onDeleteGame(gameId));
  }

  private autoJoinGame(game: GameInfo) {
    const session = this.sessionService.session;
    const games = session.gameStates;
    const index = games.findIndex(g => g.gameId === game.gameId && g.deleted === false);
    if (index !== -1) {
      return;
    }
    const clientId = session.clientId;
    const isPlayerByClientId = game.players.some(p => p.clientId === clientId);
    const isPlayerByUserId = game.playerUserIds && game.playerUserIds.indexOf(session.loggedUserId) !== -1;
    if (isPlayerByClientId) {
      this.gameService.join(game.gameId).subscribe(() => { }, () => { });
    } else if (isPlayerByUserId) {
      // We are a player (by userId) but not by clientId – e.g. after reload. Trigger rejoin.
      this.socketService.tryRejoinGame(game.gameId);
    }
  }

  private onJoin(data: ClientUserData): void {
    const users = { ...this.sessionService.session.users };
    users[data.user.userId] = data.user;
    const client: ClientInfo = { clientId: data.clientId, userId: data.user.userId };
    const clients = [...this.sessionService.session.clients, client];
    this.sessionService.set({ clients, users });
  }

  private onLeave(clientId: number): void {
    const clients = this.sessionService.session.clients.filter(c => c.clientId !== clientId);
    this.sessionService.set({ clients });
  }

  private onGameInfo(game: GameInfo): void {
    const games = this.sessionService.session.games.slice();
    const index = this.sessionService.session.games.findIndex(g => g.gameId === game.gameId);
    if (index !== -1) {
      games[index] = game;
    } else {
      // Game not in session.games yet - add it
      // This can happen when a player is added via invitation acceptance
      // and the client wasn't connected when the game was created
      games.push(game);
    }
    this.sessionService.set({ games });
    this.autoJoinGame(game);
  }

  private onUsersInfo(userInfos: UserInfo[]): void {
    const users = { ...this.sessionService.session.users };
    userInfos.forEach(u => { users[u.userId] = u; });
    this.sessionService.set({ users });
  }

  private onCreateGame(game: GameInfo): void {
    const index = this.sessionService.session.games.findIndex(g => g.gameId === game.gameId);
    if (index !== -1) {
      return;
    }
    const games = [...this.sessionService.session.games, game];
    this.sessionService.set({ games });
    this.autoJoinGame(game);
  }

  private onDeleteGame(gameId: number): void {
    const games = this.sessionService.session.games.filter(g => g.gameId !== gameId);
    this.gameService.markAsDeleted(gameId);
    this.sessionService.set({ games });
  }

  public getCoreInfo(): Observable<CoreInfo> {
    this.loading = true;
    return this.socketService.emit<void, CoreInfo>('core:getInfo')
      .pipe(finalize(() => { this.loading = false; }));
  }

  public createGame(deck: string[], gameSettings: GameSettings, clientId?: number, deckId?: number, sleeveImagePath?: string) {
    this.loading = true;
    return this.socketService.emit('core:createGame', { deck, gameSettings, clientId, deckId, sleeveImagePath })
      .pipe(finalize(() => { this.loading = false; }));
  }

  /**
   * Clean up socket listeners to prevent memory leaks
   */
  public cleanup(): void {
    this.socketService.off('core:join');
    this.socketService.off('core:leave');
    this.socketService.off('core:gameInfo');
    this.socketService.off('core:usersInfo');
    this.socketService.off('core:createGame');
    this.socketService.off('core:deleteGame');
    this.isInitialized = false;
  }

}
