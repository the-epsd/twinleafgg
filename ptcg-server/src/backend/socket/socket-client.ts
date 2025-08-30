import { Server, Socket } from 'socket.io';
import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Game } from '../../game/core/game';
import { State } from '../../game/store/state/state';
import { Message, User } from '../../storage';
import { CoreSocket } from './core-socket';
import { GameSocket } from './game-socket';
import { MessageSocket } from './message-socket';
import { SocketCache } from './socket-cache';
import { SocketWrapper } from './socket-wrapper';
import { MatchmakingSocket } from './matchmaking-socket';

export class SocketClient implements Client {

  public id: number = 0;
  public name: string;
  public user: User;
  public games: Game[] = [];
  public core: Core;
  public socket: SocketWrapper;
  private cache: SocketCache = new SocketCache();
  private coreSocket: CoreSocket;
  private gameSocket: GameSocket;
  private messageSocket: MessageSocket;
  private matchmakingSocket: MatchmakingSocket;

  constructor(user: User, core: Core, io: Server, socket: Socket) {
    this.user = user;
    this.name = user.name;
    this.socket = new SocketWrapper(io, socket);
    this.core = core;
    this.coreSocket = new CoreSocket(this, this.socket, core, this.cache);
    this.gameSocket = new GameSocket(this, this.socket, core, this.cache);
    this.messageSocket = new MessageSocket(this, this.socket, core);
    this.matchmakingSocket = new MatchmakingSocket(this, this.socket, core);
  }

  public onConnect(client: Client): void {
    this.coreSocket.onConnect(client);
  }

  public onDisconnect(client: Client): void {
    this.coreSocket.onDisconnect(client);
  }

  public onGameAdd(game: Game): void {
    this.coreSocket.onGameAdd(game);
  }

  public onGameDelete(game: Game): void {
    this.coreSocket.onGameDelete(game);
  }

  public onUsersUpdate(users: User[]): void {
    this.coreSocket.onUsersUpdate(users);
  }

  public onStateChange(game: Game, state: State): void {
    this.coreSocket.onStateChange(game, state);
    this.gameSocket.onStateChange(game, state);
  }

  public onGameJoin(game: Game, client: Client): void {
    this.gameSocket.onGameJoin(game, client);
  }

  public onGameLeave(game: Game, client: Client): void {
    this.gameSocket.onGameLeave(game, client);
  }

  public onJoinQueue(from: Client, message: Message): void {
    this.matchmakingSocket.onJoinQueue(from, message);
  }

  public onLeaveQueue(): void {
    this.matchmakingSocket.onLeaveQueue();
  }

  public onMessage(from: Client, message: Message): void {
    this.messageSocket.onMessage(from, message);
  }

  public onMessageRead(user: User): void {
    this.messageSocket.onMessageRead(user);
  }

  public onTimerUpdate(game: Game, playerStats: any[]): void {
    this.gameSocket.onTimerUpdate(game, playerStats);
  }

  public onPlayerDisconnected(game: Game, disconnectedClient: Client): void {
    this.gameSocket.onPlayerDisconnected(game, disconnectedClient);
  }

  public onPlayerReconnected(game: Game, reconnectedClient: Client): void {
    this.gameSocket.onPlayerReconnected(game, reconnectedClient);
  }

  public onConnectionStatusUpdate(game: Game, connectionStatuses: Array<{ playerId: number, playerName: string, isConnected: boolean, disconnectedAt?: number }>): void {
    this.gameSocket.onConnectionStatusUpdate(game, connectionStatuses);
  }

  public onReconnectionTimeout(game: Game, playerId: number, playerName: string): void {
    this.gameSocket.onReconnectionTimeout(game, playerId, playerName);
  }

  public onTimeoutWarning(game: Game, timeRemaining: number): void {
    this.gameSocket.onTimeoutWarning(game, timeRemaining);
  }

  public attachListeners(): void {
    this.socket.attachListeners();
  }

  public dispose(): void {
    this.coreSocket.dispose();
    this.gameSocket.dispose();
    this.messageSocket.dispose();
    this.matchmakingSocket.dispose();
  }
}